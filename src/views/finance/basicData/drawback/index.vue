<template>
  <div class="wrapper">
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
            >
              <template v-slot="scope">
                <el-form-item
                  v-if="scope.row.editFlag && item.prop !== 'status' && item.prop !== 'updateTime'"
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
                      : scope.row[item.prop]
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
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
      <el-dialog title="退税系数维护" :visible.sync="open" width="600px" append-to-body>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="from-pop"
          @submit.native.prevent
        >
          <el-form-item label="退税系数" prop="drawbackCoefficient">
            <el-input
              class="numrule"
              type="number"
              v-model="form.drawbackCoefficient"
              placeholder="请输入退税系数"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                :disabled="disabled"
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
    </div>
  </div>
</template>

<script>
import {
  getDrawbackList,
  editDrawback,
  statusDrawback,
  delDrawback,
  addDrawback,
} from '@/api/finance/basic'
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
            label: '退税系数',
            align: 'left',
            type: 'number',
            prop: 'drawbackCoefficient',
          },
          {
            label: '更新时间',
            align: 'left',
            type: 'text',
            prop: 'updateTime',
          },
          {
            label: '状态',
            align: 'center',
            type: 'text',
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
        drawbackCoefficient: [{ required: true, message: '退税系数不能为空', trigger: 'blur' }],
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
      getDrawbackList(data).then((res) => {
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
          editDrawback(data).then((data) => {
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
          delDrawback(ids).then((res) => {
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
          statusDrawback(data).then((res) => {
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
          addDrawback(this.form).then(() => {
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
        drawbackCoefficient: undefined,
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
</style>
