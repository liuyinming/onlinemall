<template>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <slot></slot>
          <span>需要注意的是内容是默认不居中的</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false"></el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>
    </div>
</template>
<style>

</style>
<script>
    export default{
        props:["mdShow"],
        data(){
            return{
                msg:'hello vue',
                centerDialogVisible:'true'
            }
        },
        methods:{
          closeModal(){
            this.$emit("close");
          }
        }
    }
</script>
