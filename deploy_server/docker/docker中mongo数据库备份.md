## 一、mongodb数据备份

#### 1、查询docker的运行情况 

```bash
docker ps
```

#### 2、进入mongodb 的容器 

```bash
docker exec -it [容器ID] bash 

例如：docker exec -it 9286d48386ae bash
```

#### 3、创建一个目录为dump 

```bash
mkdir dump 
```

####  4、进入db目录 

```bash
cd data/db
```

#### 5、备份数据到 /dump下（path：data/db）

```bash
mongodump -h 127.0.0.1 --port 27017 -u='root' -p='123456' -d testDB -o /dump
# 我这里没有密码：mongodump -h 127.0.0.1  -d oversee-store -o /dump
```



## 二、将容器内的文件传到本机（如果已经映射，可以跳过此步骤）

#### 1、先拿到容器的短ID或者指定的name。

```bash
docker ps -a
```

#### 2、然后根据这两项的任意一项拿到ID全称。

```bash
docker inspect -f '{{.Id}}' 3aa4495b2ac0
```

#### 3、将容器内文件传到本机指定目录

```bash
docker cp ID全称:容器文件路径 本地路径
例如：docker cp 3aa4495b2ac0f113ae7a72743441f5a33012d084e3f6a79f42ed6d0ada9ff065:/dump /root/source/docker/mongo/mongo-data-backup
```

#### 4、压缩文件并从服务器传至我的电脑

```bash
# 在  /root/source/docker/mongo/mongo-data-backup  文件夹下
zip -r dump.zip dump/
sz dump.zip

# 我的
zip -r oversee-store.zip oversee-store/
sz oversee-store.zip
```



## 三、将文件从我的电脑传至另一台服务器

#### 1、解压缩

```bash
# 将压缩包上传至服务器后
unzip dump.zip
# 我的
unzip oversee-store.zip
```

#### 2、查看这台机器上的mongodb完整ID

```bash
docker inspect -f '{{.Id}}' f54dfcdb4cbf
```

#### 3、将服务器的压缩包传入docker

```bash
docker cp /home/lhz/docker/mongo/dump/ f54dfcdb4cbf4f3148b263f6f5005502752fd6cfa5a706e388d9198ac1c6f8ca:/dump
# 我的
docker cp /home/lhz/docker/mongo/mongoData/ f54dfcdb4cbf4f3148b263f6f5005502752fd6cfa5a706e388d9198ac1c6f8ca:/dump
```



#### 4、进入docker容器

```bash
docker exec -it 6bb536ad1801 bash
```

> copy文件夹

```bash
cp dir1/a.doc dir2  # 表示将dir1下的a.doc文件复制到dir2目录下
cp -r dir1 dir2 # 表示将dir1及其dir1下所包含的文件复制到dir2下
cp -r dir1/. dir2  # 表示将dir1下的文件复制到dir2,不包括dir1目录
#说明：cp参数 -i：询问，如果目标文件已经存在，则会询问是否覆盖；
# 我的
root@f54dfcdb4cbf:/dump/mongoData# cp -r oversee-store/ /dump
```



#### 5、恢复数据库（222是数据库名称）

```bash
mongorestore -h 127.0.0.1:27017 -u='root' -p='123456' -d testDB /dump/testDB
# 我的
我这里没有密码，例如：mongorestore -h 127.0.0.1:27017  -d 222 /dump/222 
```



查看全部容器卷

docker volume ls



```
volumes:      
  - "./data/mongo:/data/db"      
  - "./data/mongo-entrypoint/:/docker-entrypoint-initdb.d/"      
  - "./copydata:/dump/"
```



## 四、自动化备份
