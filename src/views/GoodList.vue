<template>
    <div class="wrapper">
        <nav-header>
        </nav-header>
      <nav-breader>
      </nav-breader>
      <!-- 价格排序 -->
      <div class="main">
        <div class="price-sort">
          sort by:
          <span class="price-default">    default    </span>
          <span class="price" @click="pricesort">price<span class="iconfont iconicon_jiantoux" v-show="isjiantou"></span>
          <span class="iconfont iconxiajiantou" v-show="!isjiantou"></span>
          </span>
        </div>
        <!-- filter -->
        <div class="filter" id="filter">
          <dl class="filter-price">
            <dt>PRICE:</dt>
            <dd><a href="javascript:void(0)" class="orgin" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
            <dd v-for="(item,index) in priceFilter" :key="index">
              <a href="javascript:void(0)" class="orgin" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
          </dl>
        </div>
        <!-- search result accessories list -->
              <div class="list-wraper">
                  <ul>
                    <li v-for="(item,index) in goodList" :key="index">
                      <div class="list-content">
                          <div><a href="#"><img v-lazy="'./../../static/image/'+item.productImage" alt=""></a></div>
                          <div class="name">{{item.productName}}</div>
                          <div class="price">{{item.salePrice}}￥</div>
                          <a href="javascript:;" class="cart"  @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </li>
                  </ul>
                <div 
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20"
                    style="text-align: center; margin-bottom: 5px;">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
                <!-- <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  加载中...
                </div> -->
              </div>
          </div>
           <!-- 购物车弹窗 -->
           <el-dialog
              title="提示"
              :visible.sync="centerDialogVisible"
              width="30%"
              center>
              <slot></slot>
                <span>添加购物车成功！</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="centerDialogVisible = false">继续添加</el-button>
                  <router-link to="/cart">
                  <el-button type="primary" @click="centerDialogVisible = false">前往购物车</el-button>
                  </router-link>
                </span>
          </el-dialog>
          <!-- 登陆拦截弹窗 -->
          <el-dialog
            title="提示"
            :visible.sync="longinTip"
            width="30%"
            center>
            <span>当前您尚未登陆！</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="longinTip = false">确 定</el-button>
            </span>
          </el-dialog>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
// import Page from '../assets/js/myPagination'
import NavHeader from '@/components/NavHeader'
import NavBreader from '@/components/NavBreader'
import NavFooter from '@/components/NavFooter'
import Modal from '@/components/Modal'
import axios from 'axios'
import store from '@/store.js'
import BScroll from 'better-scroll'
export default {
  name: 'GoodList',
  store,
  data () {
    return {
      isjiantou:true,
      loading:true,
      busy:true,
      page: 0,
      pageSize:8,
      sort:1,
      longinTip:false,
      priceChecked:'all',
      goodList:[],
      centerDialogVisible:false,
      priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
    }
  },
  methods: {
    pricesort(){
      this.isjiantou=!this.isjiantou;
      this.sort = this.isjiantou? 1:-1;
      this.page = 0 ;
      this.loading=true;
      this.goodList=[];
      this.getGoodsInfo();
    },
     setPriceFilter(index){
              this.priceChecked = index;
              this.page = 0;
              this.loading = false;
              this.getGoodsInfo();
      },
       getGoodsInfo(flag){
         let param = {
           page:this.page,
           pageSize : this.pageSize,
           sort : this.sort,
           priceChecked : this.priceChecked
         }
        axios.get('/goods/list',{
          params : param
        }).then((res)=>{
            res=res.data;
            if (res.ret){
                if(flag){
                  this.goodList = this.goodList.concat(res.data);
                  if(res.data.length===0){
                    this.busy = true;
                  }else{
                    if(res.data.length<=7){
                      this.loading = false;
                    }
                   this.busy = false;
                  }
                }else{
                  const data=res.data;
                  this.goodList=data;
                  this.busy = false;
                } 
               // console.log(this.goodList);
            }
        })
        },
        loadMore(){
              this.busy = true;
               setTimeout(() => {
                this.page++;
                this.getGoodsInfo(true);
              }, 1000);
        },
        addCart(productId){
          axios.post('goods/addcart',{
              productId: productId
          }).then((res)=>{
            if(res.data.code==0){
              //alert("添加成功！")
              this.centerDialogVisible=true;
              store.commit('cartNum',1)
            }else if(res.data.code==3){
              //alert(res.data.msg);
              this.longinTip = true;
            }else{
              alert("服务器忙稍后重试！")
            };
          })
        },
  },
  mounted(){
    this.getGoodsInfo();
  },
  components: {
    NavHeader,
    NavBreader,
    NavFooter,
    Modal
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus"  scoped>
body{
  overflow-x :hidden;
  background : #ccc;
}
.main{
  position relative;
}
.wrapper{
  margin: 0;
  padding 0;
  position: relative;
  .icondengluzhuce{
    cursor :pointer;
  }
}
.filter{
  position :absolute;
  top:10%;
  left:5%;
  .filter-price{
    line-height :40px;
  }
}
.orgin{
  color black;
}

.cur{
   color: #d1434a;
   padding-left:20px;
   border-left : 2px solid #d1434a;
   transition-duration :0.3s;
   transition-timing-function :linear;
}

.iconfont{
  padding-right: 40px;
}

.price-sort{
  padding-top :20px;
  font-size:20px;
  display :flex;
  flex-flow :row nowrap;
  position :relative;
  left : 80%;
}
.price-default{
  padding-right :2px;
  color : #d1434a;
  white-space :pre;
}
.price:hover{
  color : #d1434a;
  cursor pointer ;
}
.list-wraper{
  width :100%;
  position :relative;
  top:5%;
  left:15%;
  ul{
    display :flex;
    flex-flow :row wrap;
    text-align :center;
    margin-right :20px;
    width:80%;
    li{
      width:25%;
    }
  }
  .list-content{
  img{
    width:250px;
    height :250px;
  }
  }
  li{
    list-style :none;
  }
  li:hover{
    border : 2px solid #FF4500;
    background-color :white;
  }
}
.cart{
  display : block;
  height :40px;
  width:100px;
  border-radius : 5px;
  margin :0 0 20px 31%; 
  padding-top: 5px;
  text-decoration:none;
}
.cart:hover{
  border : 2px solid #FF4500;
  background-color : #FFA07A;
}
</style>
