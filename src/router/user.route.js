const Router = require("koa-router")
const userController = require("../controller/user.controller")
// 导入中间件
const {userValidator,verifyUser,bcryptPwd} = require("../middleware/user.middleware")
const router = new Router({prefix : '/users'})
router.post("/register",userValidator,verifyUser,bcryptPwd,userController.register)
router.post("/login",userController.login)
module.exports = router
