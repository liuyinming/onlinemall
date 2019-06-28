<template>
  <div>
      <nav-header></nav-header>
      <el-container>
          <el-header>支付成功</el-header>
          <el-main>
              <steps :active = "active"></steps>
              <div class="success-wraper">
                  <el-row class="success">
                      <el-col :span="8"><img src="./../assets/success.png"></el-col>
                  </el-row>
                  <el-row class="tip">
                      <el-col :span="12">您的订单号订单号：{{orderId}}已经支付完成!</el-col>
                  </el-row>
                  <el-row class="autoskip">
                      <el-col :span="8"><span class="second">{{second}}</span>秒后自动跳转至
                          <router-link to="/" class="back">首页</router-link>
                      </el-col>
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
        active:4,
        orderId:'',
        second:8,
        timer:''
    }
  },
  mounted(){
      this.orderId = this.$route.query.orderId;
      this.timer = setInterval(this.autoskip,1000);
  },
  methods:{ 
      autoskip(){
          this.second--;
          if(this.second<1){
              clearInterval(this.timer);
              this.$router.push({
                  path:'/'
              })
          }
      },
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
.success-wraper{
    .success{
        text-align :center;
        display :flex;
        justify-content :center;
    }
    .tip{
        margin-top :20px;
        font-size :20px;
        height :40px;
        line-height :40px;
        text-align :center;
        display :flex;
        justify-content :center;
    }
    .autoskip{
        margin-top :20px;
        font-size :20px;
        height :40px;
        line-height :40px;
        text-align :center;
        display :flex;
        justify-content :center;
        .second{
            color:#F56C6C;
        }
        .back{
            color :#409EFF;
        }
    }
}
</style>