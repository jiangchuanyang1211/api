const { DataTypes } = require('sequelize');
const seq = require("../db/db")
const Good = require("./good.model")
  const Cart = seq.define('jcy_carts', {
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:"商品id"
  
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:"用户id"
  
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1,
      comment:"商品数量"
  
    },
    selected:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true,
      comment:"是否被选中"
    }
    
   
  
  
  })
  //会判断数据库里是否有这张表没有就创建
  // Cart.sync({force:true}) //有表可以不使用该行代码
  // cart模型中的外键goods_id在Good模型中所以要用blongsTo
  Cart.belongsTo(Good,{
    foreignKey:"goods_id",
    as:"goods_info"//在good表中查出的数据别名为goods_info
  })

module.exports = Cart;