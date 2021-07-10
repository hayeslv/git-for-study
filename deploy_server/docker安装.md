## 系统环境：虚拟机CentOS7

#### 安装Docker

1、查看内核版本<Docker 要求 CentOS 系统的内核版本高于 3.10>

```shell
uname -r  #本机<内核版本: 3.10.0-1062.el7.x86_64>
```

2、把yum包更新到最新 **这个步骤很有必要**

 ```shell
 yum update
 ```

3、安装需要的软件包, yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的

```shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

4、设置yum源

```shell
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

5、查看仓库中docker版本

```shell
yum list docker-ce --showduplicates | sort -r
```

6、安装docker

```shell
sudo yum install docker-ce
```

7、启动Docker

```shell
sudo systemctl start docker
sudo systemctl enable docker  //设置开机启动
sudo systemctl stop docker   //停止Docker
```

8、查看版本

```shell
docker version
```

9、使用一下确认是否启动成功,使用search 查一下

```shell
docker search php
```

10、查看日志状态成功日志

```shell
systemctl status docker.service
```

11、卸载docker

- 查询安装过的包
  - yum list installed | grep docker
  - 安装过旧版本：docker.x86_64,docker-client.x86_64,docker-common.x86_64 
- 删除安装的软件包
  - yum -y remove docker.x86_64
  - yum -y remove docker-client.x86_64 
  - yum -y remove docker-common.x86_64

#### 安装Docker-compose（python-pip方式）

1、安装python-pip包

```shell
yum -y install epel-release
yum -y install python3-pip
pip3 install --upgrade pip
```

2、通过pip3 安装 docker-compose

```shell
pip3 install docker-compose
docker-compose version
```



#### docker-compose安装mysql

/tool/mysql文件夹下，新建docker-compose.yml

```shell
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

然后执行：执行之前记得要开启docker   sudo systemctl start docker

```shell
docker-compose up -d
```

此时在本机访问   ： 虚拟机IP:8080  就可以看到mysql的可视化页面了  































