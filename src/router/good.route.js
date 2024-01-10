const Router = require("koa-router")
const router = new Router({prefix : '/goods'})
const goodController = require("../controller/good.controller")
// const auth 
const {auth,isAdmin} = require("../middleware/auth.middleware")
const {validateGood} = require("../middleware/good.middleware")
router.post("/upload",auth,isAdmin,goodController.upload)
// 图片上传
// router.post("/upload",goodController.upload)
// 发布商品
router.post("/publish",auth,isAdmin,validateGood,goodController.publishGood);
// 修改商品信息
router.put("/update/:id",auth,isAdmin,validateGood,goodController.updateGood)
// 删除商品一般不会真正删除数据库数据，将商品的状态改为已删除

//商品下架
router.post("/:id/off",auth,isAdmin,goodController.remove)
//商品上架
router.post("/:id/on",auth,isAdmin,goodController.restore)
// 获取商品列表
router.post("/list",goodController.findAll)

module.exports = router