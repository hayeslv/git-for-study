// app/controller/upload.js
const fs = require('fs')
const path = require('path')
const { Controller } = require('egg')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
/**
 * @Controller 上传
 */
class UploadController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary 上传单个⽂件
   * @description 上传单个⽂件
   * @router post /api/upload/single
   */
  async create() {
    const { ctx } = this
    // 要通过 ctx.getFileStream 便捷的获取到⽤户上传的⽂件，需要满⾜两个条件：
    // 只⽀持上传⼀个⽂件。
    // 上传⽂件必须在所有其他的 fields 后⾯，否则在拿到⽂件流时可能还获取不到fields。
    const stream = await ctx.getFileStream()
    // 所有表单字段都能通过 `stream.fields` 获取到
    const filename = path.basename(stream.filename) // ⽂件名称
    const extname = path.extname(stream.filename).toLowerCase() // ⽂件扩展名称
    const uuid = (Math.random() * 999999).toFixed()
    // 组装参数 stream
    const target = path.join(this.config.baseDir, 'app/public/uploads', `${uuid}${extname}`)
    const writeStream = fs.createWriteStream(target)
    // ⽂件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      // 必须将上传的⽂件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream) // 其实就是一直on data，内部不做任何处理，让它存，存个寂寞
      throw err
    }
    // 调⽤ Service 进⾏业务处理
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }
}
module.exports = UploadController