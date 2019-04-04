<template>
  <div class="add-wraper">
      <el-form label-position="right" label-width="80px" :model="formLabelAlign">
            <el-form-item label="商品名称">
                <el-input v-model="formLabelAlign.productName"></el-input>
            </el-form-item>
            <el-form-item
                label="商品价格"
                prop="salePrice"
                :rules="[
                { required: true, message: '价格不能为空'},
                { type: 'number', message: '价格必须为数字值'}
                ]"
            >
                <el-input type="age" v-model.number="formLabelAlign.salePrice" autocomplete="off"></el-input>
            </el-form-item>
      </el-form>
      <div class="upload-img">
        <div class="img-wraper">
          <span class="preview" @click="preview" v-show="isPreview">预览</span>
          <img :src="'./../../static/image/'+picUrl" alt="">
        </div>
        <div class="file">
          <input type="file" ref="picture">
        </div>
        <div class="submit">
        <el-button type="primary" @click="submit">提交</el-button>
        </div>
       </div>
       <!--添加商品成功弹窗 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="addDialog"
                        width="30%"
                        center>
                        <slot></slot>
                            <span>添加成功!</span>
                            <span slot="footer" class="dialog-footer">                      
                            <el-button type="primary" @click="addDialog=false">确 认</el-button>
                            </span>
                    </el-dialog> 
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AddProduct',
  data() { 
    return {
       formLabelAlign: {
          productName: '',
          salePrice: '',
          type: ''
        },
        dialogImageUrl: '',
        dialogVisible: false ,
        //picUrl:'./../../static/image/',
        picUrl:'',
        isPreview:true,
        addDialog:false
    }
  },
  methods:{
      submit(){
         this.preview();
         if(this.picUrl==''){
           var timer = setTimeout(this.submit,2000)
         }else{
           this.getproductInfo();
           clearTimeout(timer);
         }
  },
  getproductInfo(){
       axios.post('/goods/saveProduct',{
              productName:this.formLabelAlign.productName,
              salePrice:this.formLabelAlign.salePrice,
              productImage:this.picUrl
            }).then((res)=>{
                var ret = res.data;
                if(ret.code==0){
                    //alert()
                    this.addDialog=true
                }
            })
  },
  preview(){
     //console.log(this.$refs.picture.files[0]);
     if(typeof(this.$refs.picture.files[0])=='undefined'){
       return
     }else{
    var formData = new FormData()
     //创建formdata对象
     formData.append("test", this.$refs.picture.files[0]);
     axios.post('/goods/upload',formData).then((res)=>{
       //alert(11)
       var ret = res.data;
       if(ret.code==0){
         this.picUrl = ret.result; 
         //console.log(this.picUrl) 
         this.isPreview = false;
       }
     })
     }
  }
  },
 }
</script>

<style lang="stylus"  scoped>
 .upload-img{
   position relative;
      .img-wraper{
        height :200px;
        width :200px;
        background-color : #fff
        font-size :20px;
        border : 1px solid #ccc;
        position :absolute;
        top:0;
        left:40%;
        .preview{
          position :absolute;
          top:40%;
          left:40%;
          cursor : pointer;
        }
        img {
          height :200px;
          width :200px;
        }
      }
      .file{
        position absolute;
        top:230px;
        left :40%;
      }
      .submit{
        position :absolute;
        top:280px;
        left:40%;
        button{
          width:200px;
        }
      }
 }
</style>