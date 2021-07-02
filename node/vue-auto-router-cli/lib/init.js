/*
 * @Author: Lvhz
 * @Date: 2021-06-23 16:57:02
 * @Description: Description
 */

const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk'); 
const log = content => console.log(chalk.green(content));
const { clone } = require('./download');

const open = require('open'); // 自动打开浏览器

// 事件 =》 promise风格
const spawn = async(...args) => {
  const { spawn } = require('child_process');
  return new Promise((resolve) => {
    const proc = spawn(...args);
    // 日志接入到主进程的流上，因为子进程的日志不会被打印
    proc.stdout.pipe(process.stdout); 
    proc.stderr.pipe(process.stderr);
    proc.on('close', () => {
      resolve();
    });
  });
};

module.exports = async name => {
  // 打印欢迎页面
  clear();
  const data = await figlet('KKB Welcome');
  log(data);

  log(`创建项目：${name}`);
  await clone('github:lvhaizhou/vuecli-best-practice', name);

  // 自动安装依赖
  // 子进程运行 npm install
  log('安装依赖...');
  // 在windows下npm的执行命令不同。
  // 这一步做的工作相当于:cd 到目录下面，然后 npm install
  await spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], { cwd: `./${name}` });
  log(chalk.green(`
    安装完成：
      To get start
      =================
      cd ${name}
      npm run serve
      ================= 
  `));

  // 启动项目
  open('http://localhost:8080');
  await spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'serve'], { cwd: `./${name}` });
};
