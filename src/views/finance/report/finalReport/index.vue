<template>
  <div class="app-main">
    <div class="title-box">
      <div class="tit">成本报价计算</div>
      <div class="tit-info">
        <span>布号：BJ-8930484935</span>
        <el-button @click="colorc">改变</el-button>
        <span>
          品名：60S 皮马棉 精梳 紧密纺+140D 晓星H350氨纶 89/11 弹力罗纹 15寸18针 840T 31*2CM 220G
        </span>
      </div>
    </div>
    <div class="container">
      <div class="card-box">
        <p class="title">最终报价</p>
        <el-table
          size="small"
          :data="datalist"
          :span-method="arraySpanMethod"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="利润率" align="center" prop="lrl">
            <template v-slot="scope">
              <el-input
                v-if="!(scope.$index === 0)"
                size="small"
                class="numrule"
                placeholder="请输入内容"
                @change="handleCount(scope)"
                v-model="scope.row.lrl"
              >
              </el-input>
              <div v-else>
                {{ scope.row.lrl }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="利润率" align="center" prop="lrl" :show-overflow-tooltip="true"> -->
          <!-- </el-table-column> -->

          <el-table-column
            v-for="(val, index) in labelList"
            :key="index"
            :label="val.label"
            align="center"
            :prop="val.key"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" prop="lrl">
            <template v-slot="scope">
              <div class="info-list checkbox">
                <el-checkbox v-model="scope.row.cz"></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="报价策略" align="center">
            <template v-slot="scope">
              <div class="remarks-text">
                <el-input type="textarea" :rows="5" placeholder="请输入报价策略" v-model="remark">
                </el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card-box">
        <p class="title">历史报价信息</p>
        <el-table
          size="small"
          :data="formData.data"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
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
              <div>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card-box">
        <p class="title">历史订单信息</p>
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
              <div>
                {{ remark }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="add" class="save-btn">取消</el-button>
        <el-button @click="add" class="sub-btn">确认报价</el-button>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="历史纱价"
      :visible.sync="productDialogVisible"
      width="1104px"
      class="dialog-contant"
      :before-close="handleClose"
    >
      <div class="box">
        <div class="basic-info">
          <p class="info">60S 皮马棉 精梳 紧密纺+140D</p>
        </div>
        <el-table
          size="small"
          :data="formData.data"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
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
              <div>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom-btn">
          <el-button class="cancel-btn" @click="handleClose">取消</el-button>
          <el-button class="sub-btn" type="primary" @click="resetQuery">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { number } from 'echarts/lib/export'
export default {
  data() {
    return {
      colorlist: [
        {
          interestRate: 3,
          choiceflag: 1,
          buildProductColorPriceVos: [
            {
              colorName: '白色',
              price: 57.68,
            },
            {
              colorName: '深色',
              price: 67.98,
            },
            {
              colorName: '浅色',
              price: 90.64,
            },
          ],
        },
      ],
      bh: '', //布号
      pm: '', //品名
      remark: '',
      datalist: [
        {
          interestRate: 3,
          choiceflag: 1,
          whiteColor: 57.68,
          blankColor: 67.98,
          lightColor: 90.64,
        },
        {
          interestRate: 3,
          choiceflag: '1',
          buildProductColorPriceVos: [
            {
              colorName: 'whiteColor',
              price: 57.68,
            },
            {
              colorName: 'blankColor',
              price: 67.98,
            },
            {
              colorName: 'lightColor',
              price: 90.64,
            },
          ],
        },
        {
          lrl: '0(成本价)',
          bs: '白色',
          zs: '中色',
          cz: true,
        },
        {
          lrl: '10',
          bs: '白色1',
          zs: '中色1',
          cz: true,
        },
        {
          lrl: '10',
          bs: '白色1',
          zs: '中色1',
          cz: true,
        },
        {
          lrl: '10',
          bs: '白色1',
          zs: '中色1',
          cz: true,
        },
        {
          lrl: '10',
          bs: '白色1',
          zs: '中色1',
          cz: true,
        },
        {
          lrl: '10',
          bs: '白色1',
          zs: '中色1',
          whiteColor: 58.8,
          cz: true,
        },
      ],
      labelList: [
        {},
        {
          label: '白色',
          key: 'whiteColor',
        },
        {
          label: '中色',
          key: 'zs',
        },
      ],
      type: '', // 表单类型
      disabled: false,
      checked: true,
      textarea: '',
      // 表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '纱线编号',
            align: 'left',
            type: 'number',
            prop: 'list',
          },
          {
            label: '纱线编号',
            align: 'left',
            type: 'number',
            prop: 'list',
          },
          {
            label: '操作',
            align: 'left',
            type: 'number',
            prop: 'list',
          },
        ],
        data: [
          {
            price: 'SDFA111111',
            editFlag: false,
            list: [
              {
                delete: '删除',
                price: 1,
                type: number,
              },
              {
                delete: '删除',
                price: 1,
                type: number,
              },
              {
                delete: '删除',
                price: 1,
                type: number,
              },
            ],
            total: 10000,
          },
        ],
      },
      productDialogVisible: false,
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    colorc() {
      let obj = []
      let list = []
      this.colorlist.forEach((val) => {
        let pa = {}

        pa.interestRate = val.interestRate
        pa.choiceflag = val.choiceflag
        val.buildProductColorPriceVos.forEach((item, index) => {
          let hh = {}
          console.log(index)
          pa['color' + index] = item.price
          hh.key = 'color' + index
          hh.label = item.colorName
          list.push(hh)
        })
        obj.push(pa)
      })
      console.log(obj, list)
    },
    //输入计算
    handleCount(val) {
      console.log(val)
    },
    //合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '报价策略' && rowIndex === 0) {
        return [6, 1]
      }
    },
    add() {
      this.productDialogVisible = true
    },
    // 确定
    resetQuery(done) {
      this.componentList.forEach((i) => {
        const item = i
        if (item.input) {
          text += `${item.label}(${item.input}%);`
        }
      })
      this.salesmanFormInfo.component = text
      // done()
    },
    //取消
    handleClose(done) {
      this.productDialogVisible = false
    },
    deleteRow(row, index) {
      let ids = row.id
      // 删除接口 成功以后 this.editId = ''
      this.$confirm('确定删除这条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  created() {
    this.type = this.$route.query.type
  },
}
</script>
<style lang="scss" scoped>
.app-main {
  background: rgba(245, 247, 250, 1);
  margin-bottom: 80px;
  .title-box {
    position: relative;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    padding: 0 24px;
    .tit {
      padding: 20px 0;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #f3f3f3;
    }
    .tit-info {
      padding: 20px 0;
      font-weight: bold;
      span {
        margin-right: 80px;
      }
    }
  }
}
.container {
  margin: 24px;
  .card-box {
    position: relative;
    padding: 16px 16px 24px 16px;
    margin-bottom: 24px;
    border-radius: 8px;
    background-color: #fff;
    .title {
      color: rgba(0, 0, 0, 0.85);
      margin: 0 0 16px 0;
      font-weight: 600;
      text-align: left;
    }
    .info-list {
      padding: 6px 0;
      margin: 0 -10px;
      border-bottom: 1px solid rgba(243, 243, 243, 1);
      ::v-deep .el-input__inner {
        width: 80%;
      }
    }
    .checkbox {
      position: relative;
      .el-checkbox {
        line-height: 36px;
      }
    }
    .info-list:last-child {
      border-bottom: none;
    }
    .remarks-text {
      font-size: 22px;
      font-weight: bold;
      color: #ed7b2f;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      bottom: 0;
      margin: 0 -10px;
      border-left: 1px solid rgba(243, 243, 243, 1);
      .el-textarea {
        position: relative;
        height: 100%;
        ::v-deep.el-textarea__inner {
          width: 96%;
          position: absolute;
          top: 4%;
          left: 2%;
          height: 92%;
          border: 1px solid rgba(243, 243, 243, 1);
        }
      }
    }
    .computed {
      position: relative;
      .computed-item {
        width: 25%;
        display: inline-block;
        font-size: 22px;
        color: rgba(237, 123, 47, 1);
        font-weight: bold;
        span {
          display: inline-block;
          font-weight: normal;
          font-size: 16px;
          min-width: 60px;
          color: rgba(0, 0, 0, 0.85);
          vertical-align: top;
          padding-top: 1px;
        }
      }
    }
    .btn-box {
      margin-top: 24px;
      text-align: center;
      .el-button {
        border: 1px dashed rgba(38, 111, 232, 1);
        border-color: rgba(38, 111, 232, 1);
        color: rgba(38, 111, 232, 1);
      }
      .computed-btn {
        border: 1px solid rgba(237, 123, 47, 1);
        background-color: rgba(237, 123, 47, 1);
        color: #fff;
      }
    }
    .btn-box-left {
      text-align: left;
    }
  }
  .upload-img {
    display: flex;
    font-size: 14px;
    .flex {
      flex: 1;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  line-height: 80px;
  width: 100%;
  padding-right: 24px;
  background-color: #fff;
  text-align: right;
  box-shadow: 0 -1px 6px rgba(245, 247, 250, 0.6);
  z-index: 99;
  .sub-btn {
    background-color: rgba(0, 82, 217, 1);
    color: #fff;
  }
  .el-button {
    margin-left: 16px;
  }
}
.base-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
  .mark-textarea {
    width: calc(25% + 308px) !important;
    margin-right: 0 !important;
    ::v-deep .el-form-item__content {
      width: calc(100% - 90px);
    }
  }
  .fullWidth {
    width: 100%;
    ::v-deep .el-form-item__label {
      width: 110px;
      text-align: left;
    }
    ::v-deep .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
  .btn-group {
    margin: auto;
    display: flex;
    justify-content: center;
  }
}
.input-detail {
  ::v-deep .el-input__inner {
    border: 1px solid transparent;
    background: transparent;
    cursor: auto;
    color: #666;
  }
  ::v-deep .el-input-group__append {
    margin: 0;
    padding: 0;
    border-color: transparent;
    background: transparent;
  }
}
.select-detail {
  ::v-deep .el-input__inner {
    border: 1px solid transparent;
    background: transparent;
    color: #666;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
  ::v-deep .el-input.is-disabled .el-input__inner:hover {
    border-color: transparent;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
.unit-detail {
  color: #666;
  padding-left: 15px;
}
.multiple-detail {
  ::v-deep .el-form-item__content {
    width: calc(100% - 90px);
  }
}
.input-textarea-detail {
  ::v-deep .el-textarea__inner {
    width: 100%;
    border-color: transparent;
    background: transparent;
    cursor: auto;
  }
}
// 弹框样式
.dialog-contant {
  ::v-deep .el-dialog {
    border-radius: 8px;
    .el-dialog__title {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
    }
  }
  ::v-deep.el-dialog__body {
    padding-top: 0px;
  }
  .box {
    position: relative;
    ::v-deep.el-form-item {
      width: calc(25% - 10px);
      .el-form-item__label {
        font-weight: normal !important;
        color: rgba(36, 36, 36, 1);
      }
    }
    ::v-deep.el-form-item {
      width: calc(33% - 10px);
      .el-form-item__label {
        font-weight: normal !important;
        color: rgba(36, 36, 36, 1);
      }
    }
    .basic-info {
      position: relative;
      margin-bottom: 16px;
      .info {
        font-size: 16px;
        font-weight: bold;
        color: rgba(36, 36, 36, 1);
      }
      ul {
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          width: 33.33%;
          font-size: 14px;
          list-style-type: none;
          color: rgba(36, 36, 36, 1);
          margin-bottom: 12px;
          span {
            display: inline-block;
            text-align: right;
            min-width: 70px;
            color: rgba(139, 139, 139, 1);
            margin-right: 26px;
          }
        }
        li:first-child {
          width: 100%;
        }
      }
    }
    .bottom-btn {
      margin-top: 24px;
      text-align: center;
      .sub-btn {
        background-color: rgba(0, 82, 217, 1);
        border-color: rgba(0, 82, 217, 1);
      }
    }
    .el-button:last-child {
      margin-left: 16px;
    }
  }
}
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
  padding: 0;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #f3f3f3;
}

::v-deep .el-table tr:hover > td {
  background-color: #fff !important;
}

::v-deep.el-form-item {
  width: calc(25% - 10px);
  .el-form-item__label {
    font-weight: normal !important;
    color: rgba(36, 36, 36, 1);
  }
}
// 消除输入框右边上下箭头
::v-deep.numrule input::-webkit-outer-spin-button,
::v-deep.numrule input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep.numrule input[type='number'] {
  -moz-appearance: textfield;
}
.el-divider {
  background-color: rgba(243, 243, 243, 1);
}
</style>
