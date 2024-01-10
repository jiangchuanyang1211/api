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
    console.log(whereOpt)
    return res?res.dataValues:null

  }
  async findUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log(username=="array" && password=="123456")
    return username=="array" && password=="123456"

  }

  async changeUser({id,username,password,role}){
    const whereOpt = {id}
    const newUser = {}
    username && Object.assign(newUser,{username});
    password && Object.assign(newUser,{password})
    role && Object.assign(newUser,{role})
    const res = await User.update(newUser, {
      where: whereOpt
    });

    console.log("结果"+res)
    return res;
  }

}
module.exports = new UserService()