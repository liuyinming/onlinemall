<template>
  <div class="wraper">
     <el-container style="height: 100%; border: 1px solid #eee">
        <el-header>商城管理端后台
            <span class="loginout"><i class="el-icon-switch-button" @click="loginout"></i></span>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu >
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-goods"></i>商品管理</template>
                       <el-menu-item index="1-1" @click="findproduct">商品查询</el-menu-item>
                        <el-menu-item index="1-2" @click="addgood">添加商品</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-user"></i>用户管理</template>
                        <el-menu-item index="2-1" @click="getUsers">用户列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>管理员账户</template>
                        <el-menu-item index="3-1" @click="getManagers">管理员列表</el-menu-item>
                        <el-menu-item index="3-2" @click="addmanager">添加管理员账户</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <product v-if="listShow.isProduct"></product>
                <add-product v-if="listShow.isAdd"></add-product>
                <users v-if="listShow.isUser"></users>
                <managers v-if="listShow.isManager"></managers>
                <add-manager v-if="listShow.isAddManager"></add-manager>
            </el-main>
        </el-container>
        <el-footer>星雨设计，只为不平凡的你</el-footer>
    </el-container>
  </div>
</template>

<script>
import Product from '@/components/Product'
import AddProduct from '@/components/AddProduct'
import Users from '@/components/Users'
import Managers from '@/components/Managers'
import AddManager from '@/components/AddManager'
import axios from 'axios';
export default {
  name: 'ManagerHome',
  data() { 
    return {
           listShow: {
              isProduct:false,
              isAdd:false,
              isUser:false,
              isManager:false,
              isAddManager:false
           }
           
    }
  },
  methods:{
    loginout(){
        axios.get('/managers/loginout').then((res)=>{
            var ret = res.data;
            if(ret.code==0){
                this.$router.push({
                    path:'/managerLogin'
                })
            }
        })
    },
    findproduct(){
        // this.listShow.isProduct = true;
        // this.listShow.isAdd = false;
        for( let item in this.listShow){
            if(item=='isProduct'){
                this.listShow[item]=true
            }else{
                this.listShow[item] = false
            }
        }
    },
    addgood(){
        //this.listShow.isProduct = false;
        //this.listShow.isAdd = true;
        for(let item in this.listShow){
            if(item=='isAdd'){
                this.listShow[item]=true
            }else{
                this.listShow[item] = false
            }
        }
    },
    getUsers(){
        for(let item in this.listShow){
            if(item=='isUser'){
                this.listShow[item]=true
            }else{
                this.listShow[item] = false
            }
        }
    },
    getManagers(){
        for(let item in this.listShow){
            if(item=='isManager'){
                this.listShow[item]=true
            }else{
                this.listShow[item] = false
            }
        }
    },
    addmanager(){
        for(let item in this.listShow){
            if(item=='isAddManager'){
                this.listShow[item]=true
            }else{
                this.listShow[item] = false
            }
        }
    }
  },
  components:{
      Product,
      AddProduct,
      Users,
      Managers,
      AddManager
  }
 }
</script>

<style lang="stylus"  scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    font-size:30px;
  }
  .el-footer {
      font-size :20px;
  }
  
  .el-aside {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height : 500px;
    background-image: url(./../assets/0.jpg) ;
    background-size: cover;
    background-repeat:space;
  }
  .loginout{
      float :right;
     cursor:pointer;
     color : #67C23A;
     font-weight : 200px;
     font-size :30px;
  }
</style>