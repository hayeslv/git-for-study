安装网络命令：

```bash
sudo apt install net-tools
```

今天刚创建一个新的Linux，连接SSH时发现无法连接

1.输入：ssh -v root@xxx 后，发现ssh拒绝连接

这个情况是sshd没有安装。需要输入 sudo apt-get install openssh-server 安装。

```bash
sudo apt-get install openssh-server
```

输入 sudo ufw disable 关闭防火墙

```bash
sudo ufw disable
```

安装后输入 sudo service ssh star 开始启动。

```bash
sudo service ssh star
```





vi命令安装

```bash
apt-get install -y vim
```





ubuntu16.04 安装完docker后在docker-compose.yml文件所在目录执行

```
docker-compose up -d
```

报错

```
ERROR: Couldn’t connect to Docker daemon at http+docker://localunixsocket - is it running?

If it’s at a non-standard location, specify the URL with the DOCKER_HOST environment variable.
```

正确的是将当前用户加入docker组

```
lhz@ubuntu:/tmp/docker$ sudo gpasswd -a ${USER} docker
```

后退出当前用户比如切换为root，再次切换为lhz。然后执行docker-compose up -d就ok了。

```
lhz@ubuntu:/tmp/docker$ sudo su
root@ubuntu:/tmp/docker$ su lhz
lhz@ubuntu:/tmp/docker$ docker-compose up -d
```















