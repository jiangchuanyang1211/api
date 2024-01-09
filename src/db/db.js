const {Sequelize} = require("sequelize")
const {
  APP_PORT,
MYSQL_HOST,
MYSQL_USER,
MYSQL_PWD,
MYSQL_DB,
} = require("../config/config.default")

// const seq = new Sequelize(MYSQL_DB,MYSQL_USER,MYSQL_PWD,{
//   host:MYSQL_HOST,
//   dialect:"mysql"
// })
const seq = new Sequelize("db_test","root","123456",{
  host:"localhost",
  dialect:"mysql"
})
seq.authenticate().then(()=>{
  console.log('Connection has been established successfully.');
}).catch((err)=>{
  console.log(err)
})
module.exports = seq