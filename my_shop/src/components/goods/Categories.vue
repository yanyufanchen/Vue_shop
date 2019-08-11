
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-button type="success" style class="search_button" @click="showCatedialogVisible">添加分类</el-button>
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
    <!-- 添加分类的对话框 -->
    <el-dialog
      @close="addCateClose"
      title="添加分类"
      :visible.sync="CatedialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="cateFormRef" :model="addCateForm" :rules="cateFormRules" label-width="100px">
        <!-- 账号 -->
        <el-form-item prop="cateName" label="活动名称:">
          <el-input
            v-model="addCateForm.cateName"
            placeholder="请输入分类名称"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 多级分类信息 -->
        <el-form-item label="分类名称:">
          <el-cascader
            style="width:100%"
            clearable
            change-on-select
            v-model="selectedKeys"
            :options="options"
            :props="{ 
              expandTrigger: 'hover',
              value:'cat_id',
              label:'cat_name',
                children:'children'
               }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import { getCategoriesList_api ,addCateName_api} from '@/api'
    export default {
        data() {
            return {
                CatedialogVisible: false, //对话框显示隐藏
                addCateForm: {
                //对话框内分类名称value
                cateName: '',
                
                },
                // 表单验证规则
                cateFormRules: {
                    // 验证用户名
                    cateName: [
                      { required: true, message: '请输入用户名', trigger: 'blur' },
                      { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                    ]
                },
            
                common: ['商品管理', '商品分类'], //公共组件传值
                cateList: [], //获取分类数据
                queryInfo: {
                    //请求商品列表参数
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0, //总页数
                //   树状结构参数
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
                //   树状结构参数
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
                ],
                //   联级选择器
                //绑定用户选择的分类值
                selectedKeys:[],
                options: [],  //此为选择器需要获取的数据
                cateNameList:[]  //选中选择器的分类值
            }
        },  
        created() {
            this.getCategoriesList()
        },  
        methods: {
            addCateClose() {  //关闭对话框执行函数
                // console.log(this.$refs.cateFormRef);
                this.$refs.cateFormRef.resetFields()  
                this.selectedKeys = [];
            },
            handleSizeChange(val) {
                //   console.log(val);
                this.queryInfo.pagesize = val
                this.getCategoriesList()
            },
            handleCurrentChange(val) {
                //   console.log(val);
                this.queryInfo.pagenum = val
                this.getCategoriesList()
            },
            async getCategoriesList() {
                const { data: res } = await getCategoriesList_api(this.queryInfo)
                if (res.meta.status != 200) return this.$message.error('获取用户数据列表失败')
                this.$message.success('获取用户数据列表成功')
                this.cateList = res.data.result
                this.total = res.data.total
                // console.log(res.data);
            },
            handleClose() {
                //关闭对话框
                this.CatedialogVisible = false
            },
            showCatedialogVisible() {
                //显示对话框
                this.showGetCategoriesList()
                this.CatedialogVisible = true
            },
            handleChange(value) {  //获取选择器的值
              //当选择器值改变时触发
                this.cateNameList=value
                //  console.log(value);
            },
            async showGetCategoriesList() {  //多级联动分类名称获取
                const { data: res } = await getCategoriesList_api({type:2})
                if (res.meta.status !== 200)
                  return this.$message.error('获取用户数据列表失败')
                this.$message.success('获取用户数据列表成功')
                // console.log(res.data);
                this.options=res.data
            },
            async addCateName(){  //提交添加分类
                if(this.addCateForm.cateName==''&&this.addCateForm.cateName<2){
                    return this.$message.error('请填写正确的分类名称')
                } 
                // console.log(this.cateNameList)
                // console.log(this.addCateForm.cateName)
                const params={} //需要请求提交的数据对象
                params.cat_name=this.addCateForm.cateName
                if(this.cateNameList.length>0){    //二级分类or三级分类
                    params.cat_pid=this.cateNameList[this.cateNameList.length-1]
                    params.cat_level=this.cateNameList.length
                }else if(this.cateNameList.length<=0){
                    params.cat_pid=0
                    params.cat_level=0
                }
                // console.log(params);
                const {data:res}=await addCateName_api(params)
                // console.log(res);
                if (res.meta.status !== 201)
                return this.$message.error('添加分类失败')
                this.$message.success('添加分类成功')
                this.getCategoriesList()
                this.CatedialogVisible = false
            }
        }
    }
</script>
<style lang='less' scoped>
.search_button {
  margin-bottom: 10px;
}
</style>