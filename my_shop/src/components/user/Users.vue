<template>
  <div class="User_list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-input
          clearable
          @clear="getUsers"
          v-model="input"
          placeholder="请输入内容"
          style="width: 30%;"
        >
          <el-button @click="getUsers" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" style class="search_button" @click="addDialogFormVisible = true">添加用户</el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#" width="180"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" style="width: 180px;">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 添加用户弹框 -->
      <el-dialog title="收货地址" :visible.sync="addDialogFormVisible">
        <el-form :model="form">
         <!-- 账号 -->
				<el-form-item prop="username" class="username_input">
					<el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="iconfont icon-user"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
				</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { users_api, usersType_api } from '@/api'
import { log } from 'util'
export default {
  data() {
    return {
      input: '',
      tableData: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
	  total: 0,
	//   添加用户表单
	  userType: {},
	  addDialogFormVisible: false,
        addDialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
		  desc: '',
		  
		},
		formLabelWidth: '120px'
    }
  },
  methods: {
    //获取用户列表函数
    async getUsers() {
      console.log(this.input)
      this.queryInfo.query = this.input
      const { data: res } = await users_api(this.queryInfo)
      // console.log(this.queryInfo);
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error('获取用户数据列表失败')
      this.$message.success('获取用户数据列表成功')
      this.tableData = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val
      this.getUsers()
    },
    async userStateChanged(row) {
      //改变状态函数
      const { data: res } = await usersType_api({
        id: row.id,
        type: row.mg_state
      })
    }
  },
  created() {
    this.getUsers() //调取获取用户列表函数
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  .search_button {
    margin-left: 20px;
    background-color: #409eff;
    border: 0;
  }
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 6px 10px !important;
}
</style>
<style></style>
