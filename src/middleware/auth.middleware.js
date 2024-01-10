const jwt = require("jsonwebtoken")
const {tokenExpiredError,jsonWebTokenError,hasNotAdminPermission} = require("../constant/err.type")
const auth = async (ctx,next)=>{
  const {authorization=''} = ctx.request.header
  const token = authorization.replace("Bearer ","")
  try {
    //user里面包含 id，username，role
    var user = jwt.verify(token, process.env.JWT_SCRECT);
    ctx.state.user =  user
    console.log(user)
  } catch (error) {
    switch(error.name){
      case 'TokenExpiredError':
        console.error("token已经过期",error)
        return ctx.app.emit("error",tokenExpiredError,ctx)
      case "JsonWebTokenError":
        console.error("无效的token",error)
        return ctx.app.emit("error",jsonWebTokenError,ctx)

    }
  }
  await next()
}

const isAdmin = async (ctx,next)=>{
  const {role} = ctx.state.user
  console.log("role",role)
  if(!role){
    console.error("该用户没有管理员的权限")
    return ctx.app.emit("error",hasNotAdminPermission,ctx)
  }
  await next()
}

module.exports = {
  auth,
  isAdmin
}