/*
 * @Author: Lvhz
 * @Date: 2021-07-02 15:03:02
 * @Description: Description
 */
const http = require('http');
// github-webhook-handler 的绝对路径
var createHandler = require('/root/tool/nodejs/node-v12.10.0-linux-x64/lib/node_modules/github-webhook-handler')
// secret 保持和 GitHub 后台设置保持一致
var handler = createHandler({ path: '/', secret: 'dylanlv2021' })

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777) // 启动服务的端口，需要开放安全组

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
    run_cmd('sh', ['./webhooks.sh',event.payload.repository.name], function(text){ console.log(text) });
})

