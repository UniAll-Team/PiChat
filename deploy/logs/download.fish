#!/usr/bin/env fish
set remote_host $argv[1]
if [ -z $argv[2] ]
    set remote_path $PWD
else
    set remote_path $argv[2]
end

rsync --log-file=./logs/download.log -azvvvP $remote_host:/var/log/{caddy,pichat}/ ./logs/$remote_host/
