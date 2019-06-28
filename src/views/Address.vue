<template>
    <div>
        <nav-header></nav-header>
        <el-container>
            <el-header>我的收货地址</el-header>
            <el-main>
             <steps :active = "active"></steps>
              <div class="address-wraper">
                  <el-card class="box-card" 
                   v-for="(item,index) in addressListFilter" :key="index">
                     <div class="crad-name">收件人：{{item.userName}}</div>
                     <div class="crad-address">收货地址：{{item.streetName}}</div>
                     <div class="crad-postcode">邮编：{{item.postCode}}</div>
                     <div class="crad-tel">联系电话：{{item.tel}}</div>
                     <div class="checked">
                        <span><i class="el-icon-star-on" @click="setDefalutAddress(item.addressId)"
                         :class="{'default':item.isDefault}"></i></span>
                        <span class="icon-delete"><i class="el-icon-delete"  @click="delConfirm(item.addressId)"></i> </span>
                     </div>
                  </el-card>
                  <el-card class="box-card">
                    <div class="add-address">
                        <i class="el-icon-plus"  @click="addAddressDialog = true"></i>
                        <div>添加新地址</div>
                     </div>
                  </el-card>
              </div>
              <el-row class="loadmore">
                      加载更多<i class="el-icon-arrow-down"  @click="loadmore" v-if="isloadmore"></i>
                              <i class="el-icon-arrow-up"  @click="loadless" v-if="!isloadmore"></i>
              </el-row>
              <!--下一步 -->
              <el-row class="next-wraper">
                  <router-link v-bind:to="{path:'/orderConfirm',query:{'addressId':selectAddressId}}">
                  <el-button type="success" class="next">下一步</el-button>
                  </router-link>
              </el-row>
            </el-main>
        </el-container>
        <!--删除地址弹窗 -->
           <el-dialog
              title="提示"
              :visible.sync="delAddressDialog"
              width="30%"
              center>
                <span>确认删除此地址？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="delAddressDialog = false">取 消</el-button>
                  <el-button type="primary" @click="delAddress">确 认</el-button>
                </span>
          </el-dialog> 
                <!--添加收货地址弹窗 -->
            <el-dialog
              title="添加收货地址"
              :visible.sync="addAddressDialog"
              width="60%"
              center>
                 <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="收货人">
                        <el-input v-model="formLabelAlign.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址">
                        <el-input v-model="formLabelAlign.streetName"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="邮编"
                        prop="postCode"
                        :rules="[
                        { required: true, message: '邮编不能为空'},
                        { type: 'number', message: '邮编必须为数字值'}
                        ]"
                    >
                        <el-input type="postCode" v-model.number="formLabelAlign.postCode" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="电话"
                        prop="tel"
                        :rules="[
                        { required: true, message: '电话不能为空'},
                        { type: 'number', message: '电话必须为数字值'}
                        ]"
                    >
                        <el-input type="tel" v-model.number="formLabelAlign.tel" autocomplete="off"></el-input>
                    </el-form-item>
                 </el-form>
                 <span slot="footer" class="dialog-footer">
                  <el-button @click="addAddressDialog = false">取 消</el-button>
                  <el-button type="primary" @click="addAddress" >确 认</el-button>
                 </span>
            </el-dialog>
             
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import Steps from '@/components/Steps.vue'
import axios from 'axios';
export default {
  name:'Address',
  data(){
      return{
          active:1,
          delAddressDialog:false,
          addressList:[],
          limit: 3,
          isloadmore:true,
          addAddressDialog:false,
          labelPosition: 'right',
         formLabelAlign: {
          userName: '',
          streetName: '',
          postCode: '',
          tel:''
        },
          addressId:'',
          selectAddressId:''
      }
  },
  computed:{
     addressListFilter(){
        return this.addressList.slice(0,this.limit);
     }
  },
  methods:{
      loadmore(){
         this.isloadmore = false;
         this.limit = this.addressList.length;
      },
      loadless(){
         this.isloadmore = true;
         this.limit = 3;
      },
      addAddress(){
          this.addAddressDialog=false;
          let adrId = parseInt(Math.random()*1000)*1000+parseInt(Math.random()*1000);
          //console.log(adrId);
          axios.post('/users/addAddress',{
              addressId : adrId,
              userName: this.formLabelAlign.userName,
              streetName:this.formLabelAlign.streetName,
              postCode:this.formLabelAlign.postCode,
              tel:this.formLabelAlign.tel,
              isDefault : false
          }).then((res)=>{
              var ret = res.data;
              if(ret.code==0){
                  alert("添加成功");
                  this.getAddressList();
              }
          })
      },
     delAddress(){
         this.delAddressDialog = false;
         axios.post('/users/delAddress',{
             addressId: this.addressId
         }).then((res)=>{
             var ret = res.data;
             if(ret.code==0){
                 this.getAddressList();
                 //alert(111)
             }else{
                 alert("删除失败，稍后重试！")
             }
         })
     },
     delConfirm(addressId){
          this.delAddressDialog = true;
          this.addressId = addressId;
     },
     setDefalutAddress(addressId){
        axios.post('/users/setDefalutAddress',{
            addressId:addressId
        }).then((res)=>{
            var ret = res.data;
            if(ret.code==0){
                //alert("success")
                this.getAddressList();
            }
        })
     },
     getAddressList(){
         axios.get('/users/addressList').then((res)=>{
             var ret = res.data;
             if(ret.code==0){
                this.addressList = ret.result;
                //确认被选中的addressId,像一个页面传入addressId
                this.addressList.forEach((item)=>{
                    if(item.isDefault){
                       this.selectAddressId = item.addressId;
                    }
                })
             }
         })
     }
  },
  mounted(){
     this.getAddressList() ;
  },
  components:{
      NavHeader,
      NavFooter,
      Steps
  }  
}
</script>

<style lang="stylus" scoped>
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
.address-wraper{
    display :flex;
    flex-flow :row wrap;
}
.box-card{
    position relative;
    width :280px;
    height :200px;
    margin-right :20px;
    margin-top :20px;
}
.checked{
    font-size :24px;
    position : absolute;
    bottom :0;
    .icon-delete{
        position:relative;
        left :180px;
        color :#F56C6C;
    }
    .default{
        color :#F56C6C;
    }
}
.add-address{
    text-align :center;
    margin-top:40px;
    .el-icon-plus{
        font-size 50px;
        color :#409EFF;
    }
}
.loadmore{
    text-align :center;
    color :#67C23A;
    margin-top : 10px;
}
.next-wraper{
    background-color :#909399;
    height : 50px;
    width:100%;
    padding: 5px 20px 0 0;
    .next{
        float:right;
    }
}
</style>


