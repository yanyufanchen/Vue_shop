<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <!-- row-key="id" 是2019年3月提供的新特性，
if there's nested data, rowKey is required.
      如果这是一个嵌套的数据，rowkey 是必须添加的属性-->
      <el-table :data="roleList" border>
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 第一级 -->
            <el-row
              v-for="(item1 , index1) in scope.row.children"
              :key="index1"
              :class="['bdbottom',index1==0? 'bdtop':'']"
            >
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="index2" :class="index2==0? 'center' :'bdtop'">
                  <el-col :span="6" >
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18"  >
                    <el-tag type="warning" closable v-for="(item3,index3) in item2.children " :key="index3" class="margin">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
            {{scope.row}}
          </pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights_api } from '@/api'
export default {
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await getRights_api()
      //如果返回状态为异常状态则报错并返回
      // if (res.meta.status !== 200)
      //     return this.$message.error('获取角色列表失败')
      // //如果返回状态正常，将请求的数据保存在data中
      // this.roleList = res.data
      console.log(res.data)
      this.roleList = res.data
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
// .text {
//   font-size: 14px;
// }

// .item {
//   padding: 18px 0;
// }

.box-card {
  width: 100%;
}
.bdbottom {
  padding: 7px;
  border-bottom: 1px solid #eee;
}
.bdtop {
  padding: 7px;
  border-top: 1px solid #eee;
}
.center {
  padding: 7px;
}
.margin {
  margin: 5px;
}
</style>

