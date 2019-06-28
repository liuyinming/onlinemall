<template>
  <div>
      <nav-header></nav-header>
      <el-container>
          <el-header>我的订单</el-header>
          <el-main>
              <steps :active = "active"></steps>
              <div class="pay-wraper">
                  <el-row class="erweima">
                      <el-col :span="8"><img src="./../assets/zhifubao.png"></el-col>
                      <el-col :span="8"><img src="./../assets/weixin.png"></el-col>
                  </el-row>
                  <el-row class="order-msg">
                      <el-col :span="8">订单号：{{orderId}}</el-col>
                      <el-col :span="8">订单金额：{{orderTotal | currency('￥')}}</el-col>
                  </el-row>
                  <el-row class="next-wraper">
                  <!-- <router-link v-bind:to="{path:'/orderPay',query:{'addressId':selectAddressId}}"> -->
                  <router-link v-bind:to="{path:'/orderSuccess',query:{'orderId':orderId}}">
                     <el-button type="success" class="next" >下一步</el-button>
                  </router-link>   
                  <router-link to="/orderConfirm">
                     <el-button type="success" class="previous">上一步</el-button>
                  </router-link>
              </el-row>
              </div>      
          </el-main>
      </el-container>
      <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import Steps from '@/components/Steps.vue'
import {currency} from '@/util/currency.js'
import axios from 'axios';
export default {
  name: 'OrderPay',
  data() { 
    return {
        active:3,
        orderId:'',
        orderTotal:''
    }
  },
  mounted(){
      this.getOrder();
  },
  methods:{ 
      getOrder(){
          this.orderId = this.$route.query.orderId;
          axios.get('/users/orderPay',{
              params:{
                  orderId:this.orderId
              }
          }).then((res)=>{
              var ret = res.data;
              if(ret.code==0){
                  this.orderTotal=ret.result;
              }
          })
      }  
  },
  components:{
      NavHeader,
      NavFooter,
      Steps
  },
  filters:{
      currency:currency
  }
 }
</script>

<style lang='stylus'  scoped>
.el-container{
    .el-header{
        color: #606266;
        text-align: left;
        line-height: 60px;
        height: 50px !importent;
        font-size: 25px;
        letter-spacing: 8px;
        background-color : #FF6666;
    }  
}
.pay-wraper{
    .erweima{
        text-align :center;
        display :flex;
        justify-content :center;
    }
    .order-msg{
        margin-top :20px;
        font-size :20px;
        height :40px;
        line-height :40px;
        color : #F56C6C;
        text-align :center;
        display :flex;
        justify-content :center;
    }
}
.next-wraper{
    background-color :#909399;
    height : 50px;
    width:100%;
    padding: 5px 20px 0 20px;
    .next{
        float:right;
    }
    .previous{
        float:left;
    }
}
</style>