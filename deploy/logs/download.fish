#!/usr/bin/env fish
set remote_host $argv[1]
set remote_path $argv[2]

if [ -z $remote_host ]
    set remote_path $PWD
end

for dump_type in system process
    set -a cmd "below dump $dump_type -O tsv -o /var/log/below/$dump_type.tsv --begin '30d ago'"
end
# 将cmd数组中的元素连接成一个字符串
set cmd (string join ' && ' $cmd)

ssh $remote_host $cmd
rsync --log-file=./logs/download.log -azvvvP $remote_host:/var/log/{{caddy,pichat}/,below/{system,process}.tsv} ./logs/$remote_host/
