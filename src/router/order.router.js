const Router = require("koa-router")
const router = new Router({prefix : '/orders'})
const {auth} = require("../middleware/auth.middleware")
const {validator} = require("../middleware/common.middleware")
const { orderFormatError } = require("../constant/err.type")


const orderController = require("../controller/order.controller")
// 新增订单
router.post("/",auth,validator({
  address_id:"int",
  goods_info:"string",
  total:"string"
},orderFormatError),orderController.create)
// 查询订单
router.get("/",auth,orderController.findAll)

// 更新订单
router.patch("/:id",auth,validator({status:"number"}),orderController.update)
module.exports = router