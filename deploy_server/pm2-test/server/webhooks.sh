#!/bin/bash
WEB_PATH='/root/for-study-test/git-for-study/deploy_server/pm2-test/server'


echo "------ 进入项目目录，开始执行shell ------"
cd $WEB_PATH
echo "------ 开始清理代码 防止冲突 ------"
git reset --hard origin/master &&
git clean -f &&
echo "------ 拉取master分支代码 ------"
git pull origin master &&
#echo "------ 修改权限 ------"
#chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "------ git pull 完成. 开始 build ------"
npm run build &&
echo "------ build 完成 ------"
echo "------ 开始重启docker-compose ------"
docker-compose down &&
docker-compose up -d
echo "------ docker-compose 重启完毕 ------"