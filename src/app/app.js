const Koa = require("koa")
const router = require("../router/user.route")
const {koaBody} = require("koa-body")
const errorHandler = require("./errorHandler")

const app = new Koa();
app.use(koaBody())
app.use(router.routes())
// 统一错误处理
app.on("error",errorHandler)

module.exports = app