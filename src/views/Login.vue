<template>
    <div class="main">
    <div class="header">
      <a href="/">
        <img src="./../assets/logo.png" alt="">
      </a>
      <h1>用户登录</h1>
    </div>
    <form id="login_form">
      <div class="form-group">
        <label for="">用户名</label>
        <input type="text" class="form-control" id="userNam" name="userName" placeholder="userName" autofocus v-model="userName">
      </div>
      <div class="form-group">
        <label for="">密码</label>
        <a class="pull-right" href="">忘记密码？</a>
        <input type="password" class="form-control" id="password" name="password" placeholder="Password" v-model="password">
      </div>
      <div class="checkbox" >
        <label>
          {{tip}}
        </label>
      </div>
      <button type="submit" class="btn btn-success btn-block" @click="toLogin($event)">登录</button>
    </form>
    <div class="message">
      <p>没有账号? <router-link to="/register"><a href="#">点击创建</a></router-link></p>
    </div>
  </div>
</template>

<script>
import store from '@/store.js'
import axios from 'axios'
export default {
   name: 'Login' ,
   store,
   data(){
       return{
         tip:'请输入用户名和密码！',
         userName:'',
         password:'',
         statuscode:0,
       }
   },
   methods : {
       toLogin(event){
           event.preventDefault();
           if(!this.userName||!this.password){
             this.tip='用户名或者密码不能为空！';
             return
           }else{
             this.tip='';
           }
            // let formData = new FormData();
            // formData.append('UserName', this.userName);
            // formData.append('userPwd', this.password);
            // console.log(formData);
            axios.post('/users/login',{
                userName: this.userName,
                userPwd: this.password
            }).then(res=>{
                  //console.log(111);
                  var ret = res.data;
                  if(ret.code == 2){
                   // alert("用户不存在！")
                    this.tip='用户名不存在，请重新输入！';
                  }
                  if(ret.code == 1){
                    //alert("密码错误！")
                    this.tip='密码错误，请重新输入！';
                  }
                  if(ret.code == 0){
                    this.statuscode = 1;
                    this.$router.push({
                      path: '/'
                    });
                    store.commit('isLogin',this.statuscode)
                  }
              })
       }
   }
}
</script>

<style lang="stylus"  scoped>
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
