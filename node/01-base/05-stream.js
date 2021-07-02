/*
 * @Author: Lvhz
 * @Date: 2021-06-23 15:59:58
 * @Description: Description
 */


const fs = require('fs');
const rs = fs.createReadStream('./1.jpg');
const ws = fs.createWriteStream('./2.png');
rs.pipe(ws);
