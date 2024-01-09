const userService = require("../service/user.service")
class UserController{
  async register(ctx,next){
    const {username,password} = ctx.request.body
    if(await userService.createUser(username,password)){
      ctx.body = "注册成功"
    }else{
      ctx.body = "注册失败"
    }
   
  }
  async login(ctx,next){
    const {username,password} = ctx.request.body
    if(await userService.findUser(username,password)){
      ctx.body = "登录成功"
    }else{
      ctx.body = "登录失败"
    }
  }
}
module.exports = new UserController()