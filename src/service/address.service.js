const Address = require("../model/address.model")
class AddressService{
  async createAddress({user_id,consignee,phone,address,is_default}){
    const opt = {user_id,consignee,phone,address}
    is_default!==undefined && Object.assign(opt,{is_default});
    // 如果是将新增加的地址设置为默认地址，就需要将之前的默认地址改为false
    if (is_default) {
      await Address.update({ is_default: false }, { where: { user_id: user_id, is_default: true } });
    }
    const addr = await Address.create(opt)
    // 根据返回结果判断是否注册成功
      console.log("地址创建成功",addr)
      return addr?.dataValues
     
  }

  async findAddresses(user_id){
    return await Address.findAll({
      where:{user_id}
    })
  }
  async updateAddresses(id,user_id,consignee,phone,address,is_default){
    const opt = {consignee,phone,address}
    is_default!==undefined && Object.assign(opt,{is_default});
    // 如果是将新增加的地址设置为默认地址，就需要将之前的默认地址改为false
    if (is_default) {
      await Address.update({ is_default: false }, { where: { user_id: user_id, is_default: true } });
    }
    const res = await Address.update(opt,{
      where:{id}
    })
    // 根据返回结果判断是否注册成功
      console.log("地址修改成功",res)
      return res
  }

  async removeAddresses(id){
    return await Address.destroy({
      where:{id}
    })
  }

}
module.exports = new AddressService()