!<template>
  <div >
        <el-steps :active="active" finish-status="success">
            <el-step title="确认收货地址"></el-step>
            <el-step title="确认订单"></el-step>
            <el-step title="支付订单"></el-step>
            <el-step title="支付完成"></el-step>
        </el-steps>
  </div>
</template>

<script>
export default {
  name: 'Steps',
  props:{
    active:Number
  },
  data() { 
    return {
       
    }
  }
 }
</script>

<style  scoped>
  
</style>