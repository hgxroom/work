<template>
  <div class="wrapper">
    <div class="container">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="add" class="add-btn">新增</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="default" @click="handleImport" class="right-btn">导入</el-button>
          <el-button type="default" @click="handleExportBtn" class="right-btn">导出</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form :model="formData" :rules="formData.rules" ref="formRef">
          <el-table
            size="small"
            border
            :data="formData.data"
            :max-height="600"
            style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
            highlight-current-row
            header-row-class-name="tableHeader"
          >
            <el-table-column label="序号" align="center" width="100px">
              <template v-slot="scope">
                {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in formData.columns"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :align="item.align"
              :show-overflow-tooltip="true"
            >
              <template v-slot="scope">
                <el-form-item
                  v-if="
                    scope.row.editFlag &&
                    (item.prop == 'supplier' ||
                      item.prop == 'qualityClassification' ||
                      item.prop == 'price')
                  "
                  :prop="'data.' + scope.$index + '.' + item.prop"
                  :rules="{
                    required: true,
                    message: ' ',
                    trigger: 'blur',
                  }"
                >
                  <el-input
                    class="numrule"
                    :type="item.type"
                    size="small"
                    placeholder="请输入内容"
                    v-model="formData.sel[item.prop]"
                  >
                  </el-input>
                </el-form-item>
                <div
                  v-else
                  :class="[
                    'content-colum',
                    item.prop == 'status'
                      ? scope.row[item.prop] == 0
                        ? 'launch-status'
                        : 'forbid-status'
                      : '',
                  ]"
                >
                  {{
                    item.prop == 'status'
                      ? statusFilter(scope.row[item.prop])
                      : scope.row[item.prop] || '--'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="scope">
                <el-button
                  v-if="scope.row.editFlag"
                  type="text"
                  @click.stop="saveRow(scope.row, scope.$index)"
                  size="small"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  v-if="!scope.row.editFlag && scope.row.status == 1"
                  @click="editRow(scope.row, scope.$index)"
                  size="small"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status == 1"
                  type="text"
                  @click="deleteRow(scope.row, scope.$index)"
                  size="small"
                >
                  删除
                </el-button>
                <el-button type="text" @click="statusRow(scope.row, scope.$index)" size="small">
                  {{ scope.row.status == 0 ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-row>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getList"
      />
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog title="纱线价格维护" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="from-pop">
          <el-form-item label="纱线编号" prop="itemNo">
            <el-input v-model="form.itemNo" placeholder="请输入纱线编号" />
          </el-form-item>
          <el-form-item label="纱线品名" prop="yarnName">
            <el-input v-model="form.yarnName" placeholder="请输入纱线品名" />
          </el-form-item>
          <el-form-item label="供应商" prop="supplier">
            <el-input v-model="form.supplier" placeholder="请输入供应商" />
          </el-form-item>
          <el-form-item label="现价" prop="price">
            <el-input class="numrule" type="number" v-model="form.price" placeholder="请输入现价" />
          </el-form-item>
          <el-form-item label="品质分类" prop="qualityClassification">
            <el-input v-model="form.qualityClassification" placeholder="请输入品质分类" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip text-center" slot="tip">
            <!-- <div class="el-upload__tip" slot="tip">
              <el-checkbox v-model="upload.updateSupport" />
              是否更新已经存在的用户数据
            </div> -->
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPriceList, editPrice, delPrice, addPrice, yarnPriceExport } from '@/api/finance/basic'
import { getToken } from '@/utils/auth'
export default {
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 总条数
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '纱线编号',
            align: 'left',
            type: 'number',
            prop: 'itemNo',
          },
          {
            label: '纱线品名',
            align: 'left',
            type: 'text',
            prop: 'yarnName',
          },
          {
            label: '供应商',
            align: 'left',
            type: 'text',
            prop: 'supplier',
          },
          {
            label: '品质分类',
            align: 'left',
            type: 'text',
            prop: 'qualityClassification',
          },
          {
            label: '先前采购价格(元)',
            align: 'left',
            type: 'number',
            prop: 'agoPrice',
          },
          {
            label: '上次更新时间',
            align: 'left',
            type: 'number',
            prop: 'agoUpdateTime',
          },
          {
            label: '现价(元)',
            align: 'left',
            type: 'number',
            prop: 'price',
          },
          {
            label: '更新时间',
            align: 'left',
            type: 'number',
            prop: 'updateTime',
          },
          {
            label: '状态',
            width: 120,
            align: 'center',
            prop: 'status',
          },
        ],
        data: [],
      },
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      disabled: false,
      // 表单校验
      rules: {
        itemNo: [{ required: true, message: '纱线编号不能为空', trigger: 'blur' }],
        yarnName: [{ required: true, message: '纱线品名不能为空', trigger: 'blur' }],
        supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '现价不能为空', trigger: 'blur' }],
        qualityClassification: [{ required: true, message: '品质不能为空', trigger: 'blur' }],
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/yarnPrice/importYarnPrice',
      },
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    statusFilter(type) {
      let obj = {
        0: '启用',
        1: '禁用',
        2: '删除',
      }
      return obj[type]
    },
    /**
     * 获取列表数据
     */
    getList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      getPriceList(data).then((res) => {
        this.total = res.total
        this.formData.data = res.rows
      })
    },
    add() {
      let flag = this.formData.data.findIndex((item) => {
        return item.status == 0
      })
      this.disabled = flag == -1 ? false : true
      this.reset()
      this.open = true
    },
    saveRow(row, index) {
      // 保存
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          // 保存
          const data = JSON.parse(JSON.stringify(this.formData.sel))
          for (const k in data) {
            row[k] = data[k] // 将sel里面的value赋值给这一行。ps(for....in..)的妙用，细心的同学发现这里我并没有循环对象row
          }
          row.editFlag = false
          editPrice(data).then((data) => {
            this.getList()
          })
        } else {
          this.$message.error('请先完善必要信息')
          return false
        }
      })
    },
    editRow(row) {
      // 编辑
      for (const i of this.formData.data) {
        if (i.editFlag) return this.$message.warning('请先保存当前编辑项')
      }
      this.formData.sel = row
      row.editFlag = true
    },
    deleteRow(row, index) {
      let ids = row.id
      // 删除接口 成功以后 this.editId = ''
      this.$confirm('确定删除这条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delPrice(ids).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    statusRow(row, index) {
      // // 启用、禁用
      // if (row.status == 1) {
      //   for (const i of this.formData.data) {
      //     if (i.status == 0) return this.$message.warning('请先禁用其他纱线价格')
      //   }
      // }
      // 状态改变
      let statusText = row.status == 0 ? '禁用' : '启用'
      let { status } = row
      status = status == 0 ? 1 : 0
      let data = JSON.parse(JSON.stringify(row))
      data.status = status
      this.$confirm(`确定${statusText}这条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          editPrice(data).then((res) => {
            this.$message({
              type: 'success',
              message: `${statusText}成功!`,
            })
            this.getList()
          })
          // rows.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${statusText}`,
          })
        })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addPrice(this.form).then(() => {
            this.open = false
            this.getList()
          })
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        PriceCoefficient: undefined,
        status: '0',
      }
      this.resetForm('form')
    },
    handleExportBtn() {
      console.log('点击导出')
      yarnPriceExport()
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '纱线价格维护'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        '/system/yarnPrice/importTemplate',
        {},
        `纱线价格模板_${new Date().getTime()}.xlsx`,
      )
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true },
      )
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.upload.open = false
      this.$refs.upload.submit()
    },
  },
  created() {
    this.getList()
  },
}
</script>
<style lang="scss" scoped>
::v-deep .tableHeader th {
  background-color: #f5f7fa;
  color: #8b8b8b;
  font-size: 14px;
  height: 48px;
}
::v-deep .el-table th.is-leaf {
  border-right-color: #e7e7e7;
  border-bottom-color: transparent;
}
::v-deep .el-table td {
  border-bottom: 1px solid #f3f3f3;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #f3f3f3;
}

.el-form-item {
  margin-bottom: 0px;
}
.from-pop .el-form-item {
  margin-bottom: 22px;
}
// 消除输入框右边上下箭头
::v-deep.numrule input::-webkit-outer-spin-button,
::v-deep.numrule input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep.numrule input[type='number'] {
  -moz-appearance: textfield;
}
.wrapper {
  background: rgba(245, 247, 250, 1);
}
.container {
  margin: 24px;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 16px 36px !important;
  .add-btn {
    margin: 16px 0;
    background-color: #00a870;
    border-color: #00a870;
    padding: 8px 15px;
  }
  .right-btn {
    margin: 16px 0 16px 16px;
    padding: 8px 15px;
  }
  margin: 24px;
  padding: 0 16px;
  .launch-status {
    color: #00a870;
  }
  .forbid-status {
    color: #c5c5c5;
  }
}
.content-colum {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* for Opera */
}
</style>
