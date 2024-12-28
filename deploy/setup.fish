#!/usr/bin/env fish

# 创建日志目录
sudo chown -R :adm /var/log
sudo chmod -R g+rs /var/log

mkdir -p /var/log/caddy \
    ~/.local/state/log \
    ./logs/

# 设置配置文件和服务
sudo mkdir -p /etc/{caddy,systemd/{system,user}}
sudo chown -R :adm /etc/{caddy,systemd/{system,user}}
sudo chmod -R g+rws /etc/{caddy,systemd/{system,user}}
mkdir -p ~/.config/systemd/user

ln -sf $PWD/{deploy/Caddyfile,.env} /etc/caddy/
ln -sf $PWD/deploy/caddy.service /etc/systemd/system/

#ln -sf $PWD/deploy/pichat.service /etc/systemd/user/
ln -sf $PWD/deploy/pichat.service ~/.config/systemd/user/

# 重载服务
sudo systemctl daemon-reload
systemctl --user daemon-reload

# 启动服务
sudo systemctl enable --now caddy
systemctl --user enable --now pichat
