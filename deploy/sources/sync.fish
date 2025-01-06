set -x remote_host $argv[1]
set lsyncd_conf $argv[2]


if [ -z $lsyncd_conf ]
    set lsyncd_conf .vscode/lsyncd.lua
end

lsyncd -log Exec $lsyncd_conf
