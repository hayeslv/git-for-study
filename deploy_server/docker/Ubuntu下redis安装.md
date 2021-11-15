## 1、搜索并下载redis镜像

```bash
docker search redis
```



## 2、获取最新版的redis镜像

```bash
docker pull redis:latest
docker pull redis:6.0-rc
```



## 3、查看本地下载的镜像

```bash
docker images
```



## 4、运行本地的redis镜像

```bash
docker run -itd --name redis6 -p 6379:6379 redis:6.0-rc


命令说明：
-p 6379:6379：映射容器服务的6379端口到宿主机的6379端口。外部可以通过宿主机ip:6379访问到redis服务。
```



## 5、查看redis容器的运行情况

```bash
docker ps
```











