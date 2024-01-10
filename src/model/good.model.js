const { DataTypes } = require('sequelize');
const seq = require("../db/db")

const Good = seq.define('jcy_goods', {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"商品名称"

  },
  goods_left: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    comment:"库存"

  },
  goods_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique:true,
    comment:"商品价格"

  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"商品图片"

  },
 


},
{
  paranoid:true
})
//会判断数据库里是否有这张表没有就创建
// Good.sync({force:true}) //有表可以不使用该行代码
module.exports = Good