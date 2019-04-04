<template>
  <div class="product-wraper">
                     <el-row class="first-row">
                        <el-col :span="8"><div>商品信息</div></el-col>
                        <el-col :span="4"><div>商品ID</div></el-col>
                        <el-col :span="4"><div>商品名称</div></el-col>
                        <el-col :span="4"><div>单价</div></el-col>
                        <el-col :span="4"><div>操作</div></el-col>
                    </el-row>
                    <el-row class="list-row" v-for="(item,index) in productList" :key="index">
                        <el-col :span="8" class="one-content">
                            <div class="pic-wrap">
                                <img v-bind:src="'./../../static/image/' + item.productImage">
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.productId}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.productName}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.salePrice | currency('￥')}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <i class="el-icon-delete" @click="confirmDel(item.productId)"></i>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="page-row">
                        <el-col :span="4" ><i class="el-icon-arrow-left" @click="prePage"></i></el-col>
                        <el-col :span="4" ><i class="el-icon-arrow-right" @click="nextPage"></i></el-col>
                    </el-row>
                    <el-dialog
                        title="提示"
                        :visible.sync="pageDialog"
                        width="30%"
                        >
                        <span>当前已经是首页！</span>
                    </el-dialog>
                    <!--删除商品弹窗 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="delDialog"
                        width="30%"
                        center>
                        <slot></slot>
                            <span>确认删除此商品？</span>
                            <span slot="footer" class="dialog-footer">
                            <el-button @click="delDialog = false">取 消</el-button>                        
                            <el-button type="primary" @click="deleteProduct">确 认</el-button>
                            </span>
                    </el-dialog> 
    </div>
</template>

<script>
import axios from 'axios';
import {currency} from '@/util/currency.js'
export default {
  name: 'Product',
  data() { 
    return {
         productList:'',
         page: 0,
         pageSize:5,
         sort:1,
         priceChecked:'all',
         pageDialog:false,
         delDialog:false,
         oneProdectId:''
    }
  },
  mounted(){
      this.getProductList()
  },
  filters:{
      currency:currency
  },
  methods:{
      getProductList(){
           let  param={
             page:this.page,
             pageSize:this.pageSize,
             sort:this.sort,
             priceChecked : this.priceChecked
          }
        axios.get('/goods/list',{
            params:param
        }) .then((res)=>{
            var data = res.data;
            if(data.ret==1){
               this.productList = data.data;
            }
        })
      },
      nextPage(){
          this.page++;
          this.getProductList();
      },
       prePage(){
           if(this.page>0){
             this.page--;
             this.getProductList();
           }else{    
               this.pageDialog = true;
           }
      },
      confirmDel(productId){
          this.oneProdectId=productId;
          this.delDialog = true;
      },
      deleteProduct(){
          this.delDialog = false;
          //console.log(111)
          axios.post('/goods/delProduct',{
              productId:this.oneProdectId
          }).then((res)=>{
              var ret = res.data;
              if(ret.code==0){
                  //alert(22)
                  this.getProductList();
              }else{
                  alert("服务器忙，稍后重试！")
              }
          })
      }
  }
 }
</script>

<style lang="stylus" scoped>
 .product-wraper{
      .first-row{
        background: #6a7584;
        font-size: 16px;
        color: white;
        letter-spacing: 5px;
        height: 45px;
        line-height: 45px;
    }
    .list-row{
        text-align :center
        height: 80px;
        line-height: 80px;
        background-color: white;
        border-bottom: 1px solid #E9EEF3;
        font-size: 20px;
        .one-content{
            .pic-wrap{
                float: left;
                height: 80px;
                margin-left :120px;
                img{
                    height: 80px;
                    width: 80px;
                }
            }
        }
    } 
    .page-row{

        font-size :30px;
        font-weight: 1900;
        color :#409EFF;
        display :flex;
        justify-content: center;
    }   
}
</style>