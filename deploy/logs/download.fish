#!/usr/bin/env fish
set remote_host $argv[1]
if [ -z $argv[2] ]
    set remote_path $PWD
else
    set remote_path $argv[2]
end

ssh $remote_host 'below dump system -O csv -o /var/log/below/dump.csv --begin "30d ago"'
rsync --log-file=./logs/download.log -azvvvP $remote_host:/var/log/{{caddy,pichat}/,below/dump.csv} ./logs/$remote_host/
