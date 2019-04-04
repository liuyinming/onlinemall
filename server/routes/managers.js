var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var md5 = require('blueimp-md5');

var Managers = require('../models/managers.js');
/* GET home page. */

//注册管理员
router.post('/register', function(req, res, next) {
  var body = req.body;
  //console.log(req.body);
  var managerId = '';
     managerId = '1'+Math.floor(Math.random()*100)+Math.floor(Math.random()*100)+Math.floor(Math.random()*100)+Math.floor(Math.random()*100);
     //console.log(userId);
     body.managerId = managerId;
     //console.log(body);
    Managers.findOne({
     //mongoDB中查询或条件的，有一个条件满足即可查到数据
     $or: [{
        email: body.email
      },
      {
        managerName: body.managerName
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

     if (data&&data.managerName===body.managerName) {
          return res.status(200).json({
               code: 2,
               message: 'managerName  already existed!'
          })
     }
     //对密码进行MD5双重加密
     body.password = md5(md5(body.password));
     //console.log(body.password)
        new Managers(body).save(function(err,manager){
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
});

router.get('/getcheckcode',(req,res,next)=>{
	//console.log(111);
	var eamilcode = req.query.email;
	//console.log(eamilcode);
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '1126804398@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'vskzhuwdqgfiihhj'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
 var checkCode = parseInt(Math.random()*1000000);
// setup e-mail data with unicode symbols
var mailOptions = {
    from: '1126804398@qq.com', // 发件地址
    //to: '554058182@qq.com', // 收件列表
    to: eamilcode,
    subject: '来自星雨商城的验证码', // 标题
    //text和html两者只支持一种
    text: 'Hello world ?', // 标题
    html: '<b>'+checkCode+'</b>' // html 内容
};
transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

})
res.status(200).json({
	code:0,
	msg:'success',
	result:checkCode
});
})

//登陆
router.post("/login",(req,res,next)=>{
	 //console.log(req.body);
	 var param = req.body;
	 //console.log(param.userPwd);
     Managers.findOne({
     	managerName:param.managerName
     },function(err,data){
     	if (err) {
     		return err.message;
     	}else if (!data) {
     		res.status(200).json({
     			code: 2,
     			message: '用户不存在'
     		})
     	}else{
     		param.password = md5(md5(param.password));
     		if (data.password == param.password) {
                    //console.log(data);
                    res.cookie("managerId",data.managerId,{
                         path:'/',
                         maxAge:1000*60*60*2
                    });
                    res.cookie("managerName",data.managerName,{
                         path:'/',
                         maxAge:1000*60*60*2
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
})

//退出登陆
router.get('/loginout',function(req,res,next){
     res.cookie("managerId",'',{
                    path:'/',
                    maxAge:-1
               });
     res.cookie("managerName",'',{
                    path:'/',
                    maxAge:-1
               });
     res.status(200).json({
          code:0,
          msg:"logout success!"
     })
})

//获取用户列表
router.post('/managerList',(req,res,next)=>{
      var page = parseInt(req.body.page);
      var pageSize = parseInt(req.body.pageSize);
      var skip = page*pageSize;
     Managers.find().skip(skip).limit(pageSize).exec((err,data)=>{
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
router.post('/deleteManager',function(req,res,next){
  var managerId = req.body.managerId;
  //console.log(111);
  Managers.deleteOne({managerId:managerId},(err,data)=>{
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

//修改用户信息
router.post('/edit',(req,res,next)=>{
	var managerId = req.body.managerId;
	var email = req.body.email;
	var managerName = req.body.managerName;
	var password = req.body.password;
	var newpassword = req.body.newpassword;
	// var editManager = {
 //        email : req.body.email,
 //        managerName : req.body.managerName,
	//     newpassword : req.body.newpassword 
	// }
	Managers.findOne({managerId:managerId},(err,managerDoc)=>{
		if (err) {
			res.status(500).json({
                    code:1,
                    msg: err.message,
                    result:''
                  })
		}else{
			password = md5(md5(password));
			if (password == managerDoc.password) {
                  // for(let key in managerDoc){
                  //      managerDoc[key]=editManager[key]
                  // };
                  managerDoc.email=email;
                  managerDoc.managerName=managerName;
                  managerDoc.password = md5(md5(newpassword));
                  managerDoc.save((err,data)=>{
                  	if (err) {
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
			}else{
				res.status(200).json({
                    code:2,
                    msg: "初始密码错误！",
                    result:''
                  })
			}
		}
	})
})
module.exports = router;
