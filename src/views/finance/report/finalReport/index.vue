<template>
  <div class="app-main">
    <div class="title-box">
      <div class="tit">销售报价</div>
      <div class="tit-info">
        <span>布号：{{ newClothNo }}</span>
        <span> 品名：{{ pm }} </span>
      </div>
    </div>
    <div class="container">
      <div class="card-box">
        <p class="title">最终报价</p>
        <el-table
          size="small"
          :data="datalist"
          :span-method="arraySpanMethod"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="利润率(%)" align="center" prop="interestRate">
            <template v-slot="scope">
              <el-input
                v-if="!(scope.$index === 0)"
                size="small"
                type="number"
                class="numrule"
                placeholder="请输入内容"
                @change="handleCount(scope)"
                v-model="scope.row.interestRate"
              >
              </el-input>
              <div v-else>{{ scope.row.interestRate }}(成本价)</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="利润率(%)" align="center" prop="lrl" :show-overflow-tooltip="true"> -->
          <!-- </el-table-column> -->

          <el-table-column
            v-for="(val, index) in labelList"
            :key="index"
            :label="val.label"
            align="center"
            :prop="val.key"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <div v-if="scope.$index === 0">{{ scope.row[val.key] }}(元/kg)</div>
              <div v-else>{{ scope.row[val.key] }}({{ reportData.settlementMethod }})</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" prop="lrl">
            <template v-slot="scope">
              <div class="info-list checkbox" v-if="scope.$index === 0">
                <div>-</div>
              </div>
              <div class="info-list checkbox" v-else>
                <el-checkbox
                  v-model="scope.row.choiceflag"
                  @change="handlecheck(scope)"
                ></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="报价策略" align="center">
            <template v-slot="scope">
              <div class="remarks-text">
                <el-input
                  type="textarea"
                  maxlength="50"
                  :rows="5"
                  placeholder="请输入报价策略"
                  v-model="reportData.quotationStrategy"
                >
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
          :data="formHistoryData.data"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          highlight-current-row
          header-row-class-name="tableHeader"
        >
          <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
          <el-table-column
            v-for="(item, index) in formHistoryData.columns"
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
          <el-table-column label="纱线编号" width="120px">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderYarnCostList"
                :key="index"
              >
                {{ item.yarnNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="纱线品名">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderYarnCostList"
                :key="index"
                :title="item.yarnName"
              >
                {{ item.yarnName }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="纱线品名">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.quotedOrderYarnCostList" :key="index">
                {{ item.yarnName }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="纱线价格">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderYarnCostList"
                :key="index"
              >
                {{ item.yarnCost }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="颜色">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderPriceVoList"
                :key="index"
              >
                {{ item.colorName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="成本价(元/kg)" width="110px">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderPriceVoList"
                :key="index"
              >
                {{ item.costPrice }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="'销售报价1' + settlementMethod" width="130px">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderPriceVoList"
                :title="
                  item.finalQuotedPrice1 ? item.finalQuotedPrice1 + scope.row.settlementMethod : ''
                "
                :key="index"
              >
                {{
                  item.finalQuotedPrice1 ? item.finalQuotedPrice1 + scope.row.settlementMethod : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="利润率(%)" width="90px" align="center">
            <template v-slot="scope">
              <div>
                {{ scope.row.quotedOrderPriceVoList[0].interestRate1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="'销售报价2' + settlementMethod" width="130px">
            <template v-slot="scope">
              <div
                class="tab-div"
                :title="
                  item.finalQuotedPrice2 ? item.finalQuotedPrice2 + scope.row.settlementMethod : ''
                "
                v-for="(item, index) in scope.row.quotedOrderPriceVoList"
                :key="index"
              >
                {{
                  item.finalQuotedPrice2 ? item.finalQuotedPrice2 + scope.row.settlementMethod : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="利润率(%)" width="90px" align="center">
            <template v-slot="scope">
              <div>
                {{ scope.row.quotedOrderPriceVoList[0].interestRate2 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="'销售报价3' + settlementMethod" width="130px">
            <template v-slot="scope">
              <div
                class="tab-div"
                v-for="(item, index) in scope.row.quotedOrderPriceVoList"
                :title="
                  item.finalQuotedPrice3 ? item.finalQuotedPrice3 + scope.row.settlementMethod : ''
                "
                :key="index"
              >
                {{
                  item.finalQuotedPrice3 ? item.finalQuotedPrice3 + scope.row.settlementMethod : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="利润率(%)" width="90px" align="center">
            <template v-slot="scope">
              <div>
                {{ scope.row.quotedOrderPriceVoList[0].interestRate3 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="客户" prop="customerName"></el-table-column>
          <el-table-column label="提交人" prop="createBy"></el-table-column>
        </el-table>
      </div>
      <div class="card-box">
        <p class="title">历史订单信息</p>
        <el-table
          size="small"
          :data="formHistoryOrderData.data"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          highlight-current-row
          header-row-class-name="tableHeader"
        >
          <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
          <el-table-column
            v-for="(item, index) in formHistoryOrderData.columns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align"
          >
            <template v-slot="scope">
              <el-popover
                trigger="hover"
                placement="top"
                popper-class="popper-class"
                :visible-arrow="false"
              >
                <p style="max-width: 400px; margin: 0">{{ scope.row[item.prop] }}</p>
                <div slot="reference" :class="item.prop == 'pm' ? 'content-colum' : ''">
                  {{ scope.row[item.prop] }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="cancel" class="save-btn">取消</el-button>
        <el-button @click="submit" class="sub-btn">确认报价</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { number } from 'echarts/lib/export'
import {
  getBuildProductSaledByNo,
  getQuotedListByNewClothNo,
  buildProductFinalSale,
  findProductOrderDetailByBh,
} from '@/api/finance/report'
export default {
  data() {
    return {
      reportData: {},
      drawbackCoefficient: '', //退税系数
      meterWeight: null, //米重
      weightFactor: null, //重量系数
      exchangeRate: '', //汇率
      settlementMethod: '', //结算方式
      newClothNo: '', //布号
      pm: '', //品名
      quotedOrderNo: '', //报价单号
      remark: '',
      //表格渲染数据
      datalist: [],
      //表格头列表
      labelList: [],
      type: '', // 表单类型
      disabled: false,
      checked: true,
      textarea: '',
      // 历史报价信息
      formHistoryData: {
        sel: null, // 选中行
        columns: [
          {
            label: '报价时间',
            align: 'left',
            type: 'text',
            width: '160px',
            prop: 'createTime',
          },
          {
            label: '布号',
            align: 'left',
            type: 'text',
            width: '140px',
            prop: 'clothNo',
          },
          {
            label: '毛坯成本',
            align: 'left',
            type: 'text',
            prop: 'blankCost',
          },
        ],
        data: [],
      },
      // 历史订单信息
      formHistoryOrderData: {
        sel: null, // 选中行
        columns: [
          {
            label: '订单时间',
            align: 'left',
            type: 'text',
            prop: 'bzhrq',
            width: 150,
          },
          {
            label: '订单号',
            align: 'left',
            type: 'text',
            prop: 'ddh',
          },
          {
            label: '布号',
            align: 'left',
            type: 'text',
            prop: 'bh',
          },
          {
            label: '品名',
            align: 'left',
            type: 'text',
            prop: 'pm',
          },
          {
            label: '色号',
            align: 'left',
            type: 'text',
            prop: 'sh',
          },
          {
            label: '色称',
            align: 'left',
            type: 'text',
            prop: 'sc',
          },
          {
            label: '单价',
            align: 'left',
            type: 'text',
            prop: 'price',
          },
          {
            label: '结算单位',
            align: 'left',
            type: 'text',
            prop: 'jsdw',
          },
          {
            label: '成品重量',
            align: 'left',
            type: 'text',
            prop: 'cpzl',
          },
          {
            label: '客户',
            align: 'left',
            type: 'text',
            prop: 'khmch',
          },
          {
            label: '业务员',
            align: 'left',
            type: 'text',
            prop: 'ywy',
          },
        ],
        data: [],
      },
      productDialogVisible: false,
    }
  },

  components: {},

  computed: {},

  mounted() {},
  created() {
    this.type = this.$route.query.type
    this.newClothNo = this.$route.query.clothNo
    this.quotedOrderNo = this.$route.query.quotedOrderNo
    this.pm = this.$route.query.pm
    this.getList()
    this.getHistory()
    this.getHistoryOrder()
  },
  methods: {
    //选中
    handlecheck(scope, submit) {
      let num = 0
      this.datalist.forEach((val) => {
        if (val.choiceflag) {
          num = num + 1
        }
      })
      if (submit) {
        if (num === 0) {
          return false
        } else {
          return true
        }
      }
      if (num > 3) {
        this.$message.error('最终报价最多只能选择三个！')
        this.datalist[scope.$index].choiceflag = false
      }
    },

    //提交
    submit() {
      if (!this.handlecheck('scope', 'submit')) {
        return this.$message.error('最终报价最少要选择一个！')
      }
      this.datalist.forEach((val, index) => {
        this.reportData.buildProductFinalSaleVos[index].choiceflag = val.choiceflag
        this.reportData.buildProductFinalSaleVos[index].interestRate = val.interestRate
        this.labelList.forEach((item, ind) => {
          if (
            item.label ==
            this.reportData.buildProductFinalSaleVos[index].buildProductColorPriceVos[ind].colorName
          ) {
            this.reportData.buildProductFinalSaleVos[index].buildProductColorPriceVos[ind].price =
              val[item.key]
          }
        })
      })
      this.reportData.quotedOrderNo = this.quotedOrderNo || ''
      this.reportData.newClothNo = this.newClothNo || ''
      buildProductFinalSale(this.reportData).then((res) => {
        let quotedOrderNo = this.$route.query.quotedOrderNo
        const obj = { path: `/finance/reportDetail?type=detail&quotedOrderNo=${quotedOrderNo}` }
        this.$tab.closeOpenPage(obj)
      })
    },
    cancel(val) {
      let quotedOrderNo = this.$route.query.quotedOrderNo
      const obj = { path: `/finance/reportDetail?type=detail&quotedOrderNo=${quotedOrderNo}` }
      this.$tab.closeOpenPage(obj)
    },
    // 历史报价
    getHistory() {
      const { newClothNo } = this
      let data = {}
      data = {
        newClothNo: newClothNo,
      }
      getQuotedListByNewClothNo(data).then((res) => {
        this.formHistoryData.data = res.data
        if (res.data.settlementMethod) {
          this.settlementMethod = res.data.settlementMethod
        }

        console.log(res, this.settlementMethod)
      })
    },
    // 历史订单信息
    getHistoryOrder() {
      const { newClothNo } = this
      findProductOrderDetailByBh(newClothNo).then((res) => {
        this.formHistoryOrderData.data = res.data
        // console.log(res)
      })
    },
    //最终报价数据
    getList() {
      const { newClothNo, quotedOrderNo } = this
      let data = {}
      data = {
        newClothNo: newClothNo,
        quotedOrderNo: quotedOrderNo,
      }
      getBuildProductSaledByNo(data).then((res) => {
        this.reportData = res.data
        this.ReData(res.data.buildProductFinalSaleVos)
        console.log(this.reportData)
      })
    },
    ReData(val) {
      let obj = []
      let list = []
      val.forEach((val, inx) => {
        let pa = {}
        pa.interestRate = val.interestRate
        pa.choiceflag = val.choiceflag
        val.buildProductColorPriceVos.forEach((item, index) => {
          let hh = {}
          pa['color' + index] = item.price
          if (inx === 0) {
            hh.key = 'color' + index
            hh.label = item.colorName
            this.labelList.push(hh)
          }
        })
        this.datalist.push(pa)
      })
    },
    //输入计算
    handleCount(val) {
      console.log(val)
      this.computeWay(this.reportData.settlementMethod, val.$index)
    },
    //销售报价计算
    computeWay(type, index) {
      let reportNum = null
      switch (type) {
        case '元/kg':
          this.labelList.forEach((element) => {
            this.datalist[index][element.key] = (
              this.datalist[0][element.key] *
              (1 + this.datalist[index].interestRate / 100) *
              this.reportData.weightFactor
            ).toFixed(4)
          })
          break
        case '元/米':
          this.labelList.forEach((element) => {
            this.datalist[index][element.key] = (
              (this.datalist[0][element.key] *
                this.reportData.meterWeight *
                (1 + this.datalist[index].interestRate / 100) *
                this.reportData.weightFactor) /
              1000
            ).toFixed(4)
          })
          break

        case '美元/kg':
          this.labelList.forEach((element) => {
            this.datalist[index][element.key] = (
              (this.datalist[0][element.key] /
                this.reportData.drawbackCoefficient /
                this.reportData.exchangeRate) *
              (1 + this.datalist[index].interestRate / 100) *
              this.reportData.weightFactor
            ).toFixed(4)
          })
          break
        case '美元/磅':
          this.labelList.forEach((element) => {
            this.datalist[index][element.key] = (
              (this.datalist[0][element.key] /
                this.reportData.drawbackCoefficient /
                this.reportData.exchangeRate /
                2.2046) *
              (1 + this.datalist[index].interestRate / 100) *
              this.reportData.weightFactor
            ).toFixed(4)
          })
          break
        case '美元/码':
          this.labelList.forEach((element) => {
            this.datalist[index][element.key] = (
              (this.datalist[0][element.key] /
                this.reportData.meterWeight /
                1000 /
                1.1 /
                this.reportData.exchangeRate) *
              0.9144 *
              (1 + this.datalist[index].interestRate / 100) *
              this.reportData.weightFactor
            ).toFixed(4)
          })
          break
        default:
          break
      }
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
          max-height: 92%;
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
  // padding: 0;
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
  text-align: center;
}
.el-divider {
  background-color: rgba(243, 243, 243, 1);
}
.tab-div {
  border-bottom: 1px solid #dfe6ec;
  margin: 0 -10px;
  padding: 8px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tab-divline {
  padding-left: 0;
  margin-left: 0px;
}
.tab-divline2 {
  padding-right: 0;
  margin-right: 0px;
}
.tab-div:last-child {
  border-bottom: none;
}
.content-colum {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* for Opera */
}
</style>
<style>
.popper-class {
  background-color: rgba(48, 49, 51, 0.95);
  color: #fff;
}
</style>
