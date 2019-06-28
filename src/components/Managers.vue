<template>
  <div class="manager-wraper">
                     <el-row class="first-row">
                        <el-col :span="4"><div>管理账户ID</div></el-col>
                        <el-col :span="4"><div>管理账户邮箱</div></el-col>
                        <el-col :span="4"><div>用户名</div></el-col>
                        <el-col :span="8"><div>密码</div></el-col>
                        <el-col :span="4"><div>操作</div></el-col>
                    </el-row>
                    <el-row class="list-row" v-for="(item,index) in managerList" :key="index">
                        <el-col :span="4" class="one-content">
                            <div class="manager-id">
                                {{item.managerId}}
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.email}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.managerName}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div>{{item.password}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <i class="el-icon-edit" style="cursor:pointer" @click="editManager(item)"></i>
                                <i class="el-icon-delete" @click="confirmDel(item.managerId)" ></i>
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
                    <!--删除管理账户弹窗 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="delDialog"
                        width="30%"
                        center>
                        <slot></slot>
                            <span>确认删除此用户？</span>
                            <span slot="footer" class="dialog-footer">
                            <el-button @click="delDialog = false">取 消</el-button>                        
                            <el-button type="primary" @click="deleteManager">确 认</el-button>
                            </span>
                    </el-dialog> 
                    <!--修改管理账户弹窗 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="editDialog"
                        width="60%"
                        center>
                        <slot>
                            <edit-manager :editManager="oneManager" v-on:changeDialog="changestate"></edit-manager>
                        </slot>
                    </el-dialog> 
    </div>
</template>

<script>
import axios from 'axios';
import EditManager from '@/components/EditManager'
export default {
  name: 'Managers',
  data() { 
    return {
      delDialog:false, 
      pageDialog:false ,
      managerList:[],
      page:0,
      pageSize:5,
      oneManagerId:0,
      editDialog:false,
      oneManager:''
    }
  },
  methods:{
    getManagerlist(){
        //console.log(111)
       axios.post('/managers/managerList',{
           page:this.page,
           pageSize:this.pageSize
       }).then((res)=>{
           var ret = res.data;
           if(ret.code==0){
               this.managerList = ret.result;
           }
       })
    },
    nextPage(){
          this.page++;
          this.getManagerlist();
      },
       prePage(){
           if(this.page>0){
             this.page--;
             this.getManagerlist();
           }else{    
               this.pageDialog = true;
           }
      },
      confirmDel(managerId){
          this.oneManagerId=managerId;
          this.delDialog = true;
      },
      deleteManager(){
          this.delDialog = false;
          //console.log(111)
          axios.post('/managers/deleteManager',{
              managerId:this.oneManagerId
          }).then((res)=>{
              var ret = res.data;
              if(ret.code==0){
                  //alert(22)
                  this.getManagerlist();
              }else{
                  alert("服务器忙，稍后重试！")
              }
          })
      },
      editManager(item){
          this.editDialog = true;
          this.oneManager = item;
         // console.log(item);
      },
      changestate(){
          this.editDialog = false;
          this.getManagerlist();
      }
  },
  mounted(){
      this.getManagerlist();
  },
  components:{
      EditManager
  }
 }
</script>

<style lang="stylus" scoped>
.manager-wraper{
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
            .manager-id{
                float: left;
                height: 80px;
                margin-left :40px;
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