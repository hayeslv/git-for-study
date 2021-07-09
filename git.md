#### GitHub提交代码Contribution不变绿

问题：写了好久的 GitHub 主页的Contribution 面板不变绿，不显示提交记录！

就是用户不是你的用户了，一般产生这个原因都是变成了你公司的 git 账号了

```shell
//查看当前 Git 的用户名
git config user.name
//设置新的用户名
git config --global user.name "your—name"
//设置新的邮箱
git config --global user.email "your-Email"
```

