// 操作数据库
const User = require("../model/user.model")
class UserService{
  async createUser(username,password){
    // 数据写入数据库
    if(username && username.trim()!=""&&password && password.trim()!=""){
      const user = await User.create({username,password})
    // 根据返回结果判断是否注册成功
      console.log("写入数据成功",user)
      return user?.dataValues
    }else{
      return null
    }
  }
  async findUserInfo({id,username,password,role}){
    const whereOpt = {}
    id && Object.assign(whereOpt,{id});
    username && Object.assign(whereOpt,{username});
    password && Object.assign(whereOpt,{password})
    role && Object.assign(whereOpt,{role})
    const res = await User.findOne({
      attributes:["id","username","password","role"],
      where:whereOpt
    })
    return res?res.dataValues:null

  }
  async findUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log(username=="array" && password=="123456")
    return username=="array" && password=="123456"

  }


}
module.exports = new UserService()