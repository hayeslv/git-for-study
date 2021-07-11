module.exports = {
  async init(ctx, next) {
    const model = ctx.app.$model[ctx.params.list];
    if(model) {
      ctx.list = model;
      await next();
    } else {
      ctx.body = 'no this model'
    }
  },
  async list(ctx) {
    ctx.body = await ctx.list.find({})
  },
  async get(ctx) {
    ctx.body = await ctx.list.findOne({ _id: ctx.params.id })
  },
  async create(ctx) {
    ctx.body = await ctx.list.create(ctx.request.body);
  },
  async update(ctx) {
    ctx.body = await ctx.list.updateOne(
      { _id: ctx.params.id },
      ctx.request.body
    )
  },
  async del(ctx) {
    ctx.body = await ctx.list.deleteOne({ _id: ctx.params.id })
  }
}