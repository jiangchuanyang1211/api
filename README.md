# api
koa项目
一、项目初始化
1.npm初始化
npm init -y 
二、搭建项目
安装koa框架
npm install koa 
三、编写最基础app
const Koa = require("koa")
const app = new Koa();
app.use((ctx,next)=>{
  ctx.body="hello"
})
app.listen(3000,()=>{
   console.log("server is running on 3000")
})
四、自动重启服务
安装nodemon工具
node install nodemon
修改package.json 添加脚本命令
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/main.js"
  },

重启服务
node run dev
五、dotenv读取env环境变量
npm install dotenv
1.根目录下创建.env 加入配置信息，例如端口
APP_PORT=8000
2.创建config文件夹，在config文件夹下创建js文件，将配置导出
const dotenv = require("dotenv")
dotenv.config();
console.log(process.env.APP_PORT)
module.exports = process.env
3.在要使用配置的地方导入配置
const {APP_PORT} = require('./config/config.default')
六、添加路由
1.安装koa-router
npm install koa-router
导入
const Router = require("core-router");
实例化
const router = new Router();
编写理由
router.get("/test",()=>{

})
注册中间件
app.use(router.routes())
优化路由
在src下创建router文件
在这个文件下分业务创建js文件例如user相关接口
const Router = require("koa-router")
const router = new Router({prefix : '/users'})
router.get("/",(ctx,next)=>{
  ctx.body = "hello users"
})
module.exports = router
使用路由时直接导入就行

优化项目结构
将main.js中的业务相关的代码分离出去
src下创建app文件夹，在创建app.js文件

拆分路由控制器
在src下创建控制器文件controller文件，在文件下创建对应模块的控制器
例如创建 user.controller.js文件，将业务写在类中
class UserController{
  async register(ctx,next){
    ctx.body = "用户注册成功"
  }
  async login(ctx,next){
    ctx.body ="登录成功"
  }
}
module.exports = new UserController()
路由模块中注册相关路由
const Router = require("koa-router")
const userController = require("../controller/user.controller")
const router = new Router({prefix : '/users'})
router.post("/register",userController.register)
router.post("/login",userController.login)
module.exports = router

七、请求body处理
npm install koa-body 
在请求前将这个中间件注册
在app中加入
const {koaBody} = require("koa-body")
app.use(koaBody())


拆分控制器模块，将操作数据库的部分分离
src下创建文件夹service，在其下分别创建模块操作数据库的js
例如创建用户模块的
创建文件user.service.js,在其中写入数据库操作代码
// 操作数据库
class UserService{
  async createUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log("写入数据成功",username,password)
    return ture

  }
  async findUser(username,password){
    // 数据写入数据库
    // 根据返回结果判断是否注册成功
    console.log(username=="array" && password=="123456")
    return username=="array" && password=="123456"

  }


}
module.exports = new UserService()

八，数据库操作sequelize 是ORM（对象关系映射）用来操作数据库的工具
数据表映射对应一个类
数据表中的数据行对应一个对象
数据表字段对应对象的属性
数据表的操作对应对象的方法

安装对应插件
npm install mysql2 sequelize
连接数据库mysql

