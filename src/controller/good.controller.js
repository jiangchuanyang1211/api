const path = require("path")
const {fileUploadError,fileFormateError,goodPublishError,invalidGoodId} = require("../constant/err.type")
const goodService = require("../service/good.service")
class GoodController{
  // 上传商品图片
  async upload(ctx,next){
    const fileType=["image/jpeg","image/png"]
    const {file} = ctx.request.files
    if(file){
      console.log(file.mimetype)
      if(!fileType.includes(file.mimetype)){
        console.error("文件格式不支持")
        return ctx.app.emit("error",fileFormateError,ctx)
      }
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
  // 发布商品
    async publishGood(ctx){
      // 操作数据库添加商品
      const {goods_name,goods_price,goods_left,goods_img} = ctx.request.body
      try {
        const res = await goodService.createGood(goods_name,goods_price,goods_left,goods_img)
        ctx.body = {
          code:0,
          message:"商品发布成功",
          result:{
            id:res.id,
            goods_name:res.goods_name,
            goods_price:res.goods_price,
            goods_left:res.goods_left,
            goods_img:res.goods_img,
          }
    
        }
        
      } catch (error) {
          console.log(error)
          app.emit("error",goodPublishError,ctx)
      }
    }
  // 更新商品
  async updateGood(ctx){
    const {goods_name,goods_price,goods_left,goods_img} = ctx.request.body
    try {
      const res = await goodService.changeGood({id:ctx.params.id,goods_name,goods_price,goods_left,goods_img})
      if(res[0]<1){
        return ctx.app.emit("error",invalidGoodId,ctx)
      }else{
        ctx.body = {
          code:0,
          message:"商品信息修改成功",
          result:""
        }
      }
    } catch (error) {
      console.error("商品信息修改失败",error)
    }
  }
  // 商品下架
  async remove(ctx){
    try {
      const res = await goodService.removeGood(ctx.params.id)
      if(!res){
        return ctx.app.emit("error",invalidGoodId,ctx)
      }else{
        ctx.body = {
          code:0,
          message:"商品下架成功",
          result:""
        }
      }
    } catch (error) {
      console.error("商品下架失败",error)
    }
  }
  // 商品上架
  async restore(ctx){
    try {
      const res = await goodService.restoreGood(ctx.params.id)
      if(!res){
        return ctx.app.emit("error",invalidGoodId,ctx)
      }else{
        ctx.body = {
          code:0,
          message:"商品上架成功",
          result:""
        }
      }
    } catch (error) {
      console.error("商品上架失败",error)
    }
  }

  // 列表查询
  async findAll(ctx){
    // 解析pageNum和pageSize
    const {pageNum=1,pageSize=10} = ctx.request.query
    // 调用数据处理的方法
   try {
    const res = await goodService.findGoods(pageNum,pageSize)
    ctx.body = {
      code:0,
      message:"数据查询成功",
      result:{
        res
      }
    }
   } catch (error) {
     console.error(error)
   }
    // 返回结果
  }


}
module.exports = new GoodController()