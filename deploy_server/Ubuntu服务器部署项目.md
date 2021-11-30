## 前端部署

### 1、配置sftp.json

前提条件：vscode安装插件（SFTP）

首先在根目录建立一个.vscode文件夹，里面新建 sftp.json 文件

```json
{
    "name": "AliyunServer",
    "host": "xx.xx.xx.xx",    
    "port": 22,     
    "username": "root", 
    "password": "xxxxxxx", 
    "protocol": "sftp", 
    "passive": false,
    "interactiveAuth": false,
    "remotePath": "/root/source/docker_cli",   
    "uploadOnSave": false, 
    "syncMode": "update",
    "ignore": [            
        "**/.vscode/**",
        "**/.git/**",
        "**/.DS_Store"
    ]
}
```



### 2、配置nginx

/nginx/cert   放入证书

5746197_www.dylanlv.com.key

5746197_www.dylanlv.com.pem



/nginx/conf.d/docker.conf

```bash
server {
  listen  80;
  location / {
    root    /usr/share/nginx/html;
    index   index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}

# 网站：组件+文章
server {
  listen  7010;
  location / {
    root    /usr/share/nginx/comp;
    index   index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}


# server {
#   listen  81;
#   location / {
#     root    /usr/share/nginx/test;
#     index   index.html index.htm;
#     try_files $uri $uri/ /index.html;
#   }
# }

server {
  listen  8000;
  location ~ /image/ {
      root /usr/share/nginx/file; # /usr/share/nginx/file 是虚拟路径，任意填
  }
}

server {
  listen 8443 ssl http2;
  server_name www.dylanlv.com;
  ssl_certificate cert/5746197_www.dylanlv.com.pem;
  ssl_certificate_key cert/5746197_www.dylanlv.com.key;
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
  ssl_prefer_server_ciphers on;
  location / {
    proxy_pass https://www.dylanlv.com:8443; # 你的接口地址
  }
}
```





### **3、配置docker-compose**

```yml
version: '3.1'
services:
  nginx:
    restart: always
    image: nginx
    ports:
      - 443:8443
      - 80:80
      - 7010:7010
    #  - 81:81
    volumes:
      - ./nginx/conf.d/:/etc/nginx/conf.d # nginx配置
      # - /root/project/front/dist:/usr/share/nginx/comp/ # 网站：组件+文章
      - ./dist:/usr/share/nginx/html/ # 网站：海淘前端
      # - /root/file:/usr/share/nginx/file/ # /root/file 服务器文件路径
      - ./nginx/cert:/etc/nginx/cert # nginx证书
    #  - /root/for-study-test/git-for-study/deploy_server/pm2-test/dist:/usr/share/nginx/test/
  # nginx:
  #   restart: always
  #   image: nginx
  #   ports:
  #     - 8091:80
  #   volumes:
  #     - ./nginx/conf.d/:/etc/nginx/conf.d
  #     - ./dist:/usr/share/nginx/html/
  #     - /root/file:/usr/share/nginx/file/
```

以上内容上传服务器后，执行 `docker-compose up -d`



## 后端部署

注：我这里后端是用eggJS写的

在根目录新建 .vscode 文件夹，在其中新建 sftp.json 文件

### 1、配置sftp.json

```json
{
    "name": "AliyunServer",
    "host": "xx.xx.xx.xx",    
    "port": 22,     
    "username": "root", 
    "password": "xxxxxxxxx", 
    "protocol": "sftp", 
    "passive": false,
    "interactiveAuth": false,
    "remotePath": "/root/project/oversea-manage/back",   
    "uploadOnSave": false, 
    "syncMode": "update",
    "ignore": [            
        "**/.vscode/**",
        "**/.git/**",
        "**/.DS_Store",
        "**/node_modules/**"
    ]
}
```

然后将整个项目全部上传

上传完成后，进入服务器，在/root/project/oversea-manage/back 目录下

执行 `npm i`

如果出现 `sh: 1: node: Permission denied`

再进行：`npm i`



### 2、解决跨域问题

因为是不同端口，又没有使用nginx进行代理，所以会出现跨域的情况（后面再研究后端代码使用nginx代理）
这里使用egg-cors插件

```bash
npm i egg-cors -S
```

在config/plugin.js 中加入以下代码

```json
cors: {
  enable: true,
  package: 'egg-cors',
},
```

在config/config.default.js 中加入以下代码

```js
config.security = {
  csrf: {
    enable: false,
    ignoreJSON: true,
  },
  domainWhiteList: [ 'http://localhost:8091' ],
};
config.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
};
```



## 后端请求翻墙问题

**使用shadowsocks + privoxy 进行代理**

注：我的服务器是ubuntu18版本的，测试过程中使用ubuntu20版本有些包会不同

```bash
# 更新包
apt-get update

# 安装python
sudo apt-get install python

# 安装pip包
sudo apt-get install python-pip

# 安装SS
sudo pip install shadowsocks

# 更新SS到3.0版本（这里是因为我的SS服务器用的aes-256-gcm加密方式，这种加密方式3.0版本后才有）
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
```

注：SS服务器的搭建以及配置这里不详细讲述了，本文的SS是客户端配置

```json
# 将下面的内容写入ss配置  /etc/shadowsocks.json
vim /etc/shadowsocks.json

# 内容
{
"server":"xxx.xxx.xxx.xxx", 
"server_port": xxxx,
"local_address": "127.0.0.1",
"local_port":1080,
"password":"xxxxxx",
"timeout":600,
"method":"aes-256-gcm"
}
```

server: 服务器ip
server_port：服务器端口
password：密码
我这里将ss的内容代理到本地的1080端口了

```bash
# 后台运行
sudo sslocal -c /etc/shadowsocks.json -d start

# 关闭（不用执行）
sudo sslocal -c /etc/shadowsocks.json -d stop
```



### 安装和配置privoxy

```bash
apt-get install privoxy
```

vim /etc/privoxy/config
在1336行添加以下内容（注意最后的 . 一定需要）

```bash
forward-socks5t / 127.0.0.1:1080 .
```

这里监听端口默认开启的是：127.0.0.1:8118



### 启动privoxy

```bash
sudo service privoxy start
```

```bash
# 设置全局代理（一般不需要）
export http_proxy='http://localhost:8118'
export https_proxy='https://localhost:8118'

# 取消全局代理
unset http_proxy
unset https_proxy
```

如果服务器重启后，需要重新开启服务

```bash
sudo sslocal -c /etc/shadowsocks.json -d start
```

至此，在需要翻墙的地方进行 127.0.0.1:8118 的转发就行了