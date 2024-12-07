#!/usr/bin/env fish

tar -vcaf output.tzst .output

set remote_host $argv[1]
if [ -z $argv[2] ]
    set remote_path $PWD
else
    set remote_path $argv[2]
end
rsync --log-file=./logs/upload.log -aWvvvP output.tzst $remote_host:$remote_path/
rsync --log-file=./logs/env.log -azvvvP .env $remote_host:$remote_path/
