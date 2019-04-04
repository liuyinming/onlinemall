<template>
  <div>
    <div form-wraper>
        <el-form label-position="right" status-icon  ref="ruleForm" label-width="80px" class="demo-ruleForm" :model="ruleForm">
            <el-form-item
                prop="email"
                label="邮箱"
                :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]"
            >
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="账户名">
                <el-input v-model="ruleForm.managerName"></el-input>
            </el-form-item>
            <el-form-item label="原始密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpass">
                <el-input type="password" v-model="ruleForm.newpass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
                <el-button @click="resetForm('ruleForm')">重置当前信息</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'EditManager',
  props:{
    editManager:Object
  },
  computed:{
  },
  data() { 
    return {
        ruleForm: {
          email: '',
          managerName: "",
          pass: '',
          newpass:''
        },
        addDialog:false,
        addTip:''
    }
  },
  methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editManagerInfo();
            //this.$emit('changeDialog');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      editManagerInfo(){
        axios.post('/managers/edit',{
                  managerId:this.editManager.managerId,
                  email:this.ruleForm.email,
                  managerName:this.ruleForm.managerName,
                  password:this.ruleForm.pass,
                  newpassword:this.ruleForm.newpass
              }).then((res)=>{
                   var ret = res.data;
                if(ret.code==2){
                    alert("初始密码错误！")
                }else if(ret.code==0){
                   this.$emit('changeDialog'); 
                }
              })
      }
  }
 }
</script>

<style lang="stylus"  scoped>
</style>