<template>
  <div class="container">
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
              {{ scope.row.id }}
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
                v-if="scope.row.editFlag && item.prop !== 'category'"
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
    </el-row>
  </div>
</template>

<script>
import {
  getDyeingFeeDataList,
  editDyeingFeeData,
  delDyeingFeeData,
  addDyeingFeeData,
} from '@/api/finance/basic'
export default {
  name: 'craft',
  data() {
    return {
      // 表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '类别',
            align: 'left',
            type: 'text',
            prop: 'category',
          },
          {
            label: '单染 (元)',
            align: 'left',
            type: 'number',
            prop: 'singleDyeing',
          },
          {
            label: '双染 (元)',
            align: 'left',
            type: 'number',
            prop: 'doubleDyeing',
          },
          {
            label: '三染 (元)',
            align: 'left',
            type: 'number',
            prop: 'threeDyeing',
          },
          {
            label: '水洗 (元)',
            align: 'left',
            type: 'number',
            prop: 'washing',
          },
        ],
        data: [],
      },
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      const data = {}
      getDyeingFeeDataList(data).then((res) => {
        this.formData.data = res.rows
      })
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
          editDyeingFeeData(data).then((data) => {
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
