
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-button type="success" style class="search_button">添加分类</el-button>
      </div>
      <tree-table
        index-text="#"
        :data="cateList"
        :columns="columns"
        :stripe="props.stripe"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="props.showRowHover"
        :show-index="props.showIndex"
        :tree-type="props.treeType"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :selection-type="props.selectionType"
      >
        <!-- 自定义列‘是否有效’ -->
        <template slot="valid" scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="color:#85ce61;font-size:16px"
          ></i>
          <i v-else class="el-icon-error" style="color:red;font-size:16px"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </tree-table>
      <!-- //分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getCategoriesList_api } from '@/api'
export default {
  data() {
    return {
      common: ['商品管理', '商品分类'], //公共组件传值
      cateList: [],
      queryInfo: {
        //请求商品列表参数
        pagenum: 1,
        pagesize: 5
      },
       total:0,  //总页数
      props: {
        stripe: false,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: false,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      columns: [
        {
          label: '名称',
          prop: 'cat_name',
          width: '300px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'valid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
      handleSizeChange(val){
    //   console.log(val);
      this.queryInfo.pagesize=val
      this.getCategoriesList()
    },
    handleCurrentChange(val){
    //   console.log(val);
      this.queryInfo.pagenum=val
       this.getCategoriesList() 
    },
    async getCategoriesList() {
      const { data: res } = await getCategoriesList_api(this.queryInfo)
      if (res.meta.status != 200)
        return this.$message.error('获取用户数据列表失败')
      this.$message.success('获取用户数据列表成功')
      this.cateList = res.data.result
      this.total=res.data.total;
    //   console.log(res.data);
      
    }
  }
  
}
</script>
<style lang='less' scoped>
.search_button {
    margin-bottom: 10px;
    }
</style>