const {goodFormateError} = require("../constant/err.type")
const validateGood = async (ctx,next)=>{
  console.log("检验参数类型")
  try {
    ctx.verifyParams({
      goods_name:{
        type:'string',
        required:true
      },
      goods_price:{
        type:'number',
        required:true
      },
      goods_left:{
        type:'number',
        required:true
      },
      goods_img:{
        type:'string',
        required:true
      }
    })
  } catch (error) {
    console.error(error)
    goodFormateError.result = error
    return ctx.app.emit("error",goodFormateError,ctx)
  }
  await next()
}

module.exports = {
  validateGood
}