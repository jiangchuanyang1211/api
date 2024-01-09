const { DataTypes } = require('sequelize');
const seq = require("../db/db")

const User = seq.define('jcy_user', {
  //id会被自动创建不用创建
  // 在这里定义模型属性
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"同户名"

  },
  password: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull: false,
    comment:"密码"
  },
  role: {
    type: DataTypes.BOOLEAN,
    // allowNull 默认为 true
    allowNull: false,
    defaultValue:0,
    comment:"0不是管理员（默认），1是管理员"
  }
}, {
  // 这是其他模型参数
});
//会判断数据库里是否有这张表没有就创建
// User.sync({force:true}) //有表可以不使用该行代码
module.exports = User