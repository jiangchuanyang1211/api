const Router = require("koa-router")
const router = new Router({prefix : '/cart'})
const cartController = require("../controller/cart.controller")
const {auth} = require("../middleware/auth.middleware")
const {validate} = require("../middleware/cart.middleware")

// 添加购物车
router.post("/add",auth,validate({goods_id:"number"}),cartController.add)
// 查询购物车
router.post("/list",auth,cartController.findAll)

// 购物车更新patch请求（打补丁）
router.patch("/:id",auth,
validate({
  number: { type:"number",required:false},
  selected:{type:"bool",required:false},
  
}),
cartController.update)
// 购物车删除
router.delete("/",auth,validate({ids:"array"}),cartController.remove)
// 购物车全选
router.post("/selectAll",auth,cartController.selectAll)
// 购物车全不选
router.post("/notSelectAll",auth,cartController.notSelectAll)


module.exports = router