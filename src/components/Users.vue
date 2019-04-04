<template>
  <div class="user-wraper">
                     <el-row class="first-row">
                        <el-col :span="4"><div>用户ID</div></el-col>
                        <el-col :span="8"><div>用户邮箱账号</div></el-col>
                        <el-col :span="4"><div>用户名</div></el-col>
                        <el-col :span="4"><div>密码</div></el-col>
                        <el-col :span="4"><div>操作</div></el-col>
                    </el-row>
                    <el-row class="list-row" v-for="(item,index) in userList" :key="index">
                        <el-col :span="4" class="one-content">
                            <div class="user-id">
                                {{item.userId}}
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div>{{item.email}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.userName}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>{{item.userPwd}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <i class="el-icon-delete" @click="confirmDel(item.userId)" ></i>
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
                            <span>确认删除此用户？</span>
                            <span slot="footer" class="dialog-footer">
                            <el-button @click="delDialog = false">取 消</el-button>                        
                            <el-button type="primary" @click="deleteUser">确 认</el-button>
                            </span>
                    </el-dialog> 
    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Users',
  data() { 
    return {
      delDialog:false, 
      pageDialog:false ,
      userList:[],
      page:0,
      pageSize:5,
      oneUserId:0,
    }
  },
  methods:{
    getUserlist(){
        //console.log(111)
       axios.post('/users/userList',{
           page:this.page,
           pageSize:this.pageSize
       }).then((res)=>{
           var ret = res.data;
           if(ret.code==0){
               this.userList = ret.result;
           }
       })
    },
    nextPage(){
          this.page++;
          this.getUserlist();
      },
       prePage(){
           if(this.page>0){
             this.page--;
             this.getUserlist();
           }else{    
               this.pageDialog = true;
           }
      },
      confirmDel(userId){
          this.oneUserId=userId;
          this.delDialog = true;
      },
      deleteUser(){
          this.delDialog = false;
          //console.log(111)
          axios.post('/users/deleteUser',{
              userId:this.oneUserId
          }).then((res)=>{
              var ret = res.data;
              if(ret.code==0){
                  //alert(22)
                  this.getUserlist();
              }else{
                  alert("服务器忙，稍后重试！")
              }
          })
      }
  },
  mounted(){
      this.getUserlist();
  }
 }
</script>

<style lang="stylus" scoped>
.user-wraper{
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
            .user-id{
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