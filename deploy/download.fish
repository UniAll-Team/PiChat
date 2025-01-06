#!/usr/bin/env fish
set remote_host $argv[1]
if [ -z $argv[2] ]
    set remote_path $PWD
else
    set remote_path $argv[2]
end

rsync --log-file=./logs/download.log -azvvvP $remote_host:/var/log/{caddy,pichat}/ ./logs/$remote_host/

if [ -z $NUXT_SITE_NAME ]
    set NUXT_SITE_NAME (basename $remote_path)
end

goaccess \
    ./logs/$remote_host/$NUXT_SITE_NAME.jsonl \
    -o ./logs/$remote_host/$NUXT_SITE_NAME.html \
    -j 6 \
    --datetime-format '%FT%T' \
    --log-format '{"ts":"%x.%f%z","request":{"client_ip":"%h","proto":"%H","method":"%m","host":"%v","uri":"%U","headers":{"User-Agent":["%u"],"Referer":["%R"]},"tls":{"cipher_suite":"%k","proto": "%K"}},"duration": "%T","size": "%b","status": "%s","resp_headers":{"Content-Type":["%M"]}}'
