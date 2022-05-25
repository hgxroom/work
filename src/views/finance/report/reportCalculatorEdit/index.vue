<!-- 报价计算 -->
<template>
  <div class="app-main">
    <div class="title-box">
      <!-- <div class="tit">{{ type == 'edit' ? '成本报价计算' : '报价详情' }}</div> -->
      <div class="tit-info">
        <span>布号：{{ clothNo }}</span>
        <span> 品名：{{ yarnName }} </span>
      </div>
      <div class="tit-info2">
        <span>备注：{{ remark }}</span>
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
          >
            <template v-slot="scope">
              <div class="hostory-box" @click="history(scope.row.yarnNo)">
                <div>{{ scope.row.yarnNo }}</div>
                <div v-if="type == 'edit'" class="el-icon-search font">历史纱价</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="纱线品名"
            align="left"
            prop="yarnName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="纱支比例(%)"
            align="left"
            prop="yarnRatio"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="纱线价格"
            align="left"
            prop="yarnCost"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <el-input
                size="small"
                :disabled="type == 'detail' ? true : false"
                :class="[type == 'detail' ? 'input-detail' : '']"
                type="number"
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
              <div class="total-num">{{ yarnCostTotal }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-row class="card-box" style="display: flex">
          <el-col :span="8">
            <p class="title">纱线成本</p>
            <el-form class="base-form" ref="queryForm" label-width="90px" :inline="true">
              <el-form-item label="织费">
                <el-input
                  v-model="weavingCostList[0].weavingFee"
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'input-detail' : '']"
                  size="small"
                  type="number"
                  class="numrule"
                  placeholder="请输入内容"
                  @change="handleweaving($event)"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="作业类型">
                <el-select
                  v-model="dyeingCostList[0].jobType"
                  placeholder="请选择"
                  style="width: 100%"
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'select-detail' : '']"
                  @change="handleJob($event)"
                >
                  <el-option
                    v-for="(dicts, index) in dict.type.job_type"
                    :key="index"
                    :label="dicts.label"
                    :value="dicts.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工艺">
                <el-select
                  v-model="splList"
                  multiple
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'select-detail' : '']"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="handleType($event)"
                >
                  <el-option
                    v-for="(dict, index) in specialList"
                    :key="index"
                    :label="dict.processName"
                    :value="dict.processName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="功能性承诺">
                <el-select
                  v-model="funList"
                  multiple
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'select-detail' : '']"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="handleFunc($event)"
                >
                  <el-option
                    v-for="(dict, index) in functionList"
                    :key="index"
                    :label="dict.commitmentName"
                    :value="dict.commitmentName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="1" style="display: flex; justify-content: center">
            <div style="border-left: 18px solid #f5f7fa"></div>
          </el-col>
          <el-col :span="15" style="">
            <p class="title">最终报价</p>
            <div class="computed">
              <p class="computed-item" v-for="(item, index) in finalQuotedList" :key="index">
                <span>{{ item.colorName }}：</span>{{ item.costPrice }}
              </p>
            </div>
            <div class="btn-box btn-box-left">
              <el-button @click="reportCalculator" class="computed-btn">计算报价</el-button>
            </div>
          </el-col>
        </el-row>
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

      <div class="footer" v-if="type == 'edit'">
        <el-button @click="cancel" class="save-btn">取消</el-button>
        <el-button @click="submit" :disabled="reportBtn" class="sub-btn">确认报价</el-button>
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
          <p class="info">{{ historyYarnNo }}</p>
        </div>
        <el-table
          size="small"
          :data="historyList"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
          <el-table-column
            label="纱线编号"
            align="left"
            prop="yarnNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="纱价(元)"
            align="left"
            prop="yarnCost"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column
            label="客户"
            align="left"
            prop="customerName"
            :show-overflow-tooltip="true"
          /> -->
          <el-table-column
            label="报价时间"
            align="left"
            prop="quotedTime"
            :show-overflow-tooltip="true"
          />
        </el-table>
        <!-- <div class="bottom-btn">
          <el-button class="cancel-btn" @click="handleClose">取消</el-button>
          <el-button class="sub-btn" type="primary" @click="resetQuery">确认</el-button>
        </div> -->
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
  getDyeingFeeDataByJobStatus,
  getHistoricalQuoted,
  getQuotedListByNewClothNo,
} from '@/api/finance/report'
export default {
  dicts: [
    'job_type', //作业类型
  ],
  data() {
    return {
      remark: '', //备注
      jobTypeList: [], //选中作业类型
      splList: [], //选中工艺
      funList: [], //选中功能性
      historyYarnNo: '',
      //历史纱价
      historyList: [],
      yarnName: '', //品名
      component: '', //成分
      reportBtn: true, //是否能点击确认报价按钮
      clothNo: '', //布号
      quotedOrderNo: '', //报价单号
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
      weavingCostList: [
        {
          weavingFee: '', //织费
          blankCost: '', //毛坯成本
          weavingLoss: '2.5', //织造损耗
        },
      ],
      //染色成本数据
      dyeingCostList: [],
      //纱线成本数据
      yarnCostList: [],
      yarnCostTotal: [],
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
      settlementMethod: '',
    }
  },

  components: {},

  computed: {},

  mounted() {},
  created() {
    this.type = this.$route.query.type
    this.quotedOrderNo = this.$route.query.quotedOrderNo
    this.clothNo = this.$route.query.clothNo
    this.component = this.$route.query.component
    this.yarnName = this.$route.query.yarnName
    this.remark = this.$route.query.remark
    const obj = Object.assign({}, this.$route, {
      title: `成本报价`,
    })
    if (this.type == 'detail') {
      obj.meta.title = '报价详情'
    }
    this.$tab.updatePage(obj)
    this.getlist()
    this.getCheckList()
    this.getHistory()
  },
  methods: {
    // 历史报价
    getHistory() {
      const { clothNo } = this
      let data = {}
      data = {
        newClothNo: clothNo,
      }
      getQuotedListByNewClothNo(data).then((res) => {
        this.formHistoryData.data = res.data
        if (res.data.settlementMethod) {
          this.settlementMethod = res.data.settlementMethod
        }
      })
    },
    //历史报价
    history(val) {
      getHistoricalQuoted(val).then((res) => {
        console.log(res)
        this.productDialogVisible = true
        this.historyList = res.data
        this.historyYarnNo = res.data[0].yarnName
      })
    },
    //计算报价
    reportCalculator() {
      if (this.validate()) {
        return
      }
      //(毛胚成本+染费+特整总成本+功能性总成本)*(1+染整损耗+特整总损耗)
      this.reportBtn = false
      this.dyeingCostList.forEach((item, index) => {
        this.finalQuotedList.forEach((val) => {
          if (item.colorName == val.colorName) {
            val.costPrice =
              (Number(this.weavingCostList[0].blankCost) +
                this.dyeingCostList[index].dyeingFee +
                this.functionCostTotal +
                this.extraWholeCost) *
              (1 + this.extraWholeLoss / 100 + this.dyeingCostList[index].dyeingLoss / 100)
            val.costPrice = Number(val.costPrice).toFixed(4)
          }
        })
      })
    },
    //校验
    validate() {
      let nextBtn = false
      this.yarnCostList.forEach((val) => {
        if (!val.yarnCost && !nextBtn) {
          nextBtn = true
          return this.$message.error(`请将纱线价格填写完整`)
        }
      })
      if (!this.weavingCostList[0].weavingFee && !nextBtn) {
        nextBtn = true
        return this.$message.error(`请填写织费`)
      }
      if (!this.dyeingCostList[0].jobType && !nextBtn) {
        nextBtn = true
        return this.$message.error(`请选择作业类型`)
      }
      if (this.specialFinishingList.length > 0 && !nextBtn) {
        this.specialFinishingList.forEach((val) => {
          if (!val.processName) {
            nextBtn = true
            return this.$message.error(`工艺选择不能为空`)
          }
        })
      }
      if (this.functionCostList.length > 0 && !nextBtn) {
        this.functionCostList.forEach((val) => {
          if (!val.functionalCommitmentName) {
            nextBtn = true
            return this.$message.error(`功能性承诺选择不能为空`)
          }
        })
      }
      return nextBtn
    },
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
        let quotedOrderNo = this.$route.query.quotedOrderNo
        const obj = { path: `/finance/reportDetail?type=detail&quotedOrderNo=${quotedOrderNo}` }
        this.$tab.closeOpenPage(obj)
        // let url = '/finance/reportDetail'
        // this.$router.push({
        //   path: url,
        //   query: { type: 'detail', quotedOrderNo: this.$route.query.quotedOrderNo },
        // })
      })
    },
    cancel(val) {
      // let url = '/finance/reportDetail'
      let quotedOrderNo = this.$route.query.quotedOrderNo
      const obj = { path: `/finance/reportDetail?type=detail&quotedOrderNo=${quotedOrderNo}` }
      this.$tab.closeOpenPage(obj)
      // this.$router.push({
      //   path: url,
      //   query: { type: 'detail', quotedOrderNo: this.$route.query.quotedOrderNo },
      // })
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
      this.reportBtn = true
      this.specialFinishingList.push(params)
    },
    //添加功能性承诺
    addFunction() {
      let params = {
        functionalCommitmentName: '',
        laborCost: '',
      }
      this.reportBtn = true
      this.functionCostList.push(params)
    },
    //功能性改变
    handleFunc(evt) {
      this.reportBtn = true
      let cost = 0
      //重新生成功能性数据结构
      this.functionCostList = []
      evt.forEach((item, index) => {
        let params = {
          functionalCommitmentName: item,
          laborCost: '',
        }
        this.functionCostList.push(params)
      })
      //遍历赋值
      this.functionCostList.forEach((item, ind) => {
        this.functionList.forEach((val) => {
          if (val.commitmentName == item.functionalCommitmentName) {
            item.laborCost = val.laborCost
          }
        })
      })
      this.functionCostList.forEach((item) => {
        cost = item.laborCost + cost
      })
      this.functionCostTotal = cost
    },
    //工艺改变
    handleType(evt) {
      let cost = 0
      let loss = 0
      this.reportBtn = true
      //重新生成工艺数据结构
      this.specialFinishingList = []
      evt.forEach((item, index) => {
        let params = {
          extraLoss: '',
          laborCost: '',
          processName: item,
        }
        this.specialFinishingList.push(params)
      })
      //遍历赋值
      this.specialFinishingList.forEach((item, ind) => {
        this.specialList.forEach((val) => {
          if (val.processName == item.processName) {
            item.laborCost = val.laborCost
            item.extraLoss = val.loss
          }
        })
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
      if (!this.yarnCostTotal) {
        return this.$message.error(`请将纱线价格填写完整`)
      }
      Number(this.yarnCostTotal)
      this.reportBtn = true
      let cost =
        Number(this.weavingCostList[0].weavingFee) +
        Number(this.yarnCostTotal) +
        (Number(this.yarnCostTotal) * this.weavingCostList[0].weavingLoss) / 100
      this.weavingCostList[0].blankCost = cost.toFixed(4)
    },
    //纱线价格变化
    handleCount(scope) {
      let count = 0
      this.reportBtn = true
      this.yarnCostList.forEach((val) => {
        count = count + Number(val.yarnCost) * Number(val.yarnRatio / 100)
      })
      this.yarnCostTotal = count.toFixed(4)
      if (this.weavingCostList[0].blankCost) {
        this.handleweaving()
      }
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
    handleJob(evt) {
      // console.log(evt)
      // evt.forEach((val,index) =>{
      //   this.dyeingCostList[index].jobType = val.jobType
      // })
      this.dyeingCostList.forEach((val) => {
        val.jobType = evt
      })
      this.reportBtn = true
      //遍历获取对应颜色染费
      this.dyeingCostList.forEach((val) => {
        let data = {
          colorName: val.colorName,
          jobStatus: val.jobType,
        }
        getDyeingFeeDataByJobStatus(data).then((res) => {
          val.dyeingFee = res.data
        })
      })
      console.log(this.dyeingCostList)
    },
    //获取基本数据
    getlist() {
      let data = {
        clothNo: this.clothNo,
        quotedOrderNo: this.quotedOrderNo,
        component: this.component,
      }
      findQuotedProduct(data).then((res) => {
        this.dyeingCostList = res.data.dyeingCostList
        // this.productYarnVoData = res.data.productYarnVo
        this.yarnCostList = res.data.productYarnVo.yarnCostList
        this.yarnCostTotal = res.data.productYarnVo.yarnCostTotal
        if (res.data.weavingCostList) {
          this.weavingCostList = res.data.weavingCostList
        }
        if (res.data.specialVo.specialFinishingList) {
          this.specialFinishingList = res.data.specialVo.specialFinishingList
          this.specialFinishingList.forEach((val) => {
            this.splList.push(val.processName)
          })
        }

        this.extraWholeCost = res.data.specialVo.extraWholeCost
        this.extraWholeLoss = res.data.specialVo.extraWholeLoss
        if (res.data.functionCostVo.functionCostList) {
          this.functionCostList = res.data.functionCostVo.functionCostList
          this.functionCostList.forEach((val) => {
            this.funList.push(val.functionalCommitmentName)
          })
        }

        this.functionCostTotal = res.data.functionCostVo.functionCostTotal
        this.finalQuotedList = res.data.finalQuotedList
      })
      console.log('this.weavingCostList', this.weavingCostList)
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
    .tit-info2 {
      padding-bottom: 20px;
      font-weight: bold;
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
      text-align: center;
      // position: absolute;
      // top: 0;
      // width: 100%;
      // height: 100%;
      // bottom: 0;
      // margin: 0 -10px;
      // border-left: 1px solid rgba(243, 243, 243, 1);
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
  .is-disabled {
    opacity: 0.5;
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
  ::v-deep .el-form-item__content {
    width: calc(100% - 90px);
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
  width: 100%;
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
.hostory-box {
  display: flex;
  justify-content: space-between;

  .font {
    color: #0052d9;
    cursor: pointer;
    line-height: 23px;
  }
}
</style>
