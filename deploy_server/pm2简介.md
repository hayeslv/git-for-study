PM2是具有内置负载均衡器的NodeJS应用程序的生产运行时和进程管理器。它允许你永久保持应用程序活跃，无需停机即可重新加载他们，并促进常见的Devops任务。

#### 主要特性：

- 内建负载均衡（使用Node cluster 集群模块）
- 后台运行
- 0秒停机重载，大概意思应该是维护升级的时候不需要停机
- 具有Ubuntu和CentOS的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口 API （Nodejs模块，允许和PM2进程管理器交互）

可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等。





### 一、安装

```shell
# 安装
npm install pm2 -g
# 更新
pm2 update
```

全局安装pm2

您可以像这样启动任何应用程序（Node.js，Python，Ruby，$PATH中的二进制文件...）



**简单守护：**

```shell
pm2 start app.js
pm2 start app.js --name app
```



**集成守护**使用，在生产环境可能没有安装pm2，我们可以使用

```shell
RUN npm install pm2 -g
CMD [ "pm2-runtime", "npm", "--", "start" ]
```



#### Linux下安装pm2

安装完成后，执行命令`pm2 list` 会出现`Command 'pm2' not found`

说明：没有配置到全局，虽然按照到全局，但Linux下不像windows下能自动创造一个环境遍历去实现我们的全局。所以我们需要创建一个Linux下的软连接。

##### 创建软连接

操作描述：在Linux上的设置软连接相当于是windows下的配制环境变量一个道理，只是这里用了命令完成的操作。这里我们就开始为pm2创建软连接，这里首先要明确的是，我们要知道谁和谁去连接，问题来了？知道是哪个和哪个连接吗？好了，答案是：我们的Linux下的全局$PATH和我们pm2的安装路径。那么我们如何知道他们的路径分别是哪里呢？

**a:找到全局环境PATH路径**

输入命令：` echo $PATH`

回车后

```shell
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games
```

说明，也话你的路径和我的不一样，但没关系，你可以选择任何一个以：隔开的路径做为系统环境路径，我通常会选/usr/local/bin

**b:找到pm2的安装路径**

通常我们在安装pm2的时候会有一个安装路径显示，如下

```shell
/root/tool/nodejs/node-v12.10.0-linux-x64/bin/pm2 -> /root/tool/nodejs/node-v12.10.0-linux-x64/lib/node_modules/pm2/bin/pm2
```

于是，这就是你的pm2的安装路径为：`/root/tool/nodejs/node-v12.10.0-linux-x64/lib/node_modules/pm2/bin/pm2`

好了都找到了，就重要的一步要开始了，睁大你的双眼。

输入下面的命令：

```shell
ln -s /root/tool/nodejs/node-v12.10.0-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin/
```

大功告成，来试一下：`pm2 list`



### 二、基础命令



参数说明：

- `--watch`：监听应用目录的变化，一旦发生变化，自动重启。如果要精确监听、不监听的目录，最好通过配置文件。
- `-i --instances`：启动多少个实例，可用于负载均衡。如果 -i 0 或者 -i max ，则根据当前机器核数确定实例数目。
- `--ignore-watch`：排除监听的目录/文件，可以是特定的文件名，也可以是正则。比如 `--ignore-watch="test node_modules "some scripts""`
- `-n --name`：应用的名称。查看应用信息的时候可以用到。
- `-o --output <path>`：标准输出日志文件的路径。
- `-e --error <path>`：错误输出日志文件的路径。



**查看pm2管理的应用**

```shell
pm2 list
```

启动、重启、停止

```shell
# 停止
pm2 stop <app_name|id|'all'|json_conf>   
# 重启
pm2 restart <app_name|id|'all'|json_conf>   
# 删除
pm2 delete <app_name|id|'all'|json_conf>   
# 杀掉所有pm2进程并释放资源，包含pm2自身，会释放端口
pm2 kill #   
```

启动 express 或 Koa，可以在其目录下

```shell
pm2 start bin/www
```

如果我们在后面加入watch参数，每当代码改变时即会自动重启：

```shell
pm2 start bin/www --watch
```



**查看进程详细信息**

该命令可以查看工程运行的目录，node与你新高版本，日志目录，项目git位置等

```shell
pm2 show <id|app_name>
```

要监控日志，自定义指标，应用程序信息：

```shell
pm2 monit
```



**无缝重启程序**

```shell
pm2 reload all
```



**开机自启动**

开启启动设置(可选项: ubuntu, centos, redhat, gentoo, systemd, darwin, amazon)

```shell
pm2 startup ubuntu 
```

然后按照提示进行输入

最后保存设置

```shell
pm2 save
```



**pm2在生产环境下运行**

```bash
NODE_ENV=production pm2 start my-app --update-env
```







### 三、PM2集群模式（负载均衡）

集群模式是启动Node.js应用程序时的一种特殊模式，它启动多个进程并在它们之间对HTTP/TCP/UDP进行负载均衡。

这提高了整体性能和可靠性（在未处理错误的情况下更快的套接字重新平衡）。

以集群模式启动Node.js应用程序，该应用程序将利用指定数量的CUP（开启4个进程）

```shell
pm2 start .\server\index.js --name app -i 4
```

然后从命令行直接启动监视

```shell
pm2 monit
```



### 四、配置文件

配置文件官方文档：http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

**环境变量配置**

the ecosystem file 的目的是为所有应用程序**收集所有选项和环境变量**。

```shell
pm2 init
```

```js
// ecosystem.config.js
module.exports = {
  apps : [{
    name: 'app',
    script: './server/index.js',
    autorestart: true,
    env: {
      NODE_ENV: 'devlopment'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

可以为多个环境声明变量。每个环境密钥必须具有以下格式：env_

例如，app可以在两个环境中启动以下过程：development 和 production

**我们可以配置在不同环境下的特定参数，在相应程序中 express 或 koa 中可以使用process.env.NODE_ENV**

```shell
pm2 start .\ecosystem.config.js
pm2 start .\ecosystem.config.js --env production
```



### 日志管理

pm2 logs 查看控制台相应输出（实时日志）

**日志命令管理**

为日志指定自定义位置

```js
module.exports = {
  apps : [{
    name: 'app',
    script: './server/index.js',
    autorestart: true,
    output: './out.log', // 输出日志
    error: './error.log', // 错误日志
    env: {
      NODE_ENV: 'devlopment'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

**合并模式**

在集群模式下，每个集群都有自己的日志文件。你可以使用合并选项将所有日志收集到单个文件中：

```js
module.exports = {
  apps : [{
    name: 'app',
    script: './server/index.js',
    autorestart: true,
    output: './out.log', // 输出日志
    error: './error.log', // 错误日志
    merge_logs: true, // 合并日志
    env: {
      NODE_ENV: 'devlopment'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```



### 开机自启动

可以通过`pm2 startup`开实现开机自启动。细节可参考：https://pm2.keymetrics.io/docs/usage/startup/

1. 通过`pm2 save`保存当前进程状态。
2. 通过`pm2 startup [platform]`生成开机自启动的命令。（记得看控制台输出）
3. 将步骤2生成的命令，粘贴到控制台执行，搞定。



### 内存使用超过上限自动重启

如果想要你的应用，在超过使用内存上限后自动重启，那么可以加上`--max-memory-restart`参数。（有对应的配置项）

```shell
pm2 start api.js --max-memory-restart 20M
```



### 常用命令一览

```shell
# 普通General
$ npm install pm2 -g            # 安装 PM2
$ pm2 start app.js              # 启动，守护进程，自动重启应用程序 Start, Daemonize and auto-restart application (Node)
$ pm2 start app.py              # 启动，守护进程，自动重启python应用程序 Start, Daemonize and auto-restart application (Python)
$ pm2 start npm -- start        # 启动，守护进程，自动重启node应用程序 Start, Daemonize and auto-restart Node application

# 集群模式 (只支持node进程) Cluster Mode (Node.js only)
$ pm2 start app.js -i 4         # 在集群模式下，启动4个应用程序实例  Start 4 instances of application in cluster mode
                                # 同时，将网络请求，负载均衡到每个应用实例  it will load balance network queries to each app
$ pm2 reload all                # 0秒重启所有应用 Zero Second Downtime Reload
$ pm2 scale [app-name] 10       # 将应用进程调整到10 Scale Cluster app to 10 process

# 进程监控 Scale Cluster app to 10 process
$ pm2 list                      # 列出所有用PM2启动的进程 List all processes started with PM2
$ pm2 monit                     # 显示每个应用占用的cpu和内存 Display memory and cpu usage of each app
$ pm2 show [app-name]           # 显示某个进程的所有信息 Show all informations about application

# 日志管理 Log management
$ pm2 logs                      # 显示所有应用的日志  Display logs of all apps
$ pm2 logs [app-name]           # 显示某个应用的日志 Display logs for a specific app
$ pm2 logs --json               # json化日志 Logs in JSON format
$ pm2 flush
$ pm2 reloadLogs

# 进程状态管理 Process State Management
$ pm2 start app.js --name="api" # 启动一个应用并命名为api。 Start application and name it "api"
$ pm2 start app.js -- -a 34     # 启动一个应用，并传递“-a 34”的参数。 Start app and pass option "-a 34" as argument
$ pm2 start app.js --watch      # 重启一个应用，当文件改变的时候。Restart application on file change
$ pm2 start script.sh           # 启动一个bash脚本。Start bash script
$ pm2 start app.json            # 启动在app.json中声明的所有应用。Start all applications declared in app.json
$ pm2 reset [app-name]          # 重置所有计数器。Reset all counters
$ pm2 stop all                  # 停止所有应用。Stop all apps
$ pm2 stop 0                    # 停止id 为0的应用。Stop process with id 0
$ pm2 restart all               # 重启所有应用。Restart all apps
$ pm2 gracefulReload all        # 在集群模式下，平稳的重加载所有应用。Graceful reload all apps in cluster mode
$ pm2 delete all                # 杀掉所有应用。Kill and delete all apps
$ pm2 delete 0                  # 杀掉id为0的进程。Delete app with id 0

# 启动／引导管理 Startup/Boot management
$ pm2 startup                   # 检测init系统，在启动时生成和配置pm2。Detect init system, generate and configure pm2 boot on startup
$ pm2 save                      # 保存当前进程列表。Save current process list
$ pm2 resurrect                 # 恢复以前保存的进程。Restore previously save processes
$ pm2 unstartup                 # 停用和删除启动系统。Disable and remove startup system
$ pm2 update                    # 保存进程，终止PM2并恢复进程。Save processes, kill PM2 and restore processes
$ pm2 generate                  # 生成样本json配置文件。Generate a sample json configuration file

# 部署 Deployment
$ pm2 deploy app.json prod setup    # 设置“生产环境”远程服务器。 Setup "prod" remote server
$ pm2 deploy app.json prod          # 更新“生产环境”远程服务器。 Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # 将“生产环境”远程服务器恢复2。Revert "prod" remote server by 2

# 模块系统 Module system
$ pm2 module:generate [name]    # 生成名称为[name]的示例模块。Generate sample module with name [name]
$ pm2 install pm2-logrotate     # 安装模块（这里是日志循环系统）。Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # 卸载模块。Uninstall module
$ pm2 publish                   # 增量版本，git push和npm发布。Increment version, git push and npm publish
```



























