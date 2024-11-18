create table images (
	id int generated always as identity primary key,
	object_id UUID unique not null references storage.objects(id) on update cascade on delete cascade,
	name text unique not null,
	user_id UUID,	-- 上传这个图片的用户，注意不能非空或使用外键，否则无法通过仪表盘上传图片
	last_modified_date timestamp without time zone default now(),
	document text,
	embedding halfvec(3072)
);

-- 创建HNSW内积索引
CREATE INDEX ON images USING hnsw (embedding halfvec_ip_ops);

create policy "Enable users to view their own data only"
on public.images
as PERMISSIVE
for SELECT
to authenticated
using (
	(select auth.uid()) = user_id
);

create policy "Enable insert for users based on user_id"
on public.images
as PERMISSIVE
for INSERT
to authenticated
with check (
	(select auth.uid()) = user_id
);

create policy "Enable delete for users based on user_id"
on public.images
as PERMISSIVE
for DELETE
to authenticated
using (
	(select auth.uid()) = user_id
);

create policy "Enable users to update their own data only"
on public.images
as PERMISSIVE
for UPDATE
to authenticated
using (
	(select auth.uid()) = user_id
)
with check (
	(select auth.uid()) = user_id
);

CREATE POLICY "Enable read access for all users"
ON storage.buckets
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- 获取文件夹大小
CREATE OR REPLACE FUNCTION storage.get_folder_size(folder_path TEXT)
RETURNS BIGINT AS $$
DECLARE
	total_size BIGINT := 0;
	search_path TEXT;
BEGIN
	-- 删除开头的 '/'（如果存在）
	IF LEFT(folder_path, 1) = '/' THEN
		search_path := SUBSTRING(folder_path FROM 2);
	ELSE
		search_path := folder_path;
	END IF;

	-- 确保路径以 '/' 结尾
	IF RIGHT(search_path, 1) != '/' THEN
		search_path := search_path || '/';
	END IF;

	-- 计算文件夹中所有文件的总大小
	SELECT COALESCE(SUM((metadata->>'size')::BIGINT), 0)
	INTO total_size
	FROM storage.objects
	WHERE name LIKE search_path || '%'
		AND name != search_path  -- 排除文件夹本身
		AND storage.extension(name) != '';  -- 只计算文件，不计算子文件夹
	RETURN total_size;
END;
$$ LANGUAGE plpgsql;

-- 获取当前用户的文件夹大小
CREATE VIEW used_storage
WITH (security_invoker) AS
SELECT storage.get_folder_size(auth.uid()::TEXT) AS used_storage;

CREATE POLICY "根据用户订阅的计划限制上传"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
	bucket_id = 'images'
	AND ((auth.uid())::text = (storage.foldername(name))[1])
	AND (
		SELECT
		CASE (auth.jwt()->>'plan')::text
			WHEN 'pro/mouth' THEN
				(auth.jwt()->>'cycle_indexed_count')::int < 1777
					AND storage.get_folder_size(auth.uid()::text) < 177 * 1024 * 1024 * 1024	-- 177GB for pro plan
			WHEN 'pro/year' THEN
				(auth.jwt()->>'cycle_indexed_count')::int < 17777
					AND storage.get_folder_size(auth.uid()::text) < 177 * 1024 * 1024 * 1024	-- 177GB for pro plan
			ELSE
				(auth.jwt()->>'cycle_indexed_count')::int < 177
					AND storage.get_folder_size(auth.uid()::text) < 5 * 1024 * 1024 * 1024	-- 5GB for free plan
		END
	)
);

-- 上传图片时，将图片信息插入到 images 表中
CREATE OR REPLACE FUNCTION public.insert_new_image()
RETURNS trigger AS $$
BEGIN
	IF NEW.bucket_id = 'images' THEN
		INSERT INTO public.images(object_id, user_id, name, last_modified_date)
		VALUES (NEW.id, NEW.owner_id::UUID, NEW.name, NEW.user_metadata->>'lastModifiedDate');
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER upload_new_image
AFTER INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.insert_new_image();

-- 建立一个视图，联合查询 storage.objects 和 images 表
CREATE OR REPLACE VIEW image_details
WITH (security_invoker) AS
SELECT
	i.id,
	o.owner_id::UUID,
	o.name,
	storage.filename(o.name) AS filename,
	i.embedding,
	i.last_modified,
	o.created_at,
	o.updated_at,
	o.last_accessed_at,
	o.version,
	o.metadata,
	o.user_metadata
FROM
	public.images i,
	storage.objects o
WHERE
	i.object_id = o.id
	AND o.owner_id::UUID = auth.uid()
	AND o.bucket_id = 'images';

-- 创建或替换函数
CREATE OR REPLACE FUNCTION auth.add_cycle_indexed_count()
RETURNS trigger AS $$
DECLARE
	current_count INT;
	user_id UUID;
BEGIN
	-- 如果 embedding 没有被更新或为 NULL，直接返回
	IF NEW.embedding IS NULL OR NEW.embedding = OLD.embedding THEN
		RETURN NEW;
	END IF;

	-- 获取关联的用户 ID
	SELECT i.user_id INTO user_id
	FROM images i
	WHERE i.id = NEW.id;

	-- 如果没有找到用户 ID，直接返回
	IF user_id IS NULL THEN
		RETURN NEW;
	END IF;

	-- 获取当前计数，不存在则默认为 0
	SELECT COALESCE((raw_app_meta_data->>'cycle_indexed_count')::int, 0)
	INTO current_count
	FROM auth.users
	WHERE id = user_id;

	-- 更新计数
	UPDATE auth.users
	SET raw_app_meta_data = jsonb_set(
		COALESCE(raw_app_meta_data, '{}'::jsonb),
		'{cycle_indexed_count}',
		to_jsonb(current_count + 1)
	)
	WHERE id = user_id;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER increment_cycle_indexed_count_trigger
AFTER UPDATE OF embedding ON images
FOR EACH ROW
EXECUTE FUNCTION auth.add_cycle_indexed_count();

-- 使用embedding搜索图像
CREATE OR REPLACE FUNCTION search_images (
	query_embedding halfvec(3072),
	match_threshold float,
	match_count int
)
RETURNS TABLE (
	id int,
	owner_id UUID,
	name text,
	filename text,
	created_at timestamp with time zone,
	updated_at timestamp with time zone,
	last_accessed_at timestamp with time zone,
	version text,
	metadata jsonb,
	user_metadata jsonb,
	similarity float
)
LANGUAGE sql STABLE AS $$
SELECT
	id,
	owner_id,
	name,
	filename,
	created_at,
	updated_at,
	last_accessed_at,
	version,
	metadata,
	user_metadata,
	-(embedding <#> query_embedding) AS similarity
FROM image_details
WHERE -(embedding <#> query_embedding) > match_threshold
ORDER BY similarity DESC
LIMIT match_count;
$$;
