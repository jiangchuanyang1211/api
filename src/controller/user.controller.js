const userService = require("../service/user.service")
const {userRegistError} = require("../constant/err.type")
class UserController{
  async register(ctx,next){
    const {username,password} = ctx.request.body
    // 做成中间件抽出去
    // if(!username || !password){
    //   console.error("用户名或密码为空",ctx.request.body)
    //   ctx.status = 400;
    //   ctx.body = {
    //     code:"10001",//前两位表示模块，后面几位表示错误的具体类型
    //     message:"用户名或密码为空",
    //     result:""
    //   }
    // }
    //如果用户存在，就不创建
    try {
      const res = await userService.createUser(username,password)
      ctx.body = {
        code:0,
        message:"注册成功",
        result:{
          id:res.id,
          username:res.username,
          role:res.role,
        }
  
      }
      
    } catch (error) {
        console.log(error)
        app.emit("error",userRegistError)
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