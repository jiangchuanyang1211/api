const Good = require("../model/good.model")
class GoodService{
  async createGood(goods_name,goods_price,goods_left,goods_img){
    const good = await Good.create({goods_name,goods_price,goods_left,goods_img})
    // 根据返回结果判断是否注册成功
      console.log("商品写入数据成功",good)
      return good?.dataValues
  }

  async changeGood({id,goods_name,goods_price,goods_left,goods_img}){
    console.log(id,goods_name,goods_price,goods_left,goods_img);
    const whereOpt = {id}
    const newGood = {}
    goods_name && Object.assign(newGood,{goods_name});
    goods_price && Object.assign(newGood,{goods_price})
    goods_left && Object.assign(newGood,{goods_left})
    goods_img && Object.assign(newGood,{goods_img})
    const res = await Good.update(newGood, {
      where: whereOpt
    });

    console.log("结果"+res)
    return res;
  }
// 商品下架
  async removeGood(id){
    const res = await Good.destroy({
      where: {
        id: id
      }
    });
    return res;
  }

  // 商品上架
  async restoreGood(id){
    const res = await Good.restore({
      where: {
        id: id
      }
    });
    return res;
  }

  // 商品查询
  async findGoods(pageNum,pageSize){
    // 获取总数和分页数据
    // const count = await Good.count();
    // console.log(count);
    // const offset = (pageNum-1)*pageSize;
    // const rows = await Good.findAll({
    //   offset:offset,
    //   limit:pageSize*1,
    //   attributes:["id","goods_name","goods_price","goods_left","goods_img"],
    // })

    // 查询合并
    const offset = (pageNum-1)*pageSize;
    const {rows,count} = await Good.findAndCountAll({
      offset:offset,
      limit:pageSize*1,
      attributes:["id","goods_name","goods_price","goods_left","goods_img"],
    })

    return {
      pageNum,
      pageSize,
      total:count,
      list:rows
    };
  }
  

}
module.exports = new GoodService()