const cartService = require("../service/cart.service");
const {cartFormatError} = require("../constant/err.type")
class CartController {
  // 将商品添加到购物车·
  async add(ctx) {
    // 1.解析user_id ,获取goods_id
    const user_id = ctx.state.user.id;
    const goods_id = ctx.request.body.goods_id

    console.log(user_id,goods_id)
    ctx.body = ctx.state.user
    // 2.操作数据库
   try {
    const res = await cartService.createOrUpdateCart(user_id,goods_id)
    // 3.返回结果
    ctx.body={
      code:0,
      message:"购物车添加成功",
      result:res,
    }
   } catch (error) {
    console.error(error)
   }

  }
  // 购物车查询
  async findAll(ctx){
    // 1解析请求参数
    // const user_id = ctx.state.user.id;
     // 解析pageNum和pageSize
     console.log(ctx.request)
     const {pageNum=1,pageSize=10} = ctx.request.body
    // 2操作数据库
    try {
      const res = await cartService.findCarts(pageNum,pageSize);
      // 3返回结果
      ctx.body={
        code:0,
        message:"购物车查询成功",
        result:res,
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 购物车更新
  async update(ctx){
    // 解析参数
    const id = ctx.request.params.id
    const {number,selected} = ctx.request.body
    if(number===undefined && selected===undefined){
      cartFormatError.code.message = "number和selected不能同时为空"
      return ctx.app.emit("error",cartFormatError,ctx)
    }
    // 2操作数据库
    try {
      const res = await cartService.updateCarts({id,number,selected});
      // 3返回结果
      ctx.body={
        code:0,
        message:"购物车更新成功",
        result:res,
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 购物车删除
  async remove(ctx){
    // 解析参数
    const {ids} = ctx.request.body;
    try {
      const res = await cartService.removeCarts(ids);
      // 3返回结果
      ctx.body={
        code:0,
        message:"购物车删除成功",
        result:res,
      }
    } catch (error) {
      console.error(error)
    }
  }
// 购物车全选
async selectAll(ctx){
  const user_id = ctx.state.user.id
  try {
    const res = await cartService.selectAllCarts(user_id);
    // 3返回结果
    ctx.body={
      code:0,
      message:"购物车全选成功",
      result:res,
    }
  } catch (error) {
    console.error(error)
  }
}
// 购物车全不选
async notSelectAll(ctx){
  const user_id = ctx.state.user.id
  try {
    const res = await cartService.notSelectAllCarts(user_id);
    // 3返回结果
    ctx.body={
      code:0,
      message:"购物车全不选成功",
      result:res,
    }
  } catch (error) {
    console.error(error)
  }
}


}
module.exports = new CartController()