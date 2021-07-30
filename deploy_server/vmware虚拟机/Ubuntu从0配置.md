## 一、各种命令安装

```bash
apt-get install -y vim  # vi命令安装
apt install mlocate  # 查看文件路径命令，例：查看nginx配置文件路径  locate nginx.conf
sudo apt install zip  # 安装压缩工具
sudo apt-get install lrzsz  # 文件上传下载工具
```







## 二、安装网络配置

```bash
sudo apt install net-tools # 安装网络工具，ifconfig命令等
sudo apt-get install openssh-server # 安装ssh
sudo ufw disable  # 关闭防火墙
sudo service ssh star  # 启动ssh
```



#### 配置静态IP（未测试成功）

由于ubuntu版本不同，netplan文件不同，所以使用下列命令查看自己的文件名：

```bash
ls /etc/netplan
```

我的是“01-network-manager-all.yaml”

```bash
vi /etc/netplan/01-network-manager-all.yaml
```

```bash
network:
  ethernets:
    ens33:     #配置的网卡的名称
      addresses: [192.168.128.158/24]    #配置的静态ip地址和掩码
      dhcp4: no    #关闭DHCP，如果需要打开DHCP则写yes
      optional: true
      gateway4: 192.168.128.2    #网关地址
      nameservers:
        addresses: [192.168.31.2]    #DNS服务器地址，多个DNS服务器地址需要用英文逗号分隔开
  version: 2
  renderer: NetworkManager
```

```bash
sudo netplan apply
```



## 三、安装docker

apt升级

```bash
sudo apt-get update
```

添加相关软件包

```bash
sudo apt-get install \
apt-transport-https \
ca-certificates \
curl \
software-properties-common
```

下载软件包的合法性，需要添加软件源的 GPG 秘钥

```bash
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

source.list 中添加 Docker 软件源

```bash
sudo add-apt-repository \
"deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
$(lsb_release -cs) \
stable"
```

安装 Docker CE

```bash
sudo apt-get update
sudo apt-get install docker-ce
```

启动 Docker CE

```bash
# 添加docker服务
sudo systemctl enable docker
# 启动docker
sudo systemctl start docker
```

镜像加速（可选）

```bash
# 加入微软云和七牛云
# 进入daemon.json文件，进行编辑
vi /etc/docker/daemon.json

# 将以下内容弄进去
{
  "registry-mirrors": [
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com"
  ]
}

# 重启docker服务，让它生效

sudo systemctl daemon-reload
sudo systemctl restart docker
```

docker-compose安装

```bash
apt install docker-compose
```



## 四、安装mysql

在目录下：/home/lhz/docker/mysql

```bash
vi docker-compose.yml
```

```bash
version: '3'
services:
  db:
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
    ports:
      - 3306:3306
    volumes:
      - ./data:/var/lib/mysql  

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
```

启动

```bash
docker-compose up -d
```





















