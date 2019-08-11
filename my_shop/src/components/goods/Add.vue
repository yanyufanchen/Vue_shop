<!--  -->
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex-0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏切换 -->
      <el-form
        :model="addGoodsForm"
        status-icon
        :rules="checkAddForm"
        ref="addGoodsFormref"
        label-width="100px"
        class="demo-addGoodsForm"
        :label-position="labelPosition"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          :stretch="true"
          @tab-click="getCateParams"
        >
          <div style="margin: 20px;"></div>
          <!-- 多级分类信息 -->
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0" class="from">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_price"
                autocomplete="off"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsForm.goods_weight" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsForm.goods_number" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                style="width:20%"
                clearable
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
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyParams">
              <!-- 使用数组渲染复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 循环生成静态属性 -->
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyParams" :key="i">
              <el-input v-model="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 预览图片对话框 -->
      <el-dialog title="提示" :visible.sync="imgVisible" width="30%" >
        <img :src="previewPath" alt="" class="imgVisible">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategoriesList_api ,addGoods_api} from '@/api'
import { getCateParamsCommon } from '@/api/compute.js'
import { quillEditor } from 'vue-quill-editor'
//导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import _ from 'lodash'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      common: ['商品管理', '添加商品'], //公共组件传值
      activeIndex: 0, //步骤进度序列号
      tabPosition: 'left', //tab栏显示方向
      // 基本信息value
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //上传图片数组
        pics: [],
        attrs: [],
        goods_introduce: ''
      },
      selectedKeys: [], //分类选择数组  
      options: [], //分类渲染参数
      labelPosition: 'top',
      //   表单验证
      checkAddForm: {
        goods_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //   获取参数属性的传参
      goodsParams: {
        id: '',
        sel: ''
      },
      onlyParams: [], //获取静态参数
      manyParams: [], //获取动态参数
      fileList: [], //上传的文件列表
      //图片上传组件的headers请求头对象
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      imgVisible:false,//图片对话框
      previewPath:'',//图片预览地址
    }
  },
  methods: {
    //tab栏切换触发
    handleClick(tab, event) {},
    //tab栏判断，不满足就不切换
    beforeTabLeave(activeName, oldActiveName) {
      // 判断变量
      var res = true
      if (oldActiveName == '0') {
        this.$refs.addGoodsFormref.validate(result => {
        //   console.log(result, 666)
          if (!result) {
            res = false
          }
        })
        if (this.selectedKeys.length < 3) {
          res = false
          this.$message.error('请选择商品分类列表')
        }
      }
      return res
    },
    // 分类选择器change事件
    handleChange() {
      this.addGoodsForm.goods_cat = this.selectedKeys
    },
    //获取分类信息
    async getGoodsCateList() {
      const { data: res } = await getCategoriesList_api()
      //   console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败')
      this.$message.success('获取商品分类列表成功')
      this.options = res.data
    },
    // 获取商品参数/商品属性
    getCateParams() {
      // console.log(this.activeIndex);
      if (this.activeIndex == 1) {
        this.goodsParams.sel = 'many'
        this.goodsParams.id = this.selectedKeys[this.selectedKeys.length - 1]
      } else if (this.activeIndex == 2) {
        this.goodsParams.sel = 'only'
        this.goodsParams.id = this.selectedKeys[this.selectedKeys.length - 1]
      }
      if (this.activeIndex == 1 || this.activeIndex == 2) {
        getCateParamsCommon(this.goodsParams).then(res => {
          if (res.meta.status !== 200)
            return this.$message.error('获取参数属性失败')
          this.$message.success('获取参数属性成功')
          res.data.forEach(item => {
            item.attr_vals.length > 0
              ? (item.attr_vals = item.attr_vals.split(','))
              : (item.attr_vals = [])
          })
          this.goodsParams.sel == 'many'
            ? (this.manyParams = res.data)
            : (this.onlyParams = res.data)
        //   console.log(this.manyParams)
        //   console.log(this.onlyParams)
        })
      }
    },
    // 点击图片叉号触发的函数
    handleRemove(file) {
    //   console.log(file)
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(
        item => item.pic === filePath
      )
      //   移除数组图片指定项
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 点击图片触发的函数
    handlePreview(file, fileList) {
        this.previewPath = file.response.data.url
        this.imgVisible=true;
    },
    // 上传图片成功执行函数
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      if (response.meta.status !== 200)
        return this.$message.error('上传图片失败')
      this.$message.success('上传图片成功')
      this.addGoodsForm.pics.push({ pic: response.data.tmp_path })
    },
    // 添加商品提交
    async add() {
        this.$refs.addGoodsFormref.validate(async valid=>{
            if(!valid) return this.$message.error('请填写完整的信息')
            const form=_.cloneDeep(this.addGoodsForm)
            form.goods_cat=form.goods_cat.join(',')
            // 将动态参数添加进去
            // console.log(this.manyParams);
            this.manyParams.forEach(item=>{
                form.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals.join(" ")})
            })
            // 将静态参数添加进去
            // console.log(this.onlyParams);
            this.onlyParams.forEach(item=>{
                form.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals[0]})
            })
            const{data:res}=await addGoods_api(form)
            if(res.meta.status!==201) return this.$message.error('添加商品失败')
            this.$message.success('添加商品成功')
            // 跳转到商品列表
            this.$router.push('/goods')
        });
    }
  },
  created() {
    this.getGoodsCateList()
  },
  computed: {}
}
</script>
<style lang='less' scoped>
.el-step {
  font-size: 13px;
}
.from .el-input {
  width: 100%;
}
.imgVisible {
    width: 100%;
}
</style>