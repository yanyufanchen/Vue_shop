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
      <!-- row-key="id" 是2019年3月提供的新特性，if there's nested data, rowKey is required.如果这是一个嵌套的数据，rowkey 是必须添加的属性-->
      <el-table :data="roleList" border>
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 第一级 -->
            <el-row
              v-for="(item1 , index1) in scope.row.children"
              :key="index1"
              row-key="id"
              :class="['bdbottom',index1==0? 'bdtop':'']"
            >
              <el-col :span="5">
                <el-tag 
				@close="deleteRoles(scope.row,item1.id)"
				closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二级 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="index2"
                  :class="index2==0? 'center' :'bdtop'"
                >
                  <el-col :span="6">
                    <el-tag 
					@close="deleteRoles(scope.row,item2.id)" 
					type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三级 -->
                  <el-col :span="18">
                    <el-tag
                      @close="deleteRoles(scope.row,item3.id)"
                      type="warning"
                      closable
                      v-for="(item3,index3) in item2.children "
                      :key="index3"
                      class="margin"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
            {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              @click="showSetRightDialog(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加权限分配弹框 -->
      <el-dialog title="权限分配" :visible.sync="rightsDialogVisible" width="50%" >
        <!-- 树形结构 -->
        <el-tree 
		default-expand-all 
		:data="dataList" 
		:props="defaultProps" 
		show-checkbox 
		node-key="id"
		:default-checked-keys="difKeys"
		ref="treeRef"
		>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false" >取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRoles_api, deleteRoles_api, gitRights_api, amendRolesRights_api } from '@/api'
export default {
data() {
    return {
      roleList: [],
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
	  },
	  rightsDialogVisible:false,
	  difKeys:[],
	  rolesId:''  //当前角色id
    }
},
methods: {
    async getRolesList() {
      //获取角色列表
      const { data: res } = await getRoles_api()
      //如果返回状态为异常状态则报错并返回
      // if (res.meta.status !== 200)
      //     return this.$message.error('获取角色列表失败')
      // //如果返回状态正常，将请求的数据保存在data中
      // this.roleList = res.data
      //   console.log(res.data)
      this.roleList = res.data
    },
    async deleteRoles(role, rightsId) { //删除权限
        // 弹框提示用户是否要删除
        const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await deleteRoles_api({
        rolesId: role.id,
        rightsId: rightsId
      })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },
    async showSetRightDialog(role) {  //展示权限
		  this.difKeys=[]
		//   console.log(role.id);
		this.rolesId=role.id
        //分配权限
        // console.log(role);
        // 获取到role 当前角色信息
        // 请求后台 获取所有权限tree
        const { data: res } = await gitRights_api('tree')
	    // console.log(res.data);
	    this.dataList=res.data
	    // 然后将所有的权限可视化渲染
	    this.getDefKey(role,this.difKeys)
		  // console.log(this.difKeys);
		  this.rightsDialogVisible=true
        // 通过递归将当前角色的信息显示在结构中
	},
	getDefKey(node,arr){    //递归遍历当前角色所有的权限id
		if(!node.children){
			return arr.push(node.id)
		}
		node.children.forEach(item => {
			this.getDefKey(item,arr)
		});
	},
    async allotRights(){
		// console.log(this.$refs.treeRef.getCheckedKeys());
		// console.log(this.$refs.treeRef.getHalfCheckedKeys());
		// 获取选中后的所有权限
		const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
		// console.log(keys);
		// 将权限数组转化为字符串
		const isStr=keys.join(',')  
		// console.log(isStr);
		// console.log(this.rolesId);
		const {data:res}=await amendRolesRights_api(this.rolesId,isStr)
		// console.log(res);
	}
},
created() {
    this.getRolesList()
	}
}
</script>

<style lang="less" scoped>
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

