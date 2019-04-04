<template>
  <footer class="footer">
           <span class="footer-left">
                <span>Region</span>
                <select class="footer__region__select">
                <option value="en-US">USA</option>
                <option value="zh-CN">China</option>
                </select> 
           </span>
           <span class="footer-right">     
                <span>Copyright © 2019 XingYu Design.</span>
                <a href="#">
                About Us
                </a>
                <a href="#">
                Terms &amp; Conditions
                </a>
                <a href="#">
                Privacy Policy
                </a>
           </span>
  </footer>
</template>

<script>
export default {
    
}
</script>

<style lang="stylus" scoped>
.footer{
    width: 100%;
    height: 80px;
    background: #ccc;
    color: #ada9a5;
    position relative;
    left : 0;
    bottom : -20px;
}
.footer-left{
    position: absolute;
    top:40%;
}
.footer-right{
    position: absolute;
    top:40%;
    right:5%;
    a{
       color: #ada9a5;
    }
}
</style>

