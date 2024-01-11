// 1导入koa-router包
const Router = require("koa-router")
// 2.实例化路由对象
const router = new Router({prefix : '/address'})
// 中间件控制器导入
const {auth} = require("../middleware/auth.middleware")
const {validate} = require("../middleware/address.middleware")
const addressController = require("../controller/address.controller")

// 3.编写路由规则
// 新增地址
router.post("/add",auth,validate({
  consignee:"string",
  phone:{
    type:'string',formate:/^[1][3,4,5,7,8][d]{4}[d]{4}$/
  },
  address:"string",
  is_default:{type:"bool",required:false}
  

}),addressController.createAddress)

// 获取所有的地址列表
router.post("/list",auth,addressController.findAll)
// 修改地址
router.put("/:id",auth,validate({
  consignee:"string",
  phone:{
    type:'string',formate:/^[1][3,4,5,7,8][d]{4}[d]{4}$/
  },
  address:"string",
  is_default:{type:"bool",required:false}

}),addressController.update)
// 删除地址
router.delete("/:id",auth,addressController.remove)

// 4.到处路由
module.exports = router