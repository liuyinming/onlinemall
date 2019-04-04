<template>
  <div class="wraper">
      <div class="login-box">
            <h1>星雨商城系统后台登录</h1>
            <form>
                <div class="input-warper">
                    <el-row :gutter="20">
                        <el-col :span="6"><div class="tips">邮箱：</div></el-col>
                        <el-col :span="18"><el-input v-model="email" size="medium" placeholder="请输入邮箱"></el-input></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6" ><div class="tips">用户名：</div></el-col>
                        <el-col :span="18"><el-input v-model="managerName" size="medium" placeholder="请输入用户名"></el-input></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6"><div class="tips">密码：</div></el-col>
                        <el-col :span="18"><el-input v-model="password" size="medium" show-password placeholder="请输入密码"></el-input></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6"><div class="tips">验证码：</div></el-col>
                        <el-col :span="10"><el-input v-model="checkcode" size="medium" placeholder="请输入验证码"></el-input></el-col>
                        <el-col :span="8"><el-button type="info" size="medium" @click="getCode">{{getCheck}}</el-button></el-col>
                    </el-row>
                    <el-row :gutter="20" v-show="isTip">
                        <el-col :span="18"><div class="check-tip">{{checktip}}</div></el-col>
                    </el-row>
                </div>    
                <div class="login">
                    <button @click="managerRgister(false)">登陆</button>
                </div>
            </form>
        </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'ManagerLogin',
  data() { 
    return {
      email:'',
      managerName:'',
      password:'',
      checkcode:'',
      getedCode:'',
      getCheck:"获取验证码",
      time:'',
      isdiabled:true,
      checktip:'请查看邮箱获取验证码！',
      isTip:false,
     // allowabled:false
    }
  },
  mounted(){
       
  },
  methods:{
      getCode(){
          if(this.getCheck=='获取验证码'){
              this.isTip = true;
              this.getCheck = 60;
              this.timer = setInterval(this.decrease,1000);
              axios.get('/managers/getcheckcode?email='+this.email).then((res)=>{
                  var ret = res.data;
                  if(ret.code==0){
                      this.getedCode = ret.result;
                    //   if(getedCode==this.checkcode){
                    //       console.log(333);
                    //     this.allowabled = true;
                    //   }else{
                    //       this.checktip='验证码输入错误！'
                    //   }
                  }
              })        
          } 
      },
      decrease(){
          this.getCheck--
          if(this.getCheck<1){
              clearInterval(this.timer);
              this.getCheck ='获取验证码';
          }
      },
      managerRgister(flag){
            if(this.getedCode==this.checkcode){
                    flag = true;
                }else{
                    this.checktip='验证码输入错误！'
                }
          if(flag){
              //alert(111);
              //this.allowabled=false;
              axios.post('/managers/login',{
                  email:this.email,
                  managerName:this.managerName,
                  password:this.password
              }).then((res)=>{
                var ret = res.data;
                if(ret.code==2){
                    this.checktip ='用户不存在！'
                }else if(ret.code==1){
                    this.checktip ='密码错误！'
                }else if(ret.code==0){
                    //this.checktip ='登陆成功！'
                    this.$router.push({
                        path:'/managerHome'
                    })
                }
              })
          }else{
              this.checktip = '请先输入正确的验证码！'
          }
      }
  }
 }
</script>

<style lang='stylus'  scoped>
.wraper{
    position :fixed;
    top:0;
    width :100%;
    height :100%;
     background-image: url(./../assets/0.jpg) ;
     background-size: cover;
     background-repeat:space;
}
 h1{
     font-size:30px;
     font-weight:700;
     color : white;
     text-shadow:0 1px 4px rgba(0,0,0,.2)
 }
.login-box{
    width:410px;
    border: 1px solid white;
    margin:120px auto 0 auto;
    text-align:center;
    padding:30px;
    border-radius:10px;
    background-color :	#808080;
    }
    .el-row {
    margin-bottom: 20px;
  }
  .tips{
      line-height :34px;
      height :34px;
  }
  .check-tip{
     line-height :34px;
      height :34px;
      color :#F56C6C;
  }
 .login{
     button{
         cursor:pointer;
         width:100%;height:44px;
         padding:0;
         background:#ef4300;
         border:1px solid #ff730e;
         border-radius:6px;
         font-weight:700;
         color:#fff;
         font-size:24px;
         letter-spacing:15px;
         text-shadow:0 1px 2px rgba(0,0,0,.1)}
 }
</style>