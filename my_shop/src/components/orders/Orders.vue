<!--  -->
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.update_time | moment}}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openSide"></el-button>
            <!-- 物流按钮 -->
            <el-button type="success" icon="el-icon-s-promotion" size="mini" @click="openOrders"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderfrom.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="orderfrom.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="sideVisible" width="50%" :before-close="addressClose">
      <el-form ref="OrderSideFormRef" label-width="110px" :model="addressForm" :rules="addressFormRules">
        <!-- 多级分类信息 -->
        <el-form-item label="选择商品分类：">
          <el-cascader
            style="width:20%"
            clearable
            v-model="addressForm.selectedKeys"
            :options="options"
            :props="{ 
              expandTrigger: 'hover',
              value:'value',
              label:'label',
                children:'children'
               }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="收货地址:"
          prop="side"
        >
          <el-input  v-model="addressForm.side" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >提交</el-button>
          <el-button @click="emptyAddress">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="ordersVisible" width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import { ordersList_api, ordersPany_api } from '@/api'
import cityData from './citydata'
export default {
  data() {
    return {
      common: ['订单管理', '订单列表'], //公共组件传值
      orderfrom: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   表单数据
      tableData: [],
      total: 0,
      //   修改地址
    //   selectedKeys: [],
      sideVisible: false,
      options: cityData,
      addressForm:{
          selectedKeys:[],
          side:''
      },
    //   验证地址栏对话框
      addressFormRules:{
          side: [{ required: true, message: '地址不能为空' }]
      },
      //   物流对话框
      ordersVisible: false,
      reverse: true,
      activities: []
    }
  },
  created() {
    this.getordersList()
  },
  methods: {
    async getordersList() {
      const { data: res } = await ordersList_api(this.orderfrom)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.$message.success('获取订单列表成功')
      this.tableData = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.orderfrom.pagesize = val
      this.getordersList()
    },
    handleCurrentChange(val) {
      this.orderfrom.pagenum = val
      this.getordersList()
    },
    // 点击打开修改地址对话框
    openSide() {
      this.sideVisible = true
    },
    // 地址对话框选中地址后
    handleChange(val) {
        // console.log(val);
        this.addressForm.side=val.join('')
    },
    // 重置对话框
    emptyAddress(){
       this.addressForm.selectedKeys=[]
        this.$refs.OrderSideFormRef.resetFields()
    },
    // 关闭地址对话框
    addressClose(){
        this.addressForm.selectedKeys=[]
        this.$refs.OrderSideFormRef.resetFields()
        this.sideVisible = false
    },
    // 点击打开物流信息对话框
    async openOrders() {
      const { data: res } = await ordersPany_api()
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取物流信息失败')
      this.$message.success('获取物流信息成功')
      console.log(res.data)
      this.activities = res.data
      this.ordersVisible = true
    }
  }
}
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100% !important;
}
</style>