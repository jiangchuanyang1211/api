const { Op } = require("sequelize")
const Cart = require("../model/cart.model");
const Goods = require("../model/good.model");
class Cartservice{
  async createOrUpdateCart(user_id,goods_id){
      const res = await Cart.findOne({
        where:{
          [Op.and]:{
            user_id,goods_id
          }
        }
      })
      if(res){
        // 如果购物车已经存在的话将数量加一
       await  res.increment("number");
       return await res.reload()
      }else{
        return await Cart.create({
          user_id,goods_id
        })
      }
  }
  async findCarts(pageNum,pageSize){
    const offset = (pageNum-1)*pageSize;
    const {rows,count} = await Cart.findAndCountAll({
      offset:offset,
      limit:pageSize*1,
      attributes:["id","number","selected"],
      include:{
        model:Goods,
        as:"goods_info",
        attributes:["id","goods_name","goods_price","goods_left","goods_img"],
      }
    })
    return {
      pageNum,
      pageSize,
      total:count,
      list:rows
    };
  }
  async updateCarts({id,number,selected}){
    const res = await Cart.findByPk(id);
    if(!res)return "";
    number !=undefined ?(res.number=number):""
    selected !=undefined ?(res.selected=selected):""
    
    return await res.save();
  }
  async removeCarts(ids){
   return await Cart.destroy({
      where:{
        id:{
          [Op.in]:ids
        }
      }
    })
  }

  async selectAllCarts(user_id){
    return await Cart.update({selected:true},
      {
        where:{user_id}
      })
  }

  async notSelectAllCarts(user_id){
    return await Cart.update({selected:false},
      {
        where:{user_id}
      })
  }

}

module.exports = new Cartservice()