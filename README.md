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
在src下创建db文件夹，文件夹下创建js文件用于数据库的链接
const {Sequelize} = require("sequelize")
const {
MYSQL_HOST,
MYSQL_USER,
MYSQL_PWD,
MYSQL_DB,
} = require("../config/config.default")
const seq = new Sequelize(MYSQL_DB,MYSQL_USER,MYSQL_PWD,{
  host:MYSQL_HOST,
  dialect:"mysql"
})
module.exports = seq

配置文件
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PWD=123456
MYSQL_DB=db_test

创建模型：
在src下创建model文件夹，在其下创建用户模块模型 user.model.js
const { DataTypes } = require('sequelize');
const seq = require("../db/db")

const User = seq.define('jcy_user', {
  //id会被自动创建不用创建
  // 在这里定义模型属性
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"同户名"

  },
  password: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    allowNull: false,
    comment:"密码"
  },
  role: {
    type: DataTypes.BOOLEAN,
    // allowNull 默认为 true
    allowNull: false,
    defaultValue:0,
    comment:"0不是管理员（默认），1是管理员"
  }
}, {
  // 这是其他模型参数
});
//会判断数据库里是否有这张表没有就创建
// User.sync({force:true}) //有表可以不使用该行代码
module.exports = User

在controller层会先对数据进行检查，合法才会放行，调用数据库后，也会对调用结果进行判断，然后包装返回结果
class UserController{
  async register(ctx,next){
    const {username,password} = ctx.request.body
    if(!username || !password){
      console.error("用户名或密码为空",ctx.request.body)
      ctx.status = 400;
      ctx.body = {
        code:"10001",//前两位表示模块，后面几位表示错误的具体类型
        message:"用户名或密码为空",
        result:""
      }
    }
    //如果用户存在，就不创建
    const findRes = await userService.findUserInfo(username,password)
    if(findRes==null){
      const res = await userService.createUser(username,password)
      if(res){
        ctx.body = {
          code:0,
          message:"注册成功",
          result:{
            id:res.id,
            username:res.username,
            role:res.role,
          }
  
        }
      }else{
        ctx.body = "注册失败"
      }
    }else{
      ctx.status = 409
      ctx.body = {
        code:10001,
        message:"用户已经存在",
        result:""

      }
    }
九、中间件抽离
在src下创建middleware文件夹，在其下创建user模块中间件 user.middleware.js，这个文件由一个个方法组成
//创建用户模块中间件
const {findUserInfo} = require("../service/user.service")
//导入用户错误信息
const {userExist,userFormateError} = require("../constant/err.type")
const userValidator = async (ctx,next)=>{
  const {username,password} = ctx.request.body
  if(!username || !password){
    console.error("用户名或密码为空",ctx.request.body)
    ctx.app.emit("error",userFormateError,ctx)
    // ctx.status = 400;
    // ctx.body = {
    //   code:"10001",//前两位表示模块，后面几位表示错误的具体类型
    //   message:"用户名或密码为空",
    //   result:""
    // }
    return 
  }
  await next()
}

const verifyUser = async (ctx,next)=>{
  const {username} = ctx.request.body;
  const findRes = await findUserInfo(username)
  if(findRes){
    // ctx.status = 409
    // ctx.body = {
    //   code:10001,
    //   message:"用户已经存在",
    //   result:""
    // }
    console.error("用户已经存在",username)
    ctx.app.emit('error',userExist,ctx)
    return
  }else{
    await next()
  }
}

module.exports = {
  userValidator,
  verifyUser
}

这些中间件可以调用接口的时候使用
router.post("/register",userValidator,verifyUser,userController.register)


十、错误处理
在src下创建创建常量文件夹constant，在其下创建用户模块的常量错误信息
user.type.js
module.exports = {
  userFormateError:{
    code:"10001",
    message:"用户名或密码为空",
    result:""
  },
  userExist:{
    code:"10002",
    message:"用户已经存在",
    result:""
  },
  userRegistError:{
      code:10003,
      message:"用户注册错误",
      result:""
  }
}

在发生错误的地方注册错误信息
ctx.app.emit('error',userExist,ctx)

const verifyUser = async (ctx,next)=>{
  const {username} = ctx.request.body;
  const findRes = await findUserInfo(username)
  if(findRes){
    // ctx.status = 409
    // ctx.body = {
    //   code:10001,
    //   message:"用户已经存在",
    //   result:""
    // }
    console.error("用户已经存在",username)
    ctx.app.emit('error',userExist,ctx)
    return
  }else{
    await next()
  }
}


errorHandler里面包含所有的错误码，根据错误码，得到不同的状态码
errorHandler.js
module.exports = (err,ctx)=>{
  let status = 500
  switch(err.code){
    case "10001":
      status = 400
    break
    case "10002":
      status = 400
    break
    default:
      status:500
  }
  ctx.status = status;
  ctx.body = err;
}

在app.js文件中统一处理
// 统一错误处理
app.on("error",errorHandler) 

十一、密码加密
在密码保存在数据库之前需要对密码进行加密
bcryptjs
npm install bcryptjs

