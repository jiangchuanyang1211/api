const { DataTypes } = require('sequelize');
const seq = require("../db/db")

const Orders = seq.define('jcy_orders', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment:"用户id"

  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment:"地址id"

  },
  goods_info: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment:"商品信息"

  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    comment:"订单总金额"

  },
  order_number: {
    type: DataTypes.CHAR(16),
    allowNull: false,
    comment:"唯一订单标识"

  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue:0,
    comment:"订单状态"

  }


})
//会判断数据库里是否有这张表没有就创建
// Orders.sync({force:true}) //有表可以不使用该行代码
module.exports = Orders