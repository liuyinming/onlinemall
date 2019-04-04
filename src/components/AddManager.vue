<template>
  <div>
    <div form-wraper>
        <el-form label-position="right" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" :model="ruleForm">
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
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!--添加管理员提示弹窗 -->
                    <el-dialog
                        title="提示"
                        :visible.sync="addDialog"
                        width="30%"
                        center>
                        <slot></slot>
                            <span>{{addTip}}</span>
                            <span slot="footer" class="dialog-footer">                      
                            <el-button type="primary" @click="addDialog=false">确 认</el-button>
                            </span>
                    </el-dialog> 
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AddManager',
  data() { 
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
       ruleForm: {
          email: '',
          managerName: '',
          pass: '',
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        addDialog:false,
        addTip:''
    }
  },
  methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.registerManager();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      registerManager(){
        axios.post('/managers/register',{
                  email:this.ruleForm.email,
                  managerName:this.ruleForm.managerName,
                  password:this.ruleForm.pass
              }).then((res)=>{
                   var ret = res.data;
                if(ret.code==2){
                    this.addDialog = true;
                    this.addTip = "账户名已存在！"
                }else if(ret.code==1){
                    this.addDialog = true;
                    this.addTip = "邮箱已存在！"
                }else if(ret.code==0){
                    this.addDialog = true;
                    this.addTip = "注册成功！";
                    this.resetForm('ruleForm');
                }
              })
      }
  }
 }
</script>

<style lang="stylus"  scoped>
</style>