<template>
       <div class="head">
       
            <div class="header-right">
              <img src="./../assets/logo.png" class="logo">
              <div class="header-middle">校园二手交易商城</div>
              <div v-if="isLogin" class="iconfont icongouwuche" @click="tocart" ><span class="cart-num">{{cartCount}}</span></div>
              <div @click="login" v-if="!isLogin"><span class="iconfont icondengluzhuce"></span> </div>
              <div  @click="loginOut" v-if="isLogin"><span class="iconfont icontuichudenglu"></span> </div>
              <div v-if="isLogin" class="welcome"><span>{{username}}</span> </div>
              <slot></slot>
        </div>
       </div>
</template>

<script>
import axios from 'axios'
import store from '@/store.js'
export default {
  name: 'NavHeader',
  props:{
  },
  store,
  data () {
    return {
      msg: '',
      username:'',
    }
  },
  computed:{
      cartCount(){
        return store.state.cartCount;
      },
      isLogin(){
        return store.state.statuscode
      }
  },
  methods:{
    tocart(){
      this.$router.push('/cart');
    },
    login() {
      this.$router.push({
        path: '/login'
      })
    },
    loginOut() {
      store.commit('isLogin',0)
      axios.get('/users/logout').then((res)=>{
        if(res.data.code===0){
          console.log(res.data.msg);
        }
      })
    },
     checkLogin(){
           axios.get('users/checkLogin').then((res)=>{
             if(res.data.code===0){
               this.username = res.data.result;
               store.commit('isLogin',1)
              // sessionStorage.setItem('username',res.data.result);
              // this.username = sessionStorage.getItem('username');
              this.getCartCount();
             }
           })
        },
      getCartCount(){
        axios.get('/users/cartCount').then((res)=>{
          var ret = res.data;
          if(ret.code == 0){
            //console.log(111)
            store.commit('init',ret.result);
          }
        })
      }  
  },
  mounted(){
    this.checkLogin();
  },
  // watch: {
  //     username(newusername,oldusername){   
  //       console.log(newusername);
  //          if(!this.username){
  //            this.username='重新登陆！'
  //          }
  //     }
  // }
  // computed:{
  //   tips:function(){
  //     if(this.username==''){
  //       return '请退出重新登录';
  //     }else{
  //       return this.username;
  //     }
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.logo{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 200px;
  height: 80px;
}
.header-middle{
  line-height : 80px;
  font-size : 50px;
  font-family :"楷体";
  color : black;
  position: absolute;
  top: 0px;
  left: 50%;
  -webkit-transform: translate(-50%,0);
}
.header-right{
  font-size: 20px;
  color: #FF4500;
  padding-top: 30px; 
  padding-right: 20px;
  display: flex;
  flex-flow: row-reverse nowrap;
}
.head{
  margin: 0;
  padding: 0;
  position relative;
  height: 80px;
}
.iconfont{
  font-size: 30px
  cursor: pointer;
  margin-right: 20px;
}
.welcome{
  margin-right : 20px;
}
.cart-num{
  color :white;
  font-size :10px;
  height :16px;
  width :16px;
  background-color :red;
  border-radius:8px;
  text-align :center;
  position :absolute;
  top:30px;
  right :40px;
  z-index :99;
}
</style>
