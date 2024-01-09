const Koa = require("koa")
const router = require("../router/user.route")
const {koaBody} = require("koa-body")

const app = new Koa();
app.use(koaBody())
app.use(router.routes())

module.exports = app