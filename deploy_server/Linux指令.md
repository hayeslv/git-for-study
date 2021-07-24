##### 解压缩

```shell
# 解压.tar.gz文件：tar不支付解压文件到指定的目录！
tar -zxvf web.tar.gz
# 解压.war .zip文件到指定目录：
unzip frontend.zip -d /root/test/shop
# 解压到当前目录
unzip frontend.zip
```

##### 压缩文件夹（Ubuntu）

```bash
# 安装zip工具
sudo apt install zip
# 在mongo目录下
zip -r mongo.zip mongo/
# ls可以看到 mongo.zip 文件了
```

##### 服务器（Ubuntu）文件下载到本地

```bash
sudo apt-get install lrzsz
sz 【file】 --->可将服务器的文件下载到本地
```

docker cp 本地文件路径 ID全称:容器路径







