const { DataTypes } = require('sequelize');
const seq = require("../db/db")

const Address = seq.define('jcy_addresses', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment:"用户id"

  },
  consignee: {
    type: DataTypes.STRING,
    allowNull: false,
    comment:"收件人名称"

  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment:"收件人地址"

  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment:"收件人联系方式"

  },
  is_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false,
    comment:"是否设置为默认地址"

  },


})
//会判断数据库里是否有这张表没有就创建force:true强制重新创建表
// Address.sync({force:true}) //有表可以不使用该行代码
module.exports = Address