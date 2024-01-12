const validator = (rules,ErrorType)=>{
  return async (ctx,next)=>{
    try {
      ctx.verifyParams(rules)
    } catch (error) {
      console.error(error)
      invalidGoodId.result = error;
      return ctx.app.emit("error",ErrorType,ctx)
    }
    await next()
  }
}
module.exports = {
  validator
}