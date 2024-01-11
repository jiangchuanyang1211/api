
const {cartFormatError} = require("../constant/err.type")

const validate = (rules)=>{
  return async (ctx,next)=>{
    try {
      ctx.verifyParams(rules)
    } catch (error) {
      console.error(error)
      invalidGoodId.result = error;
      return ctx.app.emit("error",cartFormatError,ctx)
    }
    await next()
  }
}
module.exports = {
  validate
}