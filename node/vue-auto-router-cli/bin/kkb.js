/*
 * @Author: Lvhz
 * @Date: 2021-06-23 16:34:29
 * @Description: Description
 */

const program = require('commander');
// -V 返回版本号：使用方式  kkb -V
program.version(require('../package.json').version);

// kkb init xxx
program.command('init <name>')
  .description('init project')
  .action(require('../lib/init.js'))

program.parse(process.argv);





