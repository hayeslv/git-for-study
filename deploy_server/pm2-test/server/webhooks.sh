#!/bin/bash
WEB_PATH='/root/for-study-test/webhooks/deploy_server/pm2-test'


echo "开始执行shell"
cd $WEB_PATH
echo "pulling source code..."
git pull
echo "changing permissions..."
#chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo " git pull 完成. 开始 build"
yarn run gatsby build
echo "build 完成"