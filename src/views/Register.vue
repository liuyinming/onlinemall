<template>
    <div class="main">
    <div class="header">
      <a href="/">
        <img src="./../assets/logo.png" alt="">
      </a>
      <h1>用户注册</h1>
    </div>
    <form>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" class="form-control" id="email" name="email" placeholder="Email" autofocus v-model="email">
      </div>
      <div class="form-group">
        <label for="nickname">用户名</label>
        <input type="text" class="form-control" id="userName" name="userName" placeholder="userName" v-model="userName">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Password" v-model="password">
      </div>
      <div class="form-group">
        <label for="password">确认密码</label>
        <input type="password" class="form-control" id="reppassword" name="reppassword" placeholder="repeatPassword" v-model="reppassword">
      </div>
      <div class="checkbox" >
        <label>
          {{tip}}
        </label>
      </div>
      <button type="submit" class="btn btn-success btn-block" @click="register">注册</button>
    </form>
    <div class="message">
      <p>已有账号?<router-link to="/login"> <a href="#">点击登录</a></router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Register',
    data(){
      return{
        tip:'请输入注册账号和密码！',
        email:'',
        userName:'',
        password:'',
        reppassword:''
      }
    },
    methods:{
      register(event){
        event.preventDefault();
        if (this.email=='') {
          this.tip='邮箱不为空！';
          return
        } else if(this.userName=='') {
          this.tip='用户名不为空！';
          return
        }else if(this.password != this.reppassword){
          this.tip='两次密码不一致！';
          return
        }
         axios.post('/users/register',{
           email:this.email,
           userName:this.userName,
           userPwd:this.password
         }).then((res)=>{
           var ret = res.data;
           if(ret.code==0){
             alert('注册成功！');
             this.$router.push({
               path:'/login'
             })
           }else if(ret.code==2){
             this.tip = '用户名已存在！'
           }else if(ret.code==1){
             this.tip = '邮箱已存在！'
           }
         })
      }
    }
}
</script>

<style lang="stylus" scoped>
body {
  background-color: #f9f9f9;
}
.main {
  width: 340px;
  margin: 0 auto;
  margin-top: 50px;
  color: #333;
}

.main .header {
  text-align: center;
}

.main .header h1 {
  font-size: 26px;
}

.main form {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
  background-color: #fff;
}

.main .message {
  padding: 10px;
  padding-bottom: 0;
  border: 1px solid #d8dee2;
  border-radius: 5px;
}
.checkbox{
  color : red;
}

</style>
