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
        <el-button type="success" style class="search_button" @click="addUser">添加用户</el-button>
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
        <el-table-column prop="address" label="操作" style="width: 200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"></el-button>
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
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" status-icon>
          <!-- 账号 -->
          <el-form-item prop="username" class="username_input">
            <el-input
              v-model="addForm.username"
              placeholder="请输入账号"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="addForm.password"
              placeholder="请输入密码"
              prefix-icon="iconfont icon-3702mima"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item prop="mobile">
            <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false ">取 消</el-button>
          <el-button type="primary" @click="addUserList">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户弹框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" status-icon>
          <!-- 账号 -->
          <el-form-item prop="username" class="username_input">
            <el-input
              v-model="editForm.username"
              placeholder="请输入账号"
              prefix-icon="iconfont icon-user"
              disabled
            ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false ">取 消</el-button>
          <el-button type="primary" @click="editUserList">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  users_api,
  usersType_api,
  addUser_api,
  editUser_api,
  delete_api
} from '@/api'
import { log } from 'util'
export default {
  data() {
    // 表单验证规则1
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      // 返回错误提示
      callback(new Error('请输入合法的邮箱'))
    }
    //验证手机规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回错误提示
      callback(new Error('请输入合法的手机号'))
    }
    return {
      editusersId: '', //编辑的用户id
      addDialogVisible: false,
      editDialogVisible: false,
      input: '',
      tableData: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      userType: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则2
      addFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        //验证邮箱
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        //  验证手机号
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      //编辑表单验证规则2
      editFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        //验证邮箱
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        //  验证手机号
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //获取用户列表函数
    async getUsers() {
      //   console.log(this.input)
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
    },
    addUser() {
      //弹出添加用户表单
      this.addDialogVisible = true
    },
    addDialogClosed() {
      //关闭添加用户表单时清空状态
      // console.log(this);
      this.$refs.addFormRef.resetFields()
    },
    addUserList() {
      this.$refs.addFormRef.validate(async result => {
        // console.log(result);
        if (!result) return this.$message.error('获取用户数据列表失败')
        // console.log(this.addForm);
        const { data: res } = await addUser_api(this.addForm)
        console.log(res)
        //判断如果添加失败，就做提示
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        console.log('添加用户成功')
        //添加成功的提示
        this.$message.success('添加用户成功')
        //关闭对话框
        this.addDialogVisible = false
        //重新请求最新的数据
        this.getUsers()
      })
    },
    editUser(res) {
      //弹出添加用户表单
      //   console.log(res);
      this.editForm = {
        username: res.username,
        email: res.email,
        mobile: res.mobile
      }
      this.editusersId = res.id
      //   console.log(this.editusersId);

      this.editDialogVisible = true
    },
    editDialogClosed() {
      //关闭编辑用户表单时清空状态
      // console.log(this);
      this.$refs.editFormRef.resetFields()
    },
    editUserList() {
      this.$refs.editFormRef.validate(async result => {
        if (!result) return this.$message.error('修改失败')
        const { data: res } = await editUser_api({
          id: this.editusersId,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        // console.log(res);
        //判断如果添加失败，就做提示
        if (res.meta.status !== 200) return this.$message.error('添加用户失败')
        console.log('添加用户成功')
        //添加成功的提示
        this.$message.success('添加用户成功')
        //关闭对话框
        this.editDialogVisible = false
        //重新请求最新的数据
        this.getUsers()
      })
    },
    async open(rest) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult != 'confirm') {
        return this.$message.info('已经取消删除')
      }
	//   console.log(confirmResult) //confirm代表确定
	  const {data:res}=await delete_api(rest.id)
	//   console.log(res);
		 if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        //删除成功的提示
        this.$message.success('删除用户成功')
        //重新请求最新的数据
        this.getUsers()
    }
  },
  //   生命周期钩子函数
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
