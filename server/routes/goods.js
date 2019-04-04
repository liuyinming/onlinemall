var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var Goods = require('../models/goods.js');
var Users = require('../models/users.js');

//上传图片的模板
var multer=require('multer');
//生成的图片放入uploads文件夹下
var upload=multer({dest:'uploads/'})

/* GET home page. */
router.get('/list', function(req, res, next) {
  //console.log(req.query)
  var page = parseInt(req.query.page);
  var pageSize = parseInt(req.query.pageSize);
  var sort = parseInt(req.query.sort);
  var skip = page*pageSize; 
  var priceNum = req.query.priceChecked;
  //console.log(priceNum);
  var priceLow = '0';
  var priceHigh = '10000';
  if (priceNum!='all') {
    //console.log(1111111111);
    switch(priceNum){
      case '0': priceLow = 0;priceHigh = 100;break;
      case '1': priceLow = 100;priceHigh = 200;break;
      case '2': priceLow = 200;priceHigh = 1000;break;
      case '3': priceLow = 1000;priceHigh = 5000;break;
    }
  };
  var param = {
    salePrice:{
      $gt:priceLow,
      $lte:priceHigh
    }
   //console.log(page);
  }
  // console.log(pageSize);
  Goods.find(param).skip(skip).limit(pageSize).sort({'salePrice':sort}).exec(function(err,data){
  	if (err) {
  		throw err
  	}else{
  		res.status(200).json({
  			ret:1,
  			data:data
  		})
  	}
  })
});

//加入购物车功能
router.post('/addcart',function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  //console.log(productId);
  Users.findOne({userId:userId},function(err,userDoc){
    if (err) {
      res.status(200).json({
        code:1,
        msg: err.message
      })
    }else{
      //console.log(userDoc);
      if (userDoc) {
         Goods.findOne({productId:productId},function(err,goodDoc){
          if (err) {
            res.status(200).json({
              code: 1,
              msg: err.message
            })
          }else{
            let goodItem =0;
            userDoc.cartList.forEach(function(item){
              if (item.productId==productId) {
                 item.productNum++;
                 goodItem = 1;
              }
            });
            if (goodItem==1) {
              userDoc.save(function(err,userSave){
                if (err) {
                  res.status(200).json({
                    code:1,
                    msg: err.message
                  })
                }else{
                 // console.log(2)
                    res.status(200).json({
                      code:0,
                      msg: '添加成功'
                    })
                }
              })
              //保存数量加过之后的数据
            }else{
                goodDoc.productNum=1;
                goodDoc.checked = 1;
                userDoc.cartList.push(goodDoc);
                userDoc.save(function(err,userSave){
                if (err) {
                  res.status(200).json({
                    code:1,
                    msg: err.message
                  })
                }else{
                  //console.log(0)
                    res.status(200).json({
                      code:0,
                      msg: '添加成功'
                    })
                }
              })
            }
            //保存新加的商品至购物车
          }
         })
      }
    }

  })
})

//删除某件商品
router.post('/delProduct',function(req,res,next){
  var productId = req.body.productId;
  //console.log(111);
  Goods.deleteOne({productId:productId},(err,data)=>{
    console.log(data);
          if (err) {
            //console.log(111)
            res.status(500).json({
                    code:1,
                    msg: err.message,
                    result:''
                  })
          }else{
            res.status(200).json({
                    code:0,
                    msg: 'success',
                    result:''
                  })
          }
  })
})

//上传图片
//图片上传必须用post方法
router.post('/upload',upload.single('test'),(req,res)=>{
    //console.log(req.file)
    //res.send('upload img')
    fs.readFile(req.file.path,(err,data)=>{
    //读取失败，说明没有上传成功
        if(err){return res.status(500).json({
          code: 500,
          message: '上传失败'
        })}  
     //否则读取成功，开始写入
     //我们先尝试用原文件名originalname写入吧
     //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性,可以通过时间戳+随机数的方式来尽量保证唯一性
    let time=Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
    //拓展名
    let extname=req.file.mimetype.split('/')[1]
    //拼接成图片名
    let keepname=time+'.'+extname
     // 三个参数
     //1.图片的绝对路径
     //2.写入的内容
     //3.回调函数  
     //console.log(path.join(__dirname,'./../../static/image/'+keepname));
      fs.writeFile(path.join(__dirname,'./../../static/image/'+keepname),data,(err)=>{
            if(err){
              return res.status(500).json({
                          code: 500,
                          message: '上传失败'
                        })}else{
                res.status(200).json({
                  code: 0,
                  message:'success',
                  result:keepname
                })
              }
        })
    })
})

//添加一件商品
router.post('/saveProduct',(req,res,next)=>{
  var productName = req.body.productName;
  //console.log(productName);
  var salePrice = req.body.salePrice;
  var productImage = req.body.productImage;
  var productId = '2019'+parseInt(Math.random()*1000)+parseInt(Math.random()*100);
  var param = {
    productId: productId,
    productName:productName,
    salePrice:salePrice,
    productImage:productImage,
    productUrl:''
  };
  new Goods(param).save((err,data)=>{
    if (err) {
               return res.status(500).json({
                   code: 500,
                   message: 'server is error!'   
               })
          }
          res.status(200).json({
          code: 0,
          message: 'success',
          result:''
        })
  })
})
module.exports = router;  