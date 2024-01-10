const userService = require("../service/user.service")
const {userRegistError} = require("../constant/err.type")
const jwt = require("jsonwebtoken")
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
        app.emit("error",userRegistError,ctx)
    }
    

   
  }
  async login(ctx,next){
    const {username} = ctx.request.body;
    // 1.获取用户信息（在token的playload中，记录id，username，role
    try {
      const {password, ...resUser} = await userService.findUserInfo({username})
      ctx.body = {
        code:0,
        message:"用户登录成功",
        result:{
          token:jwt.sign(resUser,process.env.JWT_SCRECT,{expiresIn:'1d'})
        }
      }


    } catch (error) {
      console.error("用户登录失败",error)
    }
  }
  async changePwd(ctx,next){
    console.log(ctx)
    
    // 获取数据
    const id = ctx.state.user.id;
    const {password} = ctx.request.body
    //操作数据库
    try {
      await userService.changeUser({id,password})
      ctx.body = {
        code:0,
        message:"密码修改成功",
        result:""
      }
    } catch (error) {
      console.error("修改密码失败",error)
    }
  }
}
module.exports = new UserController()