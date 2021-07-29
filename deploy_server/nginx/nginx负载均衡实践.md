以加权轮询算法为例，笔记本 + Nginx + Node 测试一下负载均衡。由于没有多台服务器，于是通过自己笔记本的多个不同端口来模拟不同的服务器。

### 一、ubuntu安装nginx

```bash
# 切换至root用户
sudo su root
apt-get install nginx
```

查看nginx是否安装成功

```bash
nginx -v
```

启动nginx

```bash
service nginx start
```

启动后，在网页输入ip地址，即可看到nginx的欢迎页面。至此nginx安装成功

> 我的是在虚拟机上，所以本机访问：http://192.168.2.133/ 即可

nginx文件安装完成之后的文件位置：

- /usr/sbin/nginx：主程序
- /etc/nginx：存放配置文件
- /usr/share/nginx：存放静态文件
- /var/log/nginx：存放日志



### 二、基于 Node + Express 框架搭建服务器

安装插件

```bash
npm i express -S
```

新建 index.js 文件

```js
// deploy_server\nginx\nginx-express\index.js
const express = require('express');
const app_1 = express();
const app_2 = express();
const app_3 = express();
  
// 定义要监听的端口号
const listenedPort_1 = '8087';
const listenedPort_2 = '8088';
const listenedPort_3 = '8089';
  
app_1.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_1}～`));
app_2.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_2}～`));
app_3.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_3}～`));
  
// 监听端口
app_1.listen(listenedPort_1, () => console.log(`success: ${listenedPort_1}`));
app_2.listen(listenedPort_2, () => console.log(`success: ${listenedPort_2}`));
app_3.listen(listenedPort_3, () => console.log(`success: ${listenedPort_3}`));
```

启动服务器

```bash
node index.js
```



### 三、安装node环境（已安装的话可以略过）

```bash
# 在 /root 下新建nodejs文件夹（这里可以按照自己配置的路径）
mkdir nodejs

# 官网下载
wget https://nodejs.org/dist/v12.10.0/node-v12.10.0-linux-x64.tar.xz

# 如果官网下载报错：wget:unable to resolv host address
# 可以尝试进行下列操作
vi /etc/resolv.conf
# 添加下列代码
nameserver 8.8.8.8 #google https://nodejs.org


# 解压
tar xf node-v12.10.0-linux-x64.tar.xz

# 输入以下命令（注意，/root/tool/nodejs  换成你自己官网下载node的解压路径，我这里是在 /root/tool/nodejs 解压的）
ln -s /root/tool/nodejs/node-v12.10.0-linux-x64/bin/node /usr/local/bin/node
ln -s /root/tool/nodejs/node-v12.10.0-linux-x64/bin/npm /usr/local/bin/npm


# 测试
node -v
输出： v12.10.0
npm -v
输出： 6.10.3
代表nodejs安装成功

# 安装 cnpm
npm install -g cnpm -registry=https://registry.npm.taobao.org
# /root/tool/nodejs/node-v12.10.0-linux-x64/bin/cnpm -> /root/tool/nodejs/node-v12.10.0-linux-x64/lib/node_modules/cnpm/bin/cnpm
# 配置环境
ln -s /root/tool/nodejs/node-v12.10.0-linux-x64/bin/cnpm /usr/local/bin/cnpm
```



### 四、nginx配置

在 nginx.conf 文件中配置好需要轮询的服务器和代理

- 轮询的服务器，写在 http 中的 upstream 对象里
- 代理地址，写在 http 中的 server 对象里

```bash
sudo vi /etc/nginx/conf.d/load-balancer.conf
# 我的？ /etc/nginx/nginx.conf
```

```bash
# 定义要包含在负载均衡方案中的服务器。  
# 最好使用服务器的私有IP以获得更好的性能和安全性，我这里只有一台机器，就使用不同的端口号了。 
http {
    upstream testServer {
       # server 10.1.0.101;
       # server 10.1.0.102;
       # server 10.1.0.103;
       server localhost:8087 weight=10;
       server localhost:8088 weight=5;
       server localhost:8089 weight=2;
    }
  
    #该服务器接受到端口80的所有流量并将其传递给上游upstream 。
    #请注意，upstream名称和proxy_pass需要匹配。
    server {
       listen 80;
        location / {
        	root   html;
        	index  index.html index.htm;
        	proxy_pass http://testServer; # testServer 为自己定义的服务器集群 
        }
    }
}
```



注意：刚安装的nginx默认80端口是被欢迎页占用的，这里对欢迎页端口进行修改

```bash
vi /etc/nginx/sites-enabled/default
```

```bash
server {
	listen 888 default_server;
	listen [::]:888 default_server;
	.......
}
```

这里listen原先是80，全部改成888



### 五、查看结果

- 重启 Nginx 服务

```bash
service nginx restart
```

访问：http://192.168.2.133/

通过多次刷新可以发现，由于设置了不同的 `weight`，端口号为 8087 的服务器出现的次数最多，同时证实了权值越高，服务器处理请求几率越大的规则。



























