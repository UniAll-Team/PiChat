

export type Image = {
	id: number
	name: string
	owner_id: string
	filename: string
	user_metadata?: any
	created_at?: string
	last_accessed_at?: string
	updated_at?: string
	version?: string
	alt?: string
	url?: string
	srcSet?: string[]
}

export type Images = Image[]
