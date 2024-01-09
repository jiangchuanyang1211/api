const bcrypt = require("bcryptjs")


//创建用户模块中间件
const {findUserInfo} = require("../service/user.service")
//导入用户错误信息
const {userExist,userFormateError} = require("../constant/err.type")
const userValidator = async (ctx,next)=>{
  const {username,password} = ctx.request.body
  if(!username || !password){
    console.error("用户名或密码为空",ctx.request.body)
    ctx.app.emit("error",userFormateError,ctx)
    // ctx.status = 400;
    // ctx.body = {
    //   code:"10001",//前两位表示模块，后面几位表示错误的具体类型
    //   message:"用户名或密码为空",
    //   result:""
    // }
    return 
  }
  await next()
}

const verifyUser = async (ctx,next)=>{

  const {username} = ctx.request.body;
  const findRes = await findUserInfo({username})
  if(findRes){
    // ctx.status = 409
    // ctx.body = {
    //   code:10001,
    //   message:"用户已经存在",
    //   result:""
    // }
    console.error("用户已经存在",username)
    ctx.app.emit('error',userExist,ctx)
    return
  }else{
    await next()
  }
}

const bcryptPwd = async (ctx,next)=>{
  const {password} = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;
  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  bcryptPwd
}
