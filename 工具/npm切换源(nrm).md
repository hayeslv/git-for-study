1、用 npm 全局安装 nrm

```bash
Mac 上全局安装要加 sudo
npm install -g nrm 
```

2、查看所有的可用的源

```bash
nrm ls
```

3、添加源

```bash
nrm add 源的名称  https:// 地址
```

4、删除某个源

```bash
nrm del 源的名字
```

5、切换到某个源

```bash
nrm use 源的名字
```

6、还可以测试源的速度

```bash
nrm test
```



### npm

查看源地址

```bash
npm config get registry
```

设置源地址

```bash
npm config set registry https://registry.npm.taobao.org/
```

npm官方源地址：https://registry.npmjs.org

淘宝镜像源地址：https://registry.npm.taobao.org/













