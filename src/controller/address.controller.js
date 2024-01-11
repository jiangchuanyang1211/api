const addressService = require("../service/address.service")
class AddressController{
  // 添加地址
  async createAddress(ctx){
    // 解析数据
    const user_id = ctx.state.user.id
    const {consignee,phone,address,is_default} = ctx.request.body;
    // 操作数据库
    try {
      const res = await addressService.createAddress({user_id,consignee,phone,address,is_default})
      if(res){
        ctx.body = {
          code:"0",
          message:"新增地址成功",
          result:res
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 查询所有的地址
  async findAll(ctx){
     // 解析数据
     const user_id = ctx.state.user.id
    // 操作数据库
    try {
      const res = await addressService.findAddresses(user_id)
      if(res){
        ctx.body = {
          code:"0",
          message:"查询地址列表成功",
          result:res
        }
      }
    } catch (error) {
      console.error(error)
    }

  }
  // 修改地址
  async update(ctx){
    // 解析数据
    const id = ctx.request.params.id
    const user_id = ctx.state.user.id
    const {consignee,phone,address,is_default=false} = ctx.request.body;
     // 操作数据库
     try {
      const res = await addressService.updateAddresses(id,user_id,consignee,phone,address,is_default)
      if(res){
        ctx.body = {
          code:"0",
          message:"修改地址列表成功",
          result:res
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
// 删除接口
async remove(ctx){
   // 解析数据
   const id = ctx.request.params.id
    // 操作数据库
    try {
     const res = await addressService.removeAddresses(id)
     if(res){
       ctx.body = {
         code:"0",
         message:"删除地址成功",
         result:res
       }
     }
   } catch (error) {
     console.error(error)
   }
}

}

module.exports = new AddressController()