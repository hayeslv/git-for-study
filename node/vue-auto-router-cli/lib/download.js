/*
 * @Author: Lvhz
 * @Date: 2021-06-23 17:04:35
 * @Description: Description
 */

const { promisify } = require('util');
module.exports.clone = async function(repo, desc) {
  const download = promisify(require('download-git-repo'));
  const ora = require('ora'); // 转圈圈
  const procss = ora(`下载...${repo}`);
  procss.start();
  await download(repo, desc); // desc：放在那个目录下面
  procss.succeed();
}

