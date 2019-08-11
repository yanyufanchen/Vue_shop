<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-input clearable v-model="inputSearch" placeholder="请输入内容" style="width: 30%;" @clear="searchGoods">
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
        <el-button type="success" style class="search_button" @click="toAdd">添加商品</el-button>
      </div>
      <!-- 列表 -->
      <template>
        <el-table :data="tableGoods" border style="width: 100% ">
          <el-table-column type="index" label="#" width="50" style="text-align: center"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="600"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="80"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="150">
            <!-- <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template> -->
            <template slot-scope="scope">{{scope.row.add_time | moment}}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
import { getGoods_api } from '@/api'
export default {
  data() {
    return {
      common: ['商品管理', '商品列表'], //公共组件传值
      inputSearch: '',  //搜索value
      tableGoods: [],  //展示商品列表参数
      queryInfo: {    //请求商品列表参数
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      currentPage:1 , //当前页
      total:0  //总页数
    }
  },
  methods: {
    toAdd(){
      this.$router.push('/goods/add')
    },
    handleSizeChange(val){
      // console.log(val);
      this.queryInfo.pagesize=val
      this.getGoods() 
    },
    handleCurrentChange(val){
      // console.log(val);
      this.queryInfo.pagenum=val
       this.getGoods() 
    },
    async getGoods() {
      const { data: res } = await getGoods_api(this.queryInfo)
      // console.log(res)
    //   console.log(res.data)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户数据列表失败')
      this.$message.success('获取用户数据列表成功')
      this.tableGoods = res.data.goods
      this.total=res.data.total
    },
    searchGoods(){
        // console.log(this.inputSearch,666);
        this.queryInfo.query=this.inputSearch
         this.getGoods() 
    }
  },
  created() {
    this.getGoods()
  }
}
</script>
<style scoped>
.search_button {
  margin-left: 10px;
}
</style>