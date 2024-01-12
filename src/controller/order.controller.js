const orderService = require("../service/order.service")

class OrderController{
  // 创建订单
  async create(ctx){
       // 解析数据
    const user_id = ctx.state.user.id
    const {address_id,goods_info,total} = ctx.request.body
    // 订单唯一表示生成
    const order_number = 'jcy' + Date.now()
    // 操作数据库
    try {
        const res = await orderService.createOrder({user_id,address_id,goods_info,total,order_number})
        console.log("res"+res)
        if(res){
          ctx.body = {
            code:"0",
            message:"创建订单成功",
            result:res
          }
        }
    } catch (error) {
      console.error(error)
    }
  }
// 查询订单
  async findAll(ctx){

    const {pageNum=1,pageSize=10,status=0} = ctx.request.query;
    // 操作数据库
    try {
      const res = await orderService.findOrders(pageNum,pageSize,status)
      console.log("res"+res)
      if(res){
        ctx.body = {
          code:"0",
          message:"创建查询成功",
          result:res
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  // 更新订单
  async update(ctx){
    const id = ctx.request.params.id;
    const {status} = ctx.request.body;
    try {
      const res = await orderService.updateOrders(id,status)
      console.log("res"+res)
      if(res){
        ctx.body = {
          code:"0",
          message:"订单更新成功",
          result:res
        }
      }
    } catch (error) {
      console.error(error)
    }


  }


}
module.exports = new OrderController()