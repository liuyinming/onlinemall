<template>
  <div>
      <nav-header></nav-header>
      <el-container>
          <el-header>在线支付</el-header>
          <el-main>
              <steps :active = "active"></steps>
              <div class="order-wraper">
                  <el-row class="first-row">
                        <el-col :span="8"><div>商品信息</div></el-col>
                        <el-col :span="4"><div>单价</div></el-col>
                        <el-col :span="4"><div>数量</div></el-col>
                        <el-col :span="4"><div>金额</div></el-col>
                    </el-row>
                    <el-row class="order-row" v-for="(item,index) in orderList" :key="index">
                        <el-col :span="8" class="one-content">
                            <div class="pic-wrap">
                                <img v-bind:src="'./../../static/image/' + item.productImage">
                            </div>
                            <div class="name-wrap">
                                {{item.productName}}
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.salePrice | currency('￥')}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <span>{{item.productNum}}</span>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="subtotal-price">{{item.productNum*item.salePrice | currency('￥')}}</div>
                        </el-col>
                    </el-row>
                    <el-row class="last-row">
                        <ul>
                            <li><span >运费：{{transportExpense | currency('￥')}}</span></li>
                            <li><span>折扣：{{discount | currency('￥')}}</span></li>
                            <li><span>总价：{{totalPrice | currency('￥')}}</span></li>
                        </ul>
                    </el-row>
                    <!--下一步 -->
              <el-row class="next-wraper">
                  <!-- <router-link v-bind:to="{path:'/orderPay',query:{'addressId':selectAddressId}}"> -->
                     <el-button type="success" class="next" @click="payMent">下一步</el-button>
                  <router-link to="/address">
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
  name: 'OrderConfirm',
  data() { 
    return {
        orderList:[],
        transportExpense:50,
        discount: 0,
        totalPrice:0,
        active:2
    }
  },
  mounted(){
     this.getOrderList();
  },
  methods:{
      getOrderList(){
          axios.get('/users/cartList').then((res) => {
                let ret = res.data;
                if(ret.code === 0){
                     ret.result.forEach((item)=>{
                         if(item.checked==1){
                             this.orderList.push(item);
                               this.totalPrice=this.totalPrice+item.productNum*parseFloat(item.salePrice);
                         }
                     });
                     this.totalPrice = this.totalPrice+this.transportExpense-this.discount;
                }
            })
      },
      payMent(){
          var addressId = this.$route.query.addressId
          axios.post('/users/payment',{
              addressId:addressId,
              totalPrice:this.totalPrice
          }).then((res)=>{
              var ret  = res.data;
              if(ret.code == 0){
                  //alert(11)
                  this.$router.push({path:'/orderPay?orderId='+ret.result});
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
.order-wraper{
    .first-row{
        background: #6a7584;
        font-size: 16px;
        color: white;
        letter-spacing: 5px;
        height: 45px;
        line-height: 45px;
    }
    .order-row{
        height: 140px;
        line-height: 140px;
        background-color: white;
        border-bottom: 1px solid #E9EEF3;
        font-size: 20px;
        .one-content{
            .pic-wrap{
                float: left;
                height: 100px;
                margin: 19px 15px 15px 80px;
                img{
                    height: 100%;
                    width: 80%;
                    margin-bottom :40px;
                }
            }
            .name-wrap{
               float: left;
               font-weight: bold;
            }
        }
        .subtotal-price{
            color: #cb1313;
        }
    }
    .last-row{
        font-size : 20px;
        color :#F56C6C;
        ul{
            width :100%;
            list-style :none;
            text-align :right;    
        }
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