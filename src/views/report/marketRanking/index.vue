<template>
  <div class="app-container">
    <div class="card-box">
      <!-- 搜索框 -->
      <el-row>
        <el-col class="search-col-from">
          <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item label="业务员">
              <el-input v-model="queryParams.ywgdy" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="queryParams.ywb" size="mini" clearble></el-input>
            </el-form-item>

            <el-form-item label="年份">
              <el-date-picker
                v-model="queryParams.scYear"
                value-format="yyyy"
                type="year"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="search-col-btn">
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="card-box">
      <el-row class="mb8">
        <el-col>
          <el-button
            plain
            size="mini"
            icon="el-icon-tickets"
            :loading="downloadLoading"
            @click="exportReport"
            >导出报表</el-button
          >
        </el-col>
      </el-row>
      <el-table
        ref="tableData"
        :data="listData"
        v-loading="loading"
        :show-summary="true"
        :summary-method="tableSummaries"
        :height="tableHeight"
        style="width: 100%"
        border
      >
        <el-table-column label="业务员" align="center" prop="ywgdy" :show-overflow-tooltip="true" />
        <el-table-column label="部门" align="center" prop="ywb" :show-overflow-tooltip="true" />
        <el-table-column
          label="1月确收"
          align="center"
          prop="month1"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="2月确收"
          align="center"
          prop="month2"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="3月确收"
          align="center"
          prop="month3"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="4月确收"
          align="center"
          prop="month4"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="5月确收"
          align="center"
          prop="month5"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="6月确收"
          align="center"
          prop="month6"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="7月确收"
          align="center"
          prop="month7"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="8月确收"
          align="center"
          prop="month8"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="9月确收"
          align="center"
          prop="month9"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="10月确收"
          align="center"
          prop="month10"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="11月确收"
          align="center"
          prop="month11"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="12月确收"
          align="center"
          prop="month12"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="累计销售"
          align="center"
          prop="cumulativeSales"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="超期欠额"
          align="center"
          prop="overdueArrears"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="净额"
          align="center"
          prop="netAmount"
          width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="排名" align="center" prop="scRank" :show-overflow-tooltip="true" />
      </el-table>
    </div>
  </div>
</template>
<script>
// import { getFinance, financeExport } from '@/api/report/receivables'
import { getsaleMoneyBacklist, exportexportMoneyBacklist } from '@/api/report/marketRanking'
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 210,
      queryParams: {
        scYear: '', //年份
        ywb: '', // 部门
        ywgdy: '', //业务员
      },
      cumulativeSalesTotal: '', //累计销售合计
      month1Total: '', //1月销售合计
      month2Total: '',
      month3Total: '',
      month4Total: '',
      month5Total: '',
      month6Total: '',
      month7Total: '',
      month8Total: '',
      month9Total: '',
      month10Total: '',
      month11Total: '',
      month12Total: '',
      netAmountTotal: '', //净额合计
      overdueArrearsTotal: '', //超期欠额合计
      dateRange: [],
      loading: false,
      listData: [],
      downloadLoading: false,
    }
  },
  methods: {
    getList() {
      this.loading = true
      // this.queryParams.year = this.parseTime(this.queryParams.year, '{y}')
      const { scYear, ywb, ywgdy } = this.queryParams
      console.log(this.queryParams)
      const data = {
        scYear,
        ywb,
        ywgdy,
      }
      getsaleMoneyBacklist(data)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          this.listData = res.data.resultList
          this.cumulativeSalesTotal = res.data.cumulativeSalesTotal //累计销售合计
          this.month1Total = res.data.month1Total //1月销售合计
          this.month2Total = res.data.month2Total
          this.month3Total = res.data.month3Total
          this.month4Total = res.data.month4Total
          this.month5Total = res.data.month5Total
          this.month6Total = res.data.month6Total
          this.month7Total = res.data.month7Total
          this.month8Total = res.data.month8Total
          this.month9Total = res.data.month9Total
          this.month10Total = res.data.month10Total
          this.month11Total = res.data.month11Total
          this.month12Total = res.data.month12Total
          this.netAmountTotal = res.data.netAmountTotal //净额合计
          this.overdueArrearsTotal = res.data.overdueArrearsTotal //超期欠额合计
        })
    },
    tableSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        switch (column.property) {
          case 'month1':
            sums[index] = this.month1Total + ' 元'
            break
          case 'month2':
            sums[index] = this.month2Total + ' 元'
            break
          case 'month3':
            sums[index] = this.month3Total + ' 元'
            break
          case 'month4':
            sums[index] = this.month4Total + ' 元'
            break
          case 'month5':
            sums[index] = this.month5Total + ' 元'
            break
          case 'month6':
            sums[index] = this.month6Total + ' 元'
            break
          case 'month7':
            sums[index] = this.month7Total + ' 元'
            break
          case 'month8':
            sums[index] = this.month8Total + ' 元'
            break
          case 'month9':
            sums[index] = this.month9Total + ' 元'
            break
          case 'month10':
            sums[index] = this.month10Total + ' 元'
            break
          case 'month11':
            sums[index] = this.month11Total + ' 元'
            break
          case 'month12':
            sums[index] = this.month12Total + ' 元'
            break
          case 'netAmount':
            sums[index] = this.netAmountTotal + ' 元'
            break
          case 'overdueArrears':
            sums[index] = this.overdueArrearsTotal + ' 元'
            break
          case 'cumulativeSales':
            sums[index] = this.cumulativeSalesTotal + ' 元'
            break
          default:
            sums[index] = '--'
            break
        }
      })
      return sums
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.ywgdy = ''
      this.queryParams.ywb = ''
      this.queryParams.scYear = ''
      // this.getList()
    },
    exportReport() {
      this.downloadLoading = true
      exportexportMoneyBacklist(this.queryParams).finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    this.queryParams.scYear = new Date().getFullYear().toString()
    this.getList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout()
    })
  },
}
</script>
