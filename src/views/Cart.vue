<template>
    <div>
        <nav-header>
        </nav-header>
        <el-container>
            <el-header>我的购物车</el-header>
            <el-main>
                <div class="cart-wrap">
                    <el-row class="first-row">
                        <el-col :span="8"><div>商品信息</div></el-col>
                        <el-col :span="4"><div>单价</div></el-col>
                        <el-col :span="4"><div>数量</div></el-col>
                        <el-col :span="4"><div>金额</div></el-col>
                        <el-col :span="4"><div>操作</div></el-col>
                    </el-row>
                    <el-row class="order-row" v-for="(item,index) in cartList" :key="index">
                        <el-col :span="8" class="one-content">
                            <div class="icon-wrap">
                                <i class="el-icon-circle-check" 
                                   v-bind:class="{'checked':item.checked=='1'}"
                                   @click="editCart('checked',item)"></i>
                            </div>
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
                            <div class="el-input-number">
                                <span role="button" class="el-input-number__decrease" @click="editCart('decrease',item)">
                                    <i class="el-icon-minus"></i>
                                </span>
                                <div class="el-input">
                                    <span class="el-input-inner">{{item.productNum}}</span>
                                </div>
                                <span role="button" class="el-input-number__increase" @click="editCart('increase',item)">
                                    <i class="el-icon-plus"></i>
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="subtotal-price">{{item.productNum*item.salePrice | currency('￥')}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <i class="el-icon-delete" @click="confirm(item)"></i>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="last-row">
                        <el-col :span="8">
                            <div class="last-row-one">
                                <i class="el-icon-circle-check" @click="toggleCheckAll" v-bind:class="{'checked':checkAllFlag==true}"></i>
                                <span @click="toggleCheckAll">全选</span>
                            </div>
                        </el-col>
                        <el-col :span="4" :offset="8"><div class="last-row-two">总计:<span>{{totalPrice | currency('￥')}}</span></div></el-col>
                        <el-col :span="3" :offset="1">
                            <div class="last-row-three" 
                                 v-bind:class="{'discheckout':checkedCount == 0}"
                                 @click="checkOut">结算</div>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>  
          <!--删除购物车商品弹窗 -->
           <el-dialog
              title="提示"
              :visible.sync="delCartDialog"
              width="30%"
              center>
              <slot></slot>
                <span>确认删除此商品？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="delCartDialog = false">取 消</el-button>
                  <router-link to="/cart">
                  <el-button type="primary" @click="delCart">确 认</el-button>
                  </router-link>
                </span>
          </el-dialog> 
          <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import store from '@/store.js'
import {currency} from '@/util/currency.js'
import axios from 'axios';
export default {
    name: 'Cart',
    store,
    data(){
        return{
            cartList: [],
            oneProduct:{},
            delCartDialog:false
        }
    },
    components:{
        NavHeader,
        NavFooter
    },
    filters:{
       currency:currency
    },
    computed:{
        checkAllFlag(){
            return this.checkedCount == this.cartList.length ;
        },
        checkedCount(){
            var i = 0;
            this.cartList.forEach((item) => {
                if(item.checked == '1'){
                    i++
                }
            })
            return i
        },
        totalPrice(){
        	var money = 0;
        	this.cartList.forEach((item)=>{
        		if(item.checked == '1'){
        			money += item.salePrice*item.productNum
        		}
        	});
        	return money;
        }
    },
    mounted(){
        this.getCartList();
    },
    methods:{
        getCartList(){
            axios.get('/users/cartList').then((res) => {
                let ret = res.data;
                if(ret.code === 0){
                    this.cartList = ret.result
                }
            })
        },
        //修改购物车商品的属性
        editCart(flag,item){ 
           if(flag=='increase'){
               item.productNum++;
               store.commit('cartNum',1);
           }else if(flag=='decrease'){
               if(item.productNum<=1){
                   return;
               }
                item.productNum--; 
                store.commit('cartNum',-1);
           }else{
               item.checked = item.checked=='1'?'-1':'1';
           }
           axios.post('/users/editCart',{
               productId:item.productId,
               checked:item.checked,
               productNum:item.productNum
           }).then((res)=>{
               let ret = res.data;
               if(ret.code==0){
                   this.getCartList();
               }else{
                   alert("服务器忙，请稍后重试！");
               }
           })
        },
        confirm(item){
            this.delCartDialog=true;
            this.oneProduct = item;
        },
        //删除购物车的某件商品
        delCart(){
                this.delCartDialog = false;
                axios.post('/users/cartDel',{
                    productId: this.oneProduct.productId
                }).then((res) => {
                    let ret = res.data;
                    if(ret.code == '0'){
                        this.getCartList()
                        var number = -this.oneProduct.productNum;
                        store.commit('cartNum',number);
                    }else{
                        alert("服务器忙，稍后重试！")
                    }
                })
        },
        //选中全部商品
        toggleCheckAll(){
            var flag = !this.checkAllFlag;
            this.cartList.forEach((item, index) => {
                item.checked = flag  ? '1':'-1'
            })
            axios.post('/users/editCheckAll',{
                checkAll:flag
            }).then((result) => {
                let res = result.data;
                if(res.status == '0'){
                    console.log('update suc')
                }
            })
        },
        //购物车结算
        checkOut(){
            if(this.checkedCount > 0){
                this.$router.push({
                    path:'/address'
                })
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.el-container {
    background-color: #E9EEF3;
    .el-header{
        color: #606266;
        text-align: left;
        line-height: 60px;
        height: 50px !importent;
        font-size: 25px;
        letter-spacing: 8px;
        background-color : #FF6666;
    }
    .el-main {
        color: #606266;
        text-align: center;
    }
}

.cart-wrap{
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
            .icon-wrap{
                float: left;
                margin: 0 15px;
                i{
                    font-size: 25px;
                    color: #8a8181;
                    &:hover{
                        color: #ee7a23;
                    }
                }
            }
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
        height: 55px;
        line-height: 55px;
        background-color: white;
        margin-top: 20px;
        border: 1px solid #E9EEF3;
        font-size:16px;
        .last-row-one{
            float: left;
            margin: 0 15px;
            i{
                font-size: 25px;
                color: #8a8181;
                &:hover{
                    color: #ee7a23;
                }
            }
            span{
                margin: 0 15px;
                color: #5f5d5d;
                cursor: pointer;
                &:hover{
                    color: #ee7a23;
                }
            }
        }
        .last-row-two{
            color: #5f5d5d;
            span{
                color: #cb1313;
                margin-left: 15px;
                font-size: 18px;
                font-weight: bold; 
            }
        }
        .last-row-three{
            background: #cb1313;
            color: white;
            cursor: pointer;
        }
        .discheckout{
            background-color: #8a8181
        }
    }
}

.el-input-number{
    position: relative;
    display: inline-block;
    width: 180px;
    line-height: 38px;
    .el-input{
        border: 1px solid #E9EEF3;
    }
}

.el-icon-delete{
    font-size: 25px;
    &:hover{
        color: #ee7a23;
    }
}

.el-footer{
    padding-top: 20px; 
    border-top: 1px solid rgba(51, 51, 51,0.15);
    background-color: #eef1f6;
}

.checked{
    color: #ee7a23 !important;
}

</style>

