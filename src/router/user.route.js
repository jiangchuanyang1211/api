const Router = require("koa-router")
const userController = require("../controller/user.controller")
const router = new Router({prefix : '/users'})
router.post("/register",userController.register)
router.post("/login",userController.login)
module.exports = router
