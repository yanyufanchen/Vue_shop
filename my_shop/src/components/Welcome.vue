<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>
        <h3>首页</h3>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 消息提示 -->
    <el-card class="box-card">
      <el-badge :value="12" class="item">
        <el-button size="small">待处理</el-button>
      </el-badge>
      <el-badge :value="3" class="item">
        <el-button size="small">已购买</el-button>
      </el-badge>
      <el-badge :value="1" class="item" type="primary">
        <el-button size="small">待评价</el-button>
      </el-badge>
      <el-badge :value="2" class="item" type="warning">
        <el-button size="small">待回复</el-button>
      </el-badge>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          点我查看
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            评论
            <el-badge class="mark" :value="12" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            回复
            <el-badge class="mark" :value="3" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 日历 -->
      <el-calendar v-model="value"></el-calendar>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date()
    }
  },
  created() {},
  methods: {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>

