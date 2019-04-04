var express = require('express');
var router = express.Router();
var Users = require('../models/users.js');
require('./../util/dateformat.js')

/* GET users listing. */
router.post('/login', function(req, res, next) {
	//console.log(req.body);
	 var param = req.body;
	 //console.log(param.userPwd);
     Users.findOne({
     	userName:param.userName
     },function(err,data){
     	if (err) {
     		return err.message;
     	}else if (!data) {
     		res.status(200).json({
     			code: 2,
     			message: '用户不存在'
     		})
     	}else{
     		if (data.userPwd == param.userPwd) {
                    //console.log(data);
                    res.cookie("userId",data.userId,{
                         path:'/',
                         maxAge:1000*60*60
                    });
                    res.cookie("userName",data.userName,{
                         path:'/',
                         maxAge:1000*60*60
                    });
     			res.status(200).json({
     			code:0,
     			message: '密码正确'
     		})
     		}else{
                res.status(200).json({
     			code:1,
     			message: '密码错误'
     		})
     	}
     }
  //res.send('respond with a resource');
});
});

router.get('/logout',function(req,res,next){
     res.cookie("userId",'',{
                    path:'/',
                    maxAge:-1
               });
     res.cookie("userName",'',{
                    path:'/',
                    maxAge:-1
               });
     res.status(200).json({
          code:0,
          msg:"logout success!"
     })
})

router.get('/checkLogin',function(req,res,next){
      if (req.cookies.userId) {
          res.status(200).json({
               code:0,
               msg:"当前已登录！",
               result:req.cookies.userName
          })
      }else{
          res.status(500).json({
               code:1,
               msg:'server is error!',
               result:''
          })
      }
})
//获取购物车商品
router.get('/cartList',function(req,res,next){
     var userId = req.cookies.userId;
     Users.findOne({userId:userId},function(err,userDoc){
         if (err) {
          res.status(500).json({
               code:1,
               msg:'server is error!'
          })
         }else{
          res.status(200).json({
               code:0,
               msg:'success',
               result:userDoc.cartList
          })
         }
     })
})

//删除购物车的某件商品
router.post('/cartDel',function(req,res,next){
     //console.log(111);
     var userId = req.cookies.userId;
     var productId = req.body.productId;
    // console.log(productId);
    Users.update({userId:userId},{
      $pull:{
        'cartList':{
          productId:productId
        }
      }
    },function(err,data){
     if (err) {
          res.status(500).json({
               code:1,
               msg:err.message,
               result:''
          })
     }else{
          res.status(200).json({
               code:0,
               msg:'success',
               result:''
          })   
     }
    })
})

//修改购物车商品的属性
router.post('/editCart',function(req,res,next){
     var userId = req.cookies.userId;
     var productId = req.body.productId;
     var checked = req.body.checked;
     var productNum = req.body.productNum;
     console.log(checked);
     Users.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function(err,data){
     if (err) {
          //console.log(11)
          res.status(500).json({
               code:1,
               msg:err.message,
               result:''
          })
     }else{
         // console.log(22)
          res.status(200).json({
               code:0,
               msg:'success',
               result:''
          })   
     }
  })
})

//全选或者不全选购物车商品
router.post('/editCheckAll',function(req,res,next){
    // console.log(req.body.checkAll);
    var userId = req.cookies.userId;
    var checked = req.body.checkAll?'1':'-1';
    Users.findOne({userId:userId},function(err,userDoc){
        if (err) {
          res.status(500).json({
               code:1,
               msg:err.message
          })
        }else{
               //console.log(userDoc.cartList);
               userDoc.cartList.forEach((item,index)=>{
                    item.checked = checked
               });
               userDoc.save((err,data)=>{
                    if (err) {
                         res.status(500).json({
                         code:1,
                         msg:err.message
                        })
                    }else{
                         res.status(200).json({
                              code:0,
                              msg:'success'
                         })
                    }
               })
        }
    })
})
//获取地址列表
router.get('/addressList',(req,res,next)=>{
     var userId = req.cookies.userId;
     Users.findOne({userId:userId},function(err,userDoc){
          if (err) {
               res.status(500).json({
               code:1,
               msg:err.message,
               result:''
          })
          }else{
               res.status(200).json({
               code:0,
               msg:'success',
               result: userDoc.addressList
          })
          }
     })
})

//删除地址
router.post('/delAddress',(req,res,next)=>{
     var userId = req.cookies.userId;
     var addressId = req.body.addressId;
     //console.log(addressId);
     Users.update({userId:userId},{
      $pull:{
        'addressList':{
          addressId:addressId
        }
      }
    },(err,data)=>{
      if (err) {
          res.status(500).json({
               code:1,
               msg:err.message,
               result:''
          })
     }else{
          res.status(200).json({
               code:0,
               msg:'success',
               result:''
          })
     }
    })
})

//添加地址
router.post('/addAddress',(req,res,next)=>{
     var userId = req.cookies.userId;
     var param = {};
     param.addressId = req.body.addressId;
     param.userName = req.body.userName;
     param.streetName = req.body.streetName;
     param.postCode = req.body.postCode;
     param.tel = req.body.tel;
     param.isDefault = req.body.isDefault; 
     //console.log(param);
     Users.findOne({userId:userId},function(err,userDoc){
          if (err) {
               //console.log(11)
          res.status(500).json({
               code:1,
               msg:err.message,
               result:''
          })
          }else{
               userDoc.addressList.unshift(param);
               userDoc.save(function(err,data){
                     if (err) {
                         //console.log(22)
                        res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
                     }else{
                         //console.log(33)
                         res.status(200).json({
                         code:0,
                         msg: 'success',
                         result:''
                        })
                     }
               })
          }
     })
})

//修改默认地址
router.post('/setDefalutAddress',(req,res,next)=>{
     var userId = req.cookies.userId;
     var addressId = req.body.addressId;
     //console.log(addressId);
     Users.findOne({userId:userId},(err,userDoc)=>{
          if (err) {
               res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
          }else{
               userDoc.addressList.forEach(function(item){
                    if (item.addressId==addressId) {
                         item.isDefault = true;
                    }else{
                         item.isDefault = false;
                    }
               });
               userDoc.save(function(err,data){
                    if (err) {
                         res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
                    }else{
                         res.status(200).json({
                         code:0,
                         msg: "success",
                         result:''
                        })
                    }
               })
          }
     })
})
//添加订单
router.post('/payment',(req,res,next)=>{
     var userId = req.cookies.userId;
     var addressId = req.body.addressId;
     var totalPrice = req.body.totalPrice;
     //console.log(totalPrice);
     Users.findOne({userId:userId},function(err,userDoc){
          if (err) {
               res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
          }else{
               var addressInfo = {};
               var goodsList =[];
               //console.log(userDoc);
               userDoc.addressList.forEach(function(item){
                    if (item.addressId==addressId) {
                         addressInfo = item;
                    }
               })
               userDoc.cartList.forEach((item)=>{
                    if (item.checked==1) {
                         goodsList.push(item);
                    }
               });
               //console.log(addressInfo);
               var  orderId = '';
               var r1 = Math.floor(Math.random()*9)+1;
               var r2 = Math.floor(Math.random()*9)+1;
               var time = new Date().Format('yyyyMMddhhmmss');
               orderId = '322'+r1+time+r2;
               //console.log(orderId);
               var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
               //console.log(createDate);
               var order = {
                    orderId:orderId,
                    orderTotal:totalPrice,
                    addressInfo:addressInfo,
                    goodsList:goodsList,
                    orderStatus:"1",
                    createDate:createDate
               }
               //console.log(order);
               userDoc.orderList.unshift(order);
               userDoc.save(function(err,data){
                    if (err) {
                         res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
                    }else{
                         res.status(200).json({
                         code:0,
                         msg: "success",
                         result:orderId
                        })
                    }
               })
          }
     })
});
//获取订单详情
router.get('/orderPay',(req,res,next)=>{
     var userId = req.cookies.userId;
     var orderId = req.query.orderId;
     //console.log(111);
     Users.findOne({userId:userId},(err,userDoc)=>{
          if (err) {
               res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
          }else{
               var orderTotal = '';
               userDoc.orderList.forEach((item)=>{
                    if (item.orderId==orderId) {
                         orderTotal=item.orderTotal;
                    }
               })
               res.status(200).json({
                         code:0,
                         msg: 'success',
                         result:orderTotal
                        })
          }
     })
})
//删除订单
router.get('/delOrder',(req,res,next)=>{
     var userId = req.cookies.userId;
     var orderId = req.query.orderId;
     Users.findOne({userId:userId},(err,userDoc)=>{
          if (err) {
               res.send(err.message);
          }else{
               var delOne ='';
               userDoc.orderList.forEach((item,index)=>{
                    if (item.orderId==orderId) {
                        delOne = item; 
                        userDoc.orderList.splice(index,1);
                    }
               });
               userDoc.save((err,data)=>{
                    if (err) {
                         res.send(err.message)
                    }else{
                         res.send(delOne);
                    }
               })
          }
     })
})

//获取购物车商品数量
router.get('/cartCount',(req,res,next)=>{
     var userId = req.cookies.userId;
     //console.log(userId);
     Users.findOne({userId:userId},(err,userDoc)=>{
          if (err) {
               res.status(500).json({
                         code:1,
                         msg: err.message,
                         result:''
                        })
          }else{
               var cartCount = 0;
               userDoc.cartList.forEach((item)=>{
                   cartCount = item.productNum+cartCount
               });
               res.status(200).json({
                         code:0,
                         msg: 'success',
                         result:cartCount
                        })
          }
     })
})

//注册用户
router.post('/register',function(req,res){
     //console.log(req.body)
     var body = req.body;
     var userId = '';
     userId = '1'+Math.floor(Math.random()*100)+Math.floor(Math.random()*100)+Math.floor(Math.random()*100)+Math.floor(Math.random()*100);
     //console.log(userId);
     body.userId =userId;
     //console.log(body);
    Users.findOne({
     //mongoDB中查询或条件的，有一个条件满足即可查到数据
     $or: [{
        email: body.email
      },
      {
        userName: body.userName
      }
    ]
    },function(err,data){
     //console.log(data)
     if (err) {
          // Express 提供了一个响应方法：json
            // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
          return res.status(500).json({
              code: 500,
              message: 'server is error!',
              result:''
          })
     }
     if (data&&data.email===body.email) {
          return res.status(200).json({
               code: 1,
               message: 'email  already existed!'
          })
     }

     if (data&&data.userName===body.userName) {
          return res.status(200).json({
               code: 2,
               message: 'nickname  already existed!'
          })
     }
     //对密码进行MD5双重加密
     //body.password = md5(md5(body.password))
     //console.log(body.password)
        new Users(body).save(function(err,user){
          if (err) {
               return res.status(500).json({
                   code: 500,
                   message: 'server is error!'   
               })
          }
          res.status(200).json({
          code: 0,
          message: 'register is succed!'
        })
        })
    })
})

//获取用户列表
router.post('/userList',(req,res,next)=>{
      var page = parseInt(req.body.page);
      var pageSize = parseInt(req.body.pageSize);
      var skip = page*pageSize;
     Users.find().skip(skip).limit(pageSize).exec((err,data)=>{
         if (err) {
            return res.status(500).json({
                   code: 500,
                   msg: err.message ,
                   result:''  
               })
         }else{
           res.status(200).json({
                   code: 0,
                   msg: 'success',
                   result:data  
               })
         }
     })
})

//删除用户
router.post('/deleteUser',function(req,res,next){
  var userId = req.body.userId;
  //console.log(111);
  Users.deleteOne({userId:userId},(err,data)=>{
    // console.log(data);
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
module.exports = router;
