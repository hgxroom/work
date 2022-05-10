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
              <div v-else :class="[item.prop == 'status' ? 'status' : '']">
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
              <el-button type="text" @click="deleteRow(scope.row, scope.$index)" size="small">
                删除
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
    <el-dialog title="染整损耗维护" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="from-pop">
        <el-form-item label="成分(中文)" prop="component">
          <el-input class="numrule" v-model="form.component" placeholder="请输入成分(中文)" />
        </el-form-item>
        <el-form-item label="成分(英文)" prop="componentEnglish">
          <el-input
            class="numrule"
            v-model="form.componentEnglish"
            placeholder="请输入成分(英文)"
          />
        </el-form-item>
        <el-form-item label="成分(简称)" prop="componentAbbreviation">
          <el-input
            class="numrule"
            v-model="form.componentAbbreviation"
            placeholder="请输入成分(简称)"
          />
        </el-form-item>
        <el-form-item label="白色(%)" prop="whiteColor">
          <el-input
            class="numrule"
            type="number"
            v-model="form.whiteColor"
            placeholder="请输入白色"
          />
        </el-form-item>
        <el-form-item label="浅色(%)" prop="lightColor">
          <el-input
            class="numrule"
            type="number"
            v-model="form.lightColor"
            placeholder="请输入浅色"
          />
        </el-form-item>
        <el-form-item label="中色(%)" prop="mediumColor">
          <el-input
            class="numrule"
            type="number"
            v-model="form.mediumColor"
            placeholder="请输入中色"
          />
        </el-form-item>
        <el-form-item label="深色(%)" prop="darkColor">
          <el-input
            class="numrule"
            type="number"
            v-model="form.darkColor"
            placeholder="请输入深色"
          />
        </el-form-item>
        <el-form-item label="特深(%)" prop="extraDarkColor">
          <el-input
            class="numrule"
            type="number"
            v-model="form.extraDarkColor"
            placeholder="请输入特深"
          />
        </el-form-item>
        <el-form-item label="色纺(%)" prop="colorSpinning">
          <el-input
            class="numrule"
            type="number"
            v-model="form.colorSpinning"
            placeholder="请输入色纺"
          />
        </el-form-item>
        <el-form-item label="色织(%)" prop="yarnDyedFabric">
          <el-input
            class="numrule"
            type="number"
            v-model="form.yarnDyedFabric"
            placeholder="请输入色织"
          />
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
  getDyeingFinishingLossList,
  editDyeingFinishingLoss,
  delDyeingFinishingLoss,
  addDyeingFinishingLoss,
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
            label: '成分(中文)',
            align: 'left',
            type: 'text',
            prop: 'component',
          },
          {
            label: '成分(英文)',
            align: 'left',
            type: 'text',
            prop: 'componentEnglish',
          },
          {
            label: '成分(简称)',
            align: 'left',
            type: 'text',
            prop: 'componentAbbreviation',
          },
          {
            label: '白色(%)',
            align: 'left',
            type: 'number',
            prop: 'whiteColor',
          },
          {
            label: '浅色(%)',
            align: 'left',
            type: 'number',
            prop: 'lightColor',
          },
          {
            label: '中色(%)',
            align: 'left',
            type: 'number',
            prop: 'mediumColor',
          },
          {
            label: '深色(%)',
            align: 'left',
            type: 'number',
            prop: 'darkColor',
          },
          {
            label: '特深(%)',
            align: 'left',
            type: 'number',
            prop: 'extraDarkColor',
          },
          {
            label: '色纺(%)',
            align: 'left',
            type: 'number',
            prop: 'colorSpinning',
          },
          {
            label: '色织(%)',
            align: 'left',
            type: 'number',
            prop: 'yarnDyedFabric',
          },
        ],
        data: [],
      },
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        component: [{ required: true, message: '成分(中文)不能为空', trigger: 'blur' }],
        componentEnglish: [{ required: true, message: '成分(英文)不能为空', trigger: 'blur' }],
        componentAbbreviation: [{ required: true, message: '成分(简称)不能为空', trigger: 'blur' }],
        whiteColor: [{ required: true, message: '白色不能为空', trigger: 'blur' }],
        lightColor: [{ required: true, message: '浅色不能为空', trigger: 'blur' }],
        mediumColor: [{ required: true, message: '中色不能为空', trigger: 'blur' }],
        darkColor: [{ required: true, message: '深色不能为空', trigger: 'blur' }],
        extraDarkColor: [{ required: true, message: '特深不能为空', trigger: 'blur' }],
        colorSpinning: [{ required: true, message: '色纺不能为空', trigger: 'blur' }],
        yarnDyedFabric: [{ required: true, message: '色织不能为空', trigger: 'blur' }],
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
      getDyeingFinishingLossList(data).then((res) => {
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
          editDyeingFinishingLoss(data).then((data) => {
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
          delDyeingFinishingLoss(ids).then((res) => {
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
          if (i.status == 0) return this.$message.warning('请先禁用其他功能性承若')
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
          editDyeingFinishingLoss(data).then((res) => {
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
          addDyeingFinishingLoss(this.form).then(() => {
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
        commitmentName: undefined,
        laborCost: undefined,
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
