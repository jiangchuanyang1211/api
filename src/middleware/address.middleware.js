const {addrFormatError} = require("../constant/err.type")

const validate = (rules)=>{
  return async (ctx,next)=>{
    try {
      ctx.verifyParams(rules)
    } catch (error) {
      console.error(error)
      addrFormatError.result = error;
      return ctx.app.emit("error",addrFormatError,ctx)
    }
    await next()
  }
}

module.exports = {
  validate
}