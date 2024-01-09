const app = require("./app/app")

const {APP_PORT} = require('./config/config.default')
// 导入app对象

//路由
// const Router = require("koa-router");
// const router = new Router();
// router.get("/",(ctx,next)=>{
//   ctx.body = "hello koa"
// })
// router.get("/hello",(ctx,next)=>{
//   ctx.body = {name:"array"}
// })

app.listen(APP_PORT,()=>{
   console.log("server is running on "+APP_PORT)
})