<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="add" class="add-btn">新增</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right"></el-col>
    </el-row>
    <el-row>
      <el-form :model="formData" :rules="formData.rules" ref="formRef">
        <el-table
          size="small"
          :data="formData.data"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          highlight-current-row
          header-row-class-name="tableHeader"
        >
          <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
          <el-table-column
            v-for="(item, index) in formData.columns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align"
          >
            <template v-slot="scope">
              <el-form-item
                v-if="scope.row.editFlag && item.prop !== 'status'"
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
              <div v-else>
                {{ scope.row[item.prop] }}
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
                v-if="!scope.row.editFlag"
                @click="editRow(scope.row, scope.$index)"
                size="small"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="特整工艺维护" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="from-pop">
        <el-form-item label="工艺名称" prop="processName">
          <el-input class="numrule" v-model="form.processName" placeholder="请输入工艺名称" />
        </el-form-item>
        <el-form-item label="工费" prop="laborCost">
          <el-input
            class="numrule"
            type="number"
            v-model="form.laborCost"
            placeholder="请输入工费"
          />
        </el-form-item>
        <el-form-item label="损耗" prop="loss">
          <el-input class="numrule" type="number" v-model="form.loss" placeholder="请输入损耗" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSpecialFinishingProcessList,
  editSpecialFinishingProcess,
  delSpecialFinishingProcess,
  addSpecialFinishingProcess,
} from '@/api/finance/basic'
export default {
  name: 'craft',
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
            label: '工艺名称',
            align: 'left',
            type: 'text',
            prop: 'processName',
          },
          {
            label: '工费',
            align: 'left',
            type: 'number',
            prop: 'laborCost',
          },
          {
            label: '损耗',
            align: 'left',
            type: 'number',
            prop: 'loss',
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
        processName: [{ required: true, message: '退税系数不能为空', trigger: 'blur' }],
        laborCost: [{ required: true, message: '退税系数不能为空', trigger: 'blur' }],
        loss: [{ required: true, message: '退税系数不能为空', trigger: 'blur' }],
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
      getSpecialFinishingProcessList(data).then((res) => {
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
          editSpecialFinishingProcess(data).then((data) => {
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
          delSpecialFinishingProcess(ids).then((res) => {
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
      // 启用、禁用
      if (row.status == 1) {
        for (const i of this.formData.data) {
          if (i.status == 0) return this.$message.warning('请先禁用其他退税系数')
        }
      }
      // 状态改变
      let statusText = row.status == 0 ? '禁用' : '启用'
      let { id, status } = row
      status = status == 0 ? 1 : 0
      let data = {
        id: id, // 序号
        status: status, // 状态
      }
      this.$confirm(`确定${statusText}这条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: `${statusText}成功!`,
          })
          editSpecialFinishingProcess(data).then((res) => {
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
          addSpecialFinishingProcess(this.form).then(() => {
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
        specialFinishingProcessCoefficient: undefined,
        status: '1',
      }
      this.resetForm('form')
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
  border-color: transparent;
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

.container {
  .add-btn {
    margin: 16px 0;
    background-color: #00a870;
    padding: 8px 15px;
  }
  .right-btn {
    margin: 16px 0 16px 16px;
    padding: 8px 15px;
  }
  margin: 24px;
  padding: 0 16px;
  .status {
    color: #00a870;
  }
}
</style>
