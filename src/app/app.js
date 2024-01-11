const path = require("path")
const Koa = require("koa")
const parameter = require('koa-parameter');
const koaStatic = require("koa-static")
const router = require("../router/index")
const {koaBody} = require("koa-body")
const errorHandler = require("./errorHandler")

const app = new Koa();
// 文件上传s
app.use(koaBody({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,"../upload"),//在配置选项中尽量使用绝对路径，在option中的相对路径不是相对当前路径，是相对当前运行环境，找不到当前路径
    keepExtensions:true,
    
  },
  parsedMethods:['POST','PATCH',"PUT","DELETE"]
}))

// 参数校验
app.use(parameter(app))
// 文件上传e
//router.allowedMethods()可以处理不支持的请求例如link，会给接口返回502，如果是请求方式不同会返回method not allowed
app.use(router.routes()).use(router.allowedMethods())

//处理静态资源
app.use(koaStatic(path.join(__dirname,"../upload")))

// 统一错误处理
app.on("error",errorHandler)

module.exports = app