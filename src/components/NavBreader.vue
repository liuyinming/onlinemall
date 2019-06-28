<template>
    <section class="bread">
        <div class="bread-wrap">
            <nav class="options">
                 <ul>
                     <li>小吃美食</li>
                     <li>电子商品</li>
                     <li>洗护用品</li>
                     <li>必备出行</li>
                 </ul>
                <slot></slot>
            </nav>
        </div>
    </section>
</template>

<script>

    export default{
        data(){
            return{
                msg:'hello vue'
            }
        }
    }
</script>

<style>
   .options > ul{
       width: 100%;
       height: 40px;
       margin-top: 0;
       padding-top: 10px;
       list-style: none;
       display: flex;
       flex-flow: row nowrap;
   }
   .options > ul > li{
       color: white;
       border: 1px solid #fff;
       width: 80px;
       height: 40px;
       margin-left:20px; 
       text-align: center;
       line-height: 40px;
       border-radius: 10px;
   }
  .bread{
      position: relative;
      margin-top: 0;
      height: 60px;
      line-height: 60px;
      background-color:#FF6666;
  }
  .bread-wrap{
      padding: 0 10px;
      font-size: 14px;
      color: #a1a1a1;
  }
  .bread-wrap a{
    position: relative;
      margin-right: 20px;
  }
  .bread-wrap a:hover{
    color: #d1434a;
  }
  .bread-wrap a:after{
      position: absolute;
      top: 0px;
      content:'/';
      height:20px;
      line-height: 20px;
  }
  .bread-wrap span{
      color:#d1434a;
  }
</style>

