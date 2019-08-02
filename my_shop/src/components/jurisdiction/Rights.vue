<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList" stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
			<!-- {{scope.row}} -->
          <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
          <el-tag v-else-if="scope.row.level == 1" type="success">二级权限</el-tag>
          <el-tag v-if="scope.row.level ==2" type="warning">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { gitRights_api } from '@/api'
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRight() {
      const { data: res } = await gitRights_api('list')
      console.log(res.data)
      this.rightsList=res.data
    }
  },
  created() {
    this.getRight()
  }
}
</script>

<style>
</style>
