const Router = require("koa-router")
const router = new Router({prefix : '/users'})
const userController = require("../controller/user.controller")
// 导入中间件
const {userValidator,verifyUser,bcryptPwd,verifyLogin} = require("../middleware/user.middleware")
const {auth} = require("../middleware/auth.middleware")
// 注册
router.post("/register",userValidator,verifyUser,bcryptPwd,userController.register)
// 登录
router.post("/login",userValidator,verifyLogin,userController.login)
//修改密码
router.patch("/change",auth,bcryptPwd,userController.changePwd)
module.exports = router
