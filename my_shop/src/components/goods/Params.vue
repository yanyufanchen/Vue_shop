
<template>
  <div>
    <Breadcrumb :value="common"></Breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-button type="success" style class="search_button">添加分类</el-button>
      </div>
      <!-- 提示信息 -->
      <el-alert
        class="alert"
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>

      <el-form ref="goodscateFormRef" label-width="110px">
        <!-- 多级分类信息 -->
        <el-form-item label="选择商品分类：">
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
      </el-form>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- tabs用户管理 -->
        <el-tab-pane label="用户管理" name="first">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisablad"
            @click="addParamsVisible = true"
          >添加参数</el-button>
          <el-table :data="manytableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!-- 渲染参数标签 -->
                  <el-tag
                    v-for="(tag,index) in props.row.attr_vals"
                    :key="index"
                    closable
                    type="danger"
                    class="el-tag"
                    @close="closeParams(props.row,tag)"
                  >{{tag}}</el-tag>
                  <!-- 追加参数标签 -->
                  <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="addparamValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(props.row)"
                  >+ New Tag</el-button>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editCateParamsName(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteCateParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- tabs配置管理 -->
        <el-tab-pane label="配置管理" name="second">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisablad"
            @click="addParamsVisible = true"
          >添加参数</el-button>
          <el-table :data="onlytableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!-- <el-form-item>
                    <span>{{ props.row.attr_vals }}</span>
                  </el-form-item>-->
                  <el-tag closable type="danger" class="el-tag">{{props.row.attr_vals}}</el-tag>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addParamsVisible"
      width="45%"
      :before-close="handleClose"
    >
      <el-form
        :model="addParamsForm"
        status-icon
        :rules="paramsrules"
        ref="addParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="paramsName">
          <el-input v-model="addParamsForm.paramsName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editParamsVisible"
      width="45%"
      :before-close="handleClose"
    >
      <el-form
        :model="editParamsForm"
        status-icon
        :rules="paramsrules"
        ref="editParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoriesList_api,
  getattributes_api,
  changeParams_api,
  addCateParams_api,
  deleteCateParams_api,
  
} from '@/api'
import {
 changeParamsCommon
} from '@/api/compute.js'
export default {
    data() {
        return {
            common: ['商品管理', '分类参数'], //公共组件传值
            //   联级选择器
            //绑定用户选择的分类值
            selectedKeys: [], //选中选择器id数组
            //此为选择器需要获取的数据
            options: [], 
            activeName: 'first',//动态参数
            manytableData: [],
            //静态参数
            onlytableData: [],
            //tab栏切换属性
            sel: 'many',
            addparamValue: '', //追加参数标签的value值
            addParamsVisible: false, //添加参数对话框的显示与隐藏
            editParamsVisible: false, //编辑参数对话框的显示与隐藏
            addParamsForm: {}, //添加参数表单  
            //编辑参数表单
            editParamsForm: {
              attr_name: ''
            }, 
            paramsrules: {
                paramsName: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getGoodsCateList()
    },
    computed: {
        isBtnDisablad() {
            if (this.selectedKeys.length !== 3) {
              return true
            }
            return false
        },
        titleText() {
            if (this.sel == 'many') {
              return '动态参数'
            } else if (this.sel == 'only') {
              return '静态属性'
            }
        }
    },
    methods: {
        //分类选中，执行
        //获取选择器的值
        //当选择器值改变时触发
        handleChange(value) {
            if (this.selectedKeys.length > 0) {
                this.getattributes()
            } else {
              //当用户删除选中分类，就清空下面的参数信息
                this.manytableData = []
                this.onlytableData = []
            }
        },
        //获取分类信息
        async getGoodsCateList() {
        const { data: res } = await getCategoriesList_api()
            //   console.log(res)
            if (res.meta.status != 200)
                return this.$message.error('获取商品分类列表失败')
            this.$message.success('获取商品分类列表成功')
            this.options = res.data
        },
        //tab栏切换执行函数
        // console.log(tab.name);
        handleClick(tab, event) {
            if (tab.name == 'first') {
                this.sel = 'many'
            } else if (tab.name == 'second') {
                this.sel = 'only'
            }
            // console.log(this.sel, 666)
            if (this.selectedKeys.length > 0) {
                //如果用户选择了分类,才执行获取数据函数
                // console.log(22)
                this.getattributes()
            }
        },
        //获取指定分类的参数
        async getattributes() {
            //获取参数
            const { data: res } = await getattributes_api({
                id: this.selectedKeys[this.selectedKeys.length - 1],
                sel: this.sel
            })
            //   console.log(res.data)
            if (res.meta.status != 200)
                return this.$message.error('获取商品分类参数失败')
            this.$message.success('获取商品分类参数成功')
            //   console.log(res.data);
            res.data.forEach(item => {
            //添加自定义状态，控制input的显示与隐藏
                item.inputVisible = false
                item.attr_vals.length > 0 ? (item.attr_vals = item.attr_vals.split(',')) : (item.attr_vals = [])
          })
          this.sel == 'many'
            ? (this.manytableData = res.data)
            : (this.onlytableData = res.data)
        },
        // 添加参数名称
        async addCateParams() {
            const { data: res } = await addCateParams_api({
                attr_name: this.addParamsForm.paramsName,
                attr_sel: this.sel,
                id: this.selectedKeys[this.selectedKeys.length - 1]
            })
            //   console.log(res)
            if (res.meta.status !== 201)
                return this.$message.error('添加商品分类参数失败')
            this.$message.success('添加商品分类参数成功')
            this.getattributes()
            this.addParamsVisible = false
        },
        // 编辑参数名称
        editCateParamsName(row) {
            //   console.log(row)
            this.editParamsVisible = true
            this.editParamsForm.attr_name = row.attr_name
            this.editParamsForm.attrId = row.attr_id
            this.editParamsForm.id = row.cat_id
            this.editParamsForm.attr_sel = row.attr_sel
            this.editParamsForm.attr_vals = row.attr_vals.join()
        },
        // 编辑参数提交
        editCateParams() {
            //   console.log(this.editParamsForm)
            // if (this.editParamsForm.paramsName.trim()=='') return this.$message.error('请填写正确的参数名称')
            this.$refs.editParamsFormRef.validate(async result => {
                if (!result) return this.$message.error('修改失败')
                const { data: res } = await changeParams_api(this.editParamsForm)
                // console.log(res);
                if (res.meta.status !== 200)
                return this.$message.error('修改商品分类参数失败')
                this.$message.success('修改商品分类参数成功')
                this.editParamsVisible = false
                this.getattributes()
            })
        },
        // 删除参数名称
        async deleteCateParams(row) {
            // console.log(row)
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
            if (confirmResult !== 'confirm') {
              return this.$message.info('已经取消删除')
            }
            //   console.log(row)

            const { data: res } = await deleteCateParams_api({
                id: row.cat_id,
                attrid: row.attr_id
            })
            if (res.meta.status !== 200)
                return this.$message.error('删除商品分类参数失败')
            this.$message.success('删除商品分类参数成功')
            this.getattributes()
        },
        // 追加参数标签显示input
        showInput(rose) {
            //参数
            //   console.log(rose);
            // 从标签切换到inut
            rose.inputVisible = true
            // input自动获得焦点
            // $nextTick就是当页面的input渲染出来的时候，才执行里面的函数,因为input使用了v-if,切换的时候需要页面重绘
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // input结束执行添加参数标签
        async handleInputConfirm(rose) {
            if (this.addparamValue.trim().length == 0) {
                this.addparamValue = ''
                rose.inputVisible = false
                return
            }
            rose.attr_vals.push(this.addparamValue.trim())
            this.addparamValue = ''
            rose.inputVisible = false
            //   console.log(rose)
             // 调用compute-api更新数据库参数属性
            changeParamsCommon(rose).then(res => {
                // console.log(res)
                if (res.meta.status != 200) return this.$message.error('更新参数属性失败')
                this.$message.success('更新参数属性成功')
            })
        },
        async closeParams(row, tag) {
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
            if (confirmResult !== 'confirm') {
                return this.$message.info('已经取消删除')
            }
            row.attr_vals.pop(tag)
            // 调用更新数据库参数属性
            changeParamsCommon(row).then(res => {
                // console.log(res)
                if (res.meta.status !== 200)
                return this.$message.error('删除参数属性失败')
                this.$message.success('删除参数属性成功')
            })
        },
        handleClose(done) {
            this.addParamsVisible = false
            this.editParamsVisible = false
        },
      }
    }
</script>
<style lang='less' scoped>
.alert {
  margin: 10px 0;
}
.el-tag {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin: 10px;
  vertical-align: bottom;
}
</style>