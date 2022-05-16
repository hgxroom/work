<!-- 报价计算 -->
<template>
  <div class="app-main">
    <div class="title-box">
      <div class="tit">成本报价计算</div>
      <div class="tit-info">
        <span>布号：{{ clothNo }}</span>
        <span>
          品名：60S 皮马棉 精梳 紧密纺+140D 晓星H350氨纶 89/11 弹力罗纹 15寸18针 840T 31*2CM 220G
        </span>
      </div>
    </div>
    <div class="container">
      <!-- 纱线成本 -->
      <div class="card-box">
        <p class="title">纱线成本</p>
        <el-table
          size="small"
          :span-method="yarnMethod"
          :data="yarnCostList"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column
            label="纱线编号"
            align="left"
            prop="yarnNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="纱线品名"
            align="left"
            prop="yarnName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="纱支比例（%）"
            align="left"
            prop="yarnRatio"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="纱线价格"
            align="center"
            prop="yarnCost"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-input
                size="small"
                class="numrule"
                placeholder="请输入内容"
                @change="handleCount(scope)"
                v-model="scope.row.yarnCost"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="纱线总成本"
            align="center"
            prop="yarnCost"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <div>{{ yarnCostTotal }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 织布成本 -->
      <div class="card-box">
        <p class="title">织布成本</p>
        <el-table
          size="small"
          :data="weavingCostList"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column
            label="织费"
            align="center"
            prop="weavingFee"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-input
                size="small"
                class="numrule"
                placeholder="请输入内容"
                @change="handleweaving(scope)"
                v-model="scope.row.weavingFee"
              >
              </el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="织造损耗（%）"
            align="left"
            prop="weavingLoss"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="毛坯成本（元）"
            align="center"
            prop="blankCost"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </div>
      <!-- 染色成本 -->
      <div class="card-box">
        <p class="title">染色成本</p>
        <el-table
          size="small"
          :data="dyeingCostList"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column
            label="颜色"
            align="left"
            prop="colorName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="作业类型"
            align="left"
            prop="jobType"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-select
                v-model="dyeingCostList[scope.$index].jobType"
                placeholder="请选择"
                style="width: 100%"
                @change="jobchange()"
              >
                <el-option
                  v-for="(dicts, index) in dict.type.job_type"
                  :key="index"
                  :label="dicts.label"
                  :value="dicts.label"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="染整损耗"
            align="left"
            prop="dyeingLoss"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="染费"
            align="center"
            prop="dyeingFee"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </div>
      <!-- 特整成本 -->
      <div class="card-box">
        <p class="title">特整成本</p>
        <el-table
          size="small"
          :span-method="specialMethod"
          :data="specialFinishingList"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="操作" width="112px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="deleteRow(scope.row, scope.$index, 'special')"
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="工艺"
            align="left"
            prop="processName"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-select
                v-model="specialFinishingList[scope.$index].processName"
                placeholder="请选择"
                style="width: 100%"
                @change="handleType(scope, scope.$index, $event)"
              >
                <el-option
                  v-for="(dict, index) in specialList"
                  :key="index"
                  :label="dict.processName"
                  :value="dict.processName"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="工费"
            align="left"
            prop="laborCost"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="特整损耗"
            align="center"
            prop="extraLoss"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="特整总损耗(%)"
            align="center"
            prop="extraWholeLoss"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <div>{{ extraWholeLoss }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="特整总成本(元)"
            align="center"
            prop="extraWholeCost"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <div>{{ extraWholeCost }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="add_info">
          <el-button @click="addSpecial">添加工艺</el-button>
        </div>
      </div>
      <!-- 功能性成本 -->
      <div class="card-box">
        <p class="title">功能性成本</p>
        <el-table
          size="small"
          :span-method="functionMethod"
          :data="functionCostList"
          style="width: 100%; font-size: 14px; color: #242424; border-color: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="操作" width="112px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="deleteRow(scope.row, scope.$index, 'function')"
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="功能性承诺"
            align="left"
            prop="processName"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-select
                v-model="functionCostList[scope.$index].functionalCommitmentName"
                placeholder="请选择"
                style="width: 100%"
                @change="handleFunc(scope, scope.$index, $event)"
              >
                <el-option
                  v-for="(dict, index) in functionList"
                  :key="index"
                  :label="dict.commitmentName"
                  :value="dict.commitmentName"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="工费(元)"
            align="left"
            prop="laborCost"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="功能性总成本(元)"
            align="center"
            prop="functionCostTotal"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <div>{{ functionCostTotal }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="add_info">
          <el-button @click="addFunction">添加功能性承诺</el-button>
        </div>
      </div>
      <!-- 最终成本报价 -->
      <div class="card-box">
        <p class="title">最终报价</p>
        <div class="computed">
          <p class="computed-item" v-for="(item, index) in finalQuotedList" :key="index">
            <span>{{ item.colorName }}：</span>{{ item.costPrice }}
          </p>
        </div>
        <div class="btn-box btn-box-left">
          <el-button @click="add" class="computed-btn">计算报价</el-button>
        </div>
      </div>
      <div class="footer">
        <el-button @click="cancel" class="save-btn">取消</el-button>
        <el-button @click="submit" class="sub-btn">确认报价</el-button>
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
import {
  findQuotedProduct,
  getTableDataInfoToAble,
  getFunctionalCommitmentByName,
  calcQuotedPrice,
} from '@/api/finance/report'
export default {
  dicts: [
    'job_type', //作业类型
  ],
  data() {
    return {
      clothNo: 'YL00056', //布号
      quotedOrderNo: 'BJ-005', //报价单号
      type: '', // 表单类型
      disabled: false,
      //最终成本报价数据
      finalQuotedList: [],
      //功能性成本数据
      functionCostList: [],
      functionCostTotal: '',
      //特整成本数据
      specialFinishingList: [],
      extraWholeCost: [],
      extraWholeLoss: [],
      //织布成本数据
      weavingCostList: [],
      //染色成本数据
      dyeingCostList: [],
      //纱线成本数据
      yarnCostList: [],
      yarnCostTotal: [],
      // 纱线成本表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '颜色',
            align: 'left',
            type: 'text',
            prop: 'colorName',
          },
          {
            label: '作业类型',
            align: 'left',
            type: 'number',
            prop: 'jobType',
          },
          {
            label: '染整损耗',
            align: 'left',
            type: 'number',
            prop: 'dyeingLoss',
          },
          {
            label: '染费',
            align: 'left',
            type: 'number',
            prop: 'dyeingFee',
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
      //特殊工艺
      specialList: [],
      //功能性承诺
      functionList: [],
      productDialogVisible: false,
    }
  },

  components: {},

  computed: {},

  mounted() {},
  created() {
    this.type = this.$route.query.type
    this.quotedOrderNo = this.$route.query.quotedOrderNo
    this.clothNo = this.$route.query.clothNo
    console.log(this.dict)
    this.getlist()
    this.getCheckList()
  },
  methods: {
    add() {},
    //确认报价
    submit() {
      let data = {}
      data.clothNo = this.clothNo
      data.dyeingCostDtoList = this.dyeingCostList
      data.extraWholeCost = this.extraWholeCost
      data.extraWholeLoss = this.extraWholeLoss
      data.finalCostQuotedDtoList = this.finalQuotedList
      data.functionCostDtoList = this.functionCostList
      data.functionCostTotal = this.functionCostTotal
      data.quotedOrderNo = this.quotedOrderNo
      data.specialDtoList = this.specialFinishingList
      data.weavingCostDtoList = this.weavingCostList
      data.yarnCostDtoList = this.yarnCostList
      data.yarnCostTotal = this.yarnCostTotal
      console.log(data)
      calcQuotedPrice(data).then((res) => {
        let url = '/finance/reportDetail'
        this.$router.push({
          path: url,
          query: { type: 'detail', quotedOrderNo: this.$route.query.quotedOrderNo },
        })
      })
    },
    cancel(val) {
      let url = '/finance/reportDetail'
      this.$router.push({
        path: url,
        query: { type: 'detail', quotedOrderNo: this.$route.query.quotedOrderNo },
      })
    },
    //删除工艺
    deleteRow(row, index, type) {
      // 删除接口 成功以后 this.editId = ''
      this.$confirm('确定删除这条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (type == 'special') {
            this.specialFinishingList.splice(index, 1)
            this.handleType()
          } else if (type == 'function') {
            this.functionCostList.splice(index, 1)
            this.handleFunc()
          }
          console.log(row, index)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //添加工艺
    addSpecial() {
      let params = {
        extraLoss: '',
        laborCost: '',
        processName: '',
      }
      if (!this.specialFinishingList) {
        this.specialFinishingList = []
      }
      this.specialFinishingList.push(params)
    },
    //添加功能性承诺
    addFunction() {
      let params = {
        functionalCommitmentName: '',
        laborCost: '',
      }
      this.functionCostList.push(params)
    },
    //功能性改变
    handleFunc(scope, index, evt) {
      let cost = 0
      this.functionList.forEach((val) => {
        if (val.commitmentName == evt) {
          this.functionCostList[index].laborCost = val.laborCost
        }
      })
      this.functionCostList.forEach((item) => {
        cost = item.laborCost + cost
      })
      this.functionCostTotal = cost
    },
    //工艺改变
    handleType(scope, index, evt) {
      let cost = 0
      let loss = 0
      this.specialList.forEach((val) => {
        if (val.processName == evt) {
          this.specialFinishingList[index].laborCost = val.laborCost
          this.specialFinishingList[index].extraLoss = val.loss
        }
      })
      this.specialFinishingList.forEach((item) => {
        cost = item.laborCost + cost
        loss = item.extraLoss + loss
      })
      this.extraWholeCost = cost
      this.extraWholeLoss = loss
    },
    //获取工艺和功能性承诺
    getCheckList() {
      getTableDataInfoToAble().then((res) => {
        console.log(res)
        this.specialList = res.data
      })
      getFunctionalCommitmentByName().then((res) => {
        console.log(res)
        this.functionList = res.data
      })
    },
    //织费变化
    handleweaving(scope) {
      this.weavingCostList[scope.$index].blankCost =
        Number(this.weavingCostList[scope.$index].weavingFee) +
        this.yarnCostTotal +
        (this.yarnCostTotal * this.weavingCostList[scope.$index].weavingLoss) / 100
    },
    //纱线价格变化
    handleCount(scope) {
      let count = 0
      this.yarnCostList.forEach((val) => {
        count = count + Number(val.yarnCost)
      })
      this.yarnCostTotal = count
      console.log(scope, this.yarnCostList)
    },
    //工艺合并单元格
    specialMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '特整总损耗(%)' && rowIndex === 0 && this.specialFinishingList) {
        return [this.specialFinishingList.length, 1]
      }
      if (column.label == '特整总成本(元)' && rowIndex === 0 && this.specialFinishingList) {
        return [this.specialFinishingList.length, 1]
      }
    },
    //功能性成本合并单元格
    functionMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '功能性总成本(元)' && rowIndex === 0) {
        return [this.functionCostList.length, 1]
      }
    },
    //纱线合并单元格
    yarnMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '纱线总成本' && rowIndex === 0) {
        return [this.yarnCostList.length, 1]
      }
    },
    //作业类类型改变
    jobchange() {
      console.log('123', this.dyeingCostList)
    },
    //获取基本数据
    getlist() {
      let data = {
        clothNo: this.clothNo,
        quotedOrderNo: this.quotedOrderNo,
      }
      findQuotedProduct(data).then((res) => {
        this.dyeingCostList = res.data.dyeingCostList
        // this.productYarnVoData = res.data.productYarnVo
        this.yarnCostList = res.data.productYarnVo.yarnCostList
        this.yarnCostTotal = res.data.productYarnVo.yarnCostTotal
        this.weavingCostList = res.data.weavingCostList
        this.specialFinishingList = res.data.specialVo.specialFinishingList
        this.extraWholeCost = res.data.specialVo.extraWholeCost
        this.extraWholeLoss = res.data.specialVo.extraWholeLoss
        this.functionCostList = res.data.functionCostVo.functionCostList
        this.functionCostTotal = res.data.functionCostVo.functionCostTotal
        this.finalQuotedList = res.data.finalQuotedList
      })
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
      padding: 16px 0;
      margin: 0 -10px;
      border-bottom: 1px solid rgba(243, 243, 243, 1);
      ::v-deep .el-input__inner {
        width: 80%;
      }
    }
    .delete-btn {
      .el-button {
        height: 36px;
      }
    }
    .info-list:last-child {
      border-bottom: none;
    }
    .total-num {
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
      span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
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
.add_info {
  text-align: center;
  margin-top: 20px;
  .el-button {
    border: 1px dashed #dcdfe6;
    color: #266fe8;
  }
}
</style>
