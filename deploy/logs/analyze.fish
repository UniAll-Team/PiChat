#!/usr/bin/fish
set remote_host $argv[1]
set site_name $argv[2]

if [ -z $site_name ]
    set site_name (basename $PWD)
end

sd '"ts":"(.{19}).{4}(.+?)"' '"ts":"$1$2"' <./logs/$remote_host/$site_name.jsonl \
    | goaccess - \
    -o ./logs/$remote_host/$site_name.html \
    -j 6 \
    --datetime-format '%FT%T%z' \
    --log-format '{"ts":"%x","request":{"client_ip":"%h","proto":"%H","method":"%m","host":"%v","uri":"%U","headers":{"User-Agent":["%u"],"Referer":["%R"]},"tls":{"cipher_suite":"%k","proto": "%K"}},"duration": "%T","size": "%b","status": "%s","resp_headers":{"Content-Type":["%M"]}}'

micromamba run -n pandasgui below-draw draw_dumps ./logs/$remote_host/{system,process}.tsv
