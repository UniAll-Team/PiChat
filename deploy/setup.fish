#!/usr/bin/env fish

# 创建日志目录
sudo mkdir -p /var/log/{caddy,pichat}

sudo chown -R :adm /var/log
sudo chmod -R g+rs /var/log
sudo chown -R syslog /var/log/pichat

# 必须复制，不能软链接，因为日志系统不读取软链接
sudo cp ./deploy/pichat.conf /etc/rsyslog.d/
sudo cp ./deploy/pichat.logrotate /etc/logrotate.d/caddy

# 创建目录和设置权限
sudo mkdir -p /etc/{caddy,systemd/{system,user}}
sudo chown -R :adm /etc/{caddy,systemd/{system,user}}
sudo chmod -R g+rws /etc/{caddy,systemd/{system,user}}
mkdir -p ~/.config/systemd/user

# 设置配置文件和服务
ln -sf $PWD/{deploy/Caddyfile,.env} /etc/caddy/
ln -sf $PWD/deploy/caddy.service /etc/systemd/system/

#ln -sf $PWD/deploy/pichat.service /etc/systemd/user/
ln -sf $PWD/deploy/pichat.service ~/.config/systemd/user/

# 重载服务
sudo systemctl daemon-reload
systemctl --user daemon-reload

# 启动服务
sudo systemctl enable caddy
systemctl --user enable pichat
