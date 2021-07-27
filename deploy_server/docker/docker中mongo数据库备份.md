## 一、mongodb数据备份

### 1、查询docker的运行情况 

```bash
docker ps
```

### 2、进入mongodb 的容器 

```bash
docker exec -it [容器ID] bash 

例如：docker exec -it 9286d48386ae bash
```

### 3、创建一个目录为dump 

```bash
mkdir dump 
```

###  4、进入db目录 

```bash
cd data/db
```

### 5、备份数据到 /dump下（path：data/db）

```bash
mongodump -h 127.0.0.1 --port 27017 -u='root' -p='123456' -d testDB -o /dump
# 我这里没有密码：mongodump -h 127.0.0.1  -d oversee-store -o /dump
```



## 二、将容器内的文件传到本机（如果已经映射，可以跳过此步骤）

### 1、先拿到容器的短ID或者指定的name。

```bash
docker ps -a
```

### 2、然后根据这两项的任意一项拿到ID全称。

```bash
docker inspect -f '{{.Id}}' 3aa4495b2ac0
```

### 3、将容器内文件传到本机指定目录

```bash
docker cp ID全称:容器文件路径 本地路径
例如：docker cp 3aa4495b2ac0f113ae7a72743441f5a33012d084e3f6a79f42ed6d0ada9ff065:/dump /root/source/docker/mongo/mongo-data-backup
```

### 4、压缩文件并从服务器传至我的电脑

```bash
# 在  /root/source/docker/mongo/mongo-data-backup  文件夹下
zip -r dump.zip dump/
sz dump.zip

# 我的
zip -r oversee-store.zip oversee-store/
sz oversee-store.zip
```



## 三、将文件从我的电脑传至另一台服务器

### 1、解压缩

```bash
# 将压缩包上传至服务器后
unzip dump.zip
# 我的
unzip oversee-store.zip
```

### 2、查看这台机器上的mongodb完整ID

```bash
docker inspect -f '{{.Id}}' f54dfcdb4cbf
```

### 3、将服务器的压缩包传入docker

```bash
docker cp /home/lhz/docker/mongo/dump/ f54dfcdb4cbf4f3148b263f6f5005502752fd6cfa5a706e388d9198ac1c6f8ca:/dump
# 我的
docker cp /home/lhz/docker/mongo/mongoData/ f54dfcdb4cbf4f3148b263f6f5005502752fd6cfa5a706e388d9198ac1c6f8ca:/dump
```



### 4、进入docker容器

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



### 5、恢复数据库（222是数据库名称）

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

### 1、本地新建项目

```bash
npm init -y
```

安装依赖

```bash
npm install node-schedule child_process --save
```



### 2、配置docker卷（见上面）

我这里配置了docker的volumes，容器中/dump的内容会在服务器的/root/source/docker/mongo/copydata 目录下



### 3、SFTP配置

项目配置SFTP  .vscode/sftp.json

```json
{
    "name": "AliyunServer",
    "host": "xx.xx.xx.xx",    
    "port": 22,     
    "username": "root", 
    "password": "xxxxxxxxxxxxx", 
    "protocol": "sftp", 
    "passive": false,
    "interactiveAuth": false,
    "remotePath": "/root/schedule/mongo",   
    "uploadOnSave": false, 
    "syncMode": "update",
    "ignore": [            
        "**/.vscode/**",
        "**/node_modules/**",
        "**/.DS_Store"
    ]
}
```

> 上传服务器后，进行npm install



### 4、编写sh脚本

src/mongo_data_backup.sh

```bash
#!/bin/bash
# 定时任务源码位置
# WEB_PATH='/root/schedule/mongo/src' 
DATA_SAVE_PATH='/root/schedule/mongo/data-save' # 数据备份存放处
DOCKER_COPY_DATA='/root/source/docker/mongo/copydata' # docker内mongo数据库导出数据的映射地址
currentdate=$(date +%Y%m%d%H%M%S) # 当前日期+时间

# echo "------ 进入项目目录，开始执行shell ------"
# cd $WEB_PATH
echo "------ 在docker内部执行操作（数据库备份） ------"
docker exec -it mongo_mongo_1 bash -c 'mongodump -h 127.0.0.1  -d oversee-store -o /dump' && 
echo "------ 压缩 ------"
cd $DOCKER_COPY_DATA
zip -r oversee-store$currentdate.zip oversee-store/ &&
echo "------ 复制压缩包到指定位置 ------"
cp -r oversee-store$currentdate.zip /root/schedule/mongo/data-save &&
echo "------ 删除当前位置的压缩包 ------"
rm oversee-store$currentdate.zip
echo "------ end ------"

```



### 5、编写定时器

src/mongo_data_backup.js

```js
const schedule = require('node-schedule');

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

const scheduleCronstyle = ()=>{
  // 每分钟的第30秒定时执行一次:
  schedule.scheduleJob('30 * * * * *',()=>{
    run_cmd('sh', ['./mongo_data_backup.sh'], function(text){ console.log(text) });
  }); 
}

scheduleCronstyle()
```



### 6、使用pm2启动js服务

```bash
pm2 start mongo_data_backup.js --name mongoDataBackup
```

可以看到 /root/schedule/mongo/data-save/ 文件夹下已经开始有打包数据了



### 7、传入本机保存

在/root/schedule/mongo/data-save/文件夹下

```bash
sz oversee-store20210727162430.zip
```

即可下载到本机了

或者SFTP整个拉取（看个人爱好）



### 8、恢复数据库（oversee-store是数据库名称）

#### 解压缩

```bash
# 将压缩包上传至另外一台服务器后  
unzip dump.zip
# 我的
cd /home/lhz/docker/mongo/dump
unzip oversee-store20210727162430.zip
```

#### 恢复数据库

```bash
docker exec -it mongo_mongo_1 bash -c 'mongodump -h 127.0.0.1  -d oversee-store -o /dump'
```



























