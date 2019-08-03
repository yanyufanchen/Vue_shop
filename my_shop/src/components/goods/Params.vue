
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-button type="success" style class="search_button">添加用户</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      common: ['商品管理', '分类参数'] //公共组件传值
    }
  }
}
</script>
<style lang='scss' scoped>
</style>