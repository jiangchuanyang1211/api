// 操作数据库
class UserService{
  async createUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log("写入数据成功",username,password)
    return ture

  }
  async findUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log(username=="array" && password=="123456")
    return username=="array" && password=="123456"

  }


}
module.exports = new UserService()