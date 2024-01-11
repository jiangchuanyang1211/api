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

注意：在提交代码时发生了报错
fatal: unable to access 'https://github.com/g1211/api.git/': Failed to connect to github.com port 443: Connection was aborted
网上找解决方法发现是git默认限制推送的大小，运行命令更改限制大小即可解决
git config --global http.postBuffer 524288000

用户登录处理

十二、用户认证
登录成功后，服务端给用户办法一个令牌token，用户在以后的每一次请求中都携带这个令牌
jwt:jsonwebtoken
   header:头部
   playload：载荷
   signature：签名
安装 npm install jsonwebtoken
async login(ctx,next){
    const {username} = ctx.request.body;
    // 1.获取用户信息（在token的playload中，记录id，username，role
    try {
      const {password, ...resUser} = await userService.findUserInfo({username})
      ctx.body = {
        code:0,
        message:"用户登录成功",
        result:{
          token:jwt.sign(resUser,process.env.JWT_SCRECT,{expiresIn:'1d'})
        }
      }
    } catch (error) {
      console.error("用户登录失败",error)
    }
  }
}

十三、修改密码
写一个关于权限认证的中间件auth.middleware.js
  const jwt = require("jsonwebtoken")
  const {tokenExpiredError,jsonWebTokenError} = require("../constant/err.type")
  const auth = async (ctx,next)=>{
    const {authorization} = ctx.request.header
    const token = authorization.replace("Bearer ","")
    try {
      //user里面包含 id，username，role
      var user = jwt.verify(token, process.env.JWT_SCRECT);
      ctx.state.user= user
    } catch (error) {
      switch(error.name){
        case 'TokenExpiredError':
          console.error("token已经过期",error)
          return ctx.app.emit("error",tokenExpiredError,ctx)
        case "JsonWebTokenError":
          console.error("无效的token",error)
          return ctx.app.emit("error",jsonWebTokenError,ctx)

      }
    }
    await next()
  }

  module.exports = {
    auth
  }
在每次调用接口时验证
router.patch("/change",auth,bcryptPwd,userController.changePwd)
在servce层添加修改用户操作数据库的方法
  async changeUser({id,username,password,role}){
    const whereOpt = {id}
    const newUser = {}
    username && Object.assign(newUser,{username});
    password && Object.assign(newUser,{password})
    role && Object.assign(newUser,{role})
    const res = await User.update(newUser, {
      where: whereOpt
    });

    console.log("结果"+res)
    return res;
  }

  在controller层调用
  async changePwd(ctx,next){
    console.log(ctx)
    
    // 获取数据
    const id = ctx.state.user.id;
    const {password} = ctx.request.body
    //操作数据库
    try {
      await userService.changeUser({id,password})
      ctx.body = {
        code:0,
        message:"密码修改成功",
        result:""
      }
    } catch (error) {
      console.error("密码修改失败",error)
    }
  }

  十四、商品模块（/goods）
在router文件夹下保存的都是各个模块的路由，因为在App中，需要将每个模块都导入，这样太过于麻烦，
所以，在ronter文件夹下创建index.js文件，来注册所有路由
const fs = require("fs");
console.log(fs)
const Router = require("koa-router")
const router = new Router();
fs.readdirSync(__dirname).forEach(file=>{
  if(file!="index.js"){
    const r = require("./"+file);
    router.use(r.routes())
  }
})

module.exports = router
在app中只需要注册index就可
const router = require("../router/index")
//router.allowedMethods()可以处理不支持的请求例如link，会给接口返回502，如果是请求方式不同会返回method not allowed
app.use(router.routes()).use(router.allowedMethods())


这个接口编写过程和之前的接口相似：
在app.js中添加
// 文件上传s
app.use(koaBody({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,"../upload"),//在配置选项中尽量使用绝对路径，在option中的相对路径不是相对当前路径，是相对当前运行环境，找不到当前路径
    keepExtensions:true,
  }
}))
// 文件上传e
//router.allowedMethods()可以处理不支持的请求例如link，会给接口返回502，如果是请求方式不同会返回method not allowed
app.use(router.routes()).use(router.allowedMethods())

controller
async upload(ctx,next){
    const {file} = ctx.request.files
    if(file){
      ctx.body = {
        code:0,
        message:"文件上传成功",
        result:{
          imgUrl:path.basename(file.path)
        }
      }
    }else{
      return ctx.app.emit("error",fileUploadError,ctx)
    }
  }

  添加权限中间件
  const isAdmin = async (ctx,next)=>{
  const {role} = ctx.state.user
  console.log("role",role)
  if(!role){
    console.error("该用户没有管理员的权限")
    return ctx.app.emit("error",hasNotAdminPermission,ctx)
  }
  await next()
}
将上传的文件变成静态资源
安装koa-static
npm install koa-static
在app.js中配置koa-static
//处理静态资源
app.use(koaStatic(path.join(__dirname,"../upload")))
之后就可以直接访问图片
http://127.0.0.1:8000/+图片名称


商品上传：
安装中间件 koa-parameter 作为参数校验
npm install koa-parameter
在app中添加
// 参数校验
app.use(parameter(app))

将校验方法做成中间件
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

商品修改和上传具体键代码
商品删除：这里商品删除不建议直接删除数据库数据，可以设置字段标识为已经删除
软删除：
上架下架：
在model中添加一个字段 paranoid:true
const Good = seq.define('jcy_goods', {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"商品名称"

  },
  goods_left: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    comment:"库存"

  },
  goods_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique:true,
    comment:"商品价格"

  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    comment:"商品图片"

  },
 


},
{
  paranoid:true
})
//会判断数据库里是否有这张表没有就创建
// Good.sync({force:true}) //有表可以不使用该行代码
module.exports = Good


如果当条数据被删除了，deletedAt会更新时间戳，表示当前商品已经下架
下架：/goods/1/off
async removeGood(id){
    const res = await Good.destroy({
      where: {
        id: id
      }
    });
    return res;
  }


上架：/goods/1/on
async restoreGood(id){
    const res = await Good.restore({
      where: {
        id: id
      }
    });
    return res;
  }

商品列表：
查询商品需要传入pagesize，和pagenum
// 商品查询
  async findGoods(pageNum,pageSize){
    // 获取总数和分页数据
    // const count = await Good.count();
    // console.log(count);
    // const offset = (pageNum-1)*pageSize;
    // const rows = await Good.findAll({
    //   offset:offset,
    //   limit:pageSize*1,
    //   attributes:["id","goods_name","goods_price","goods_left","goods_img"],
    // })

    // 查询合并
    const offset = (pageNum-1)*pageSize;
    const {rows,count} = await Good.findAndCountAll({
      offset:offset,
      limit:pageSize*1,
      attributes:["id","goods_name","goods_price","goods_left","goods_img"],
    })

    return {
      pageNum,
      pageSize,
      total:count,
      list:rows
    };
  }

购物车：
购物车表：goods_id,user_id,number,selected
默认number为1，selected为true，
添加购物车时会判断购物车中有没有这个商品，如果没有加入，有就把number加1
建表
const { DataTypes } = require('sequelize');
const seq = require("../db/db")
  const Cart = seq.define('jcy_carts', {
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:"商品id"
  
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:"用户id"
  
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1,
      comment:"商品数量"
  
    },
    selected:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true,
      comment:"是否被选中"
    }
    
   
  
  
  })
  //会判断数据库里是否有这张表没有就创建
  // Cart.sync({force:true}) //有表可以不使用该行代码
module.exports = Cart;

操作数据库
async createOrUpdateCart(user_id,goods_id){
      const res = await Cart.findOne({
        where:{
          [Op.and]:{
            user_id,goods_id
          }
        }
      })
      if(res){
        // 如果购物车已经存在的话将数量加一
       await  res.increment("number");
       return await res.reload()
      }else{
        return await Cart.create({
          user_id,goods_id
        })
      }
  }

  购物车列表：
  这里需要和Good模型联表查询
在Cart模型中加入代码
 Cart.belongsTo(Good,{
    foreignKey:"goods_id",
    as:"goods_info"//在good表中查出的数据别名为goods_info
  })

在操作数据库时方法
  async findCarts(pageNum,pageSize){
    const offset = (pageNum-1)*pageSize;
    const {rows,count} = await Cart.findAndCountAll({
      offset:offset,
      limit:pageSize*1,
      attributes:["id","number","selected"],
      include:{
        model:Goods,
        <!-- 这里和Cart模型中对应别名 -->
        as:"goods_info",
        attributes:["id","goods_name","goods_price","goods_left","goods_img"],
      }
    })

    return {
      pageNum,
      pageSize,
      total:count,
      list:rows
    };
  }
}

购物车更新接口：字段：number，selected
async updateCarts({id,number,selected}){
    console.log(id,number,selected)
    const res = await Cart.findByPk(id);
    if(!res)return "";
    number !=undefined ?(res.number=number):""
    selected !=undefined ?(res.selected=selected):""
    
    return await res.save();
  }

删除购物车
koa-body这个中间件只将post，patch，和put方法的参数挂载到ctx.request.body上，别的方法不挂载，需要配置parseMethods
在App中配置加上parsedMethods:['POST','PATCH',"PUT","DELETE"]
app.use(koaBody({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,"../upload"),//在配置选项中尽量使用绝对路径，在option中的相对路径不是相对当前路径，是相对当前运行环境，找不到当前路径
    keepExtensions:true,
    
  },
  parsedMethods:['POST','PATCH',"PUT","DELETE"]
}))
















