const Order = require("../model/order.model")

class OrderService{
  async createOrder(order){
    return await Order.create(order)
  }

  async findOrders(pageNum,pageSize,status){
     // 查询合并
     const offset = (pageNum-1)*pageSize;
     const {rows,count} = await Order.findAndCountAll({
      where:{status},
       offset:offset,
       limit:pageSize*1,
       attributes:["goods_info","total","order_number","status"],
     })
 
     return {
       pageNum,
       pageSize,
       total:count,
       list:rows
     };
  }

  async updateOrders(id,status){
    const res = await Order.update({
      status
    },{
      where:{id}
    })

    return res
  }

}

module.exports = new OrderService()