<!--  -->
<template>
  <div>
       <Breadcrumb :value="common"></Breadcrumb>
        <el-card class="box-card">
        </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
        common: ['商品管理', '添加商品'], //公共组件传值
    };
  },

  
}

</script>
<style lang='scss' scoped>
</style>