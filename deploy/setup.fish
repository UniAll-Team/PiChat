#!/usr/bin/env fish

# 创建日志目录
sudo chown -R :adm /var/log
sudo chmod -R g+r /var/log

mkdir -p /var/log/caddy \
    ~/.local/state/log

# 设置配置文件和服务
sudo chown -R :adm /etc/{caddy,systemd/{system,user}}
sudo chmod -R g+rw /etc/{caddy,systemd/{system,user}}

ln -sfb $PWD/{deploy/Caddyfile,.env} /etc/caddy/
ln -sfb $PWD/deploy/caddy.service /etc/systemd/system/
ln -sfb $PWD/deploy/pichat.service /etc/systemd/user/

# 重载服务
systemctl daemon-reload
systemctl --user daemon-reload

# 启动服务
systemctl enable --now caddy
systemctl --user enable --now pichat
