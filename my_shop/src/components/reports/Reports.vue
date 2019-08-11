<!--  -->
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import {reports_api} from '@/api'
//导入lodash
import _ from 'lodash'
export default {
  data() {
    return {
      common: ['数据统计', '数据报表'] ,//公共组件传值
       options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  async mounted(){
      // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res}=await reports_api()
        // console.log(res);
         if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    //合并res.data和this.options
    //合并res.data和this.options
    const result = _.merge(res.data,this.options)
    // this.options={...res.data}
         // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
  }
}
</script>
<style lang='less' scoped>
</style>