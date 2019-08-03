<template>
   <el-breadcrumb separator=">">
   <!--  -->
      <el-breadcrumb-item :to="{ path: '/' }" @click.native="toHome" >首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{value[0]}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{value[1]}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
           
<script>
export default{
      props:["value"],
       data(){
          return{
             activePath:''
          }
       } ,
      methods: {
         toHome(){
            window.sessionStorage.setItem('activePath', this.activePath)
            // console.log(111);
            window.location.reload()
            
         }
      },
      mounted() {
         // eventHub
      },
}
</script>
<style scoped>
            
</style>