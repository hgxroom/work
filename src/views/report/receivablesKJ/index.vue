<template>
  <div class="app-container">
    <div class="card-box">
      <!-- 搜索框 -->
      <el-row>
        <el-col class="search-col-from">
          <el-form
            :model="queryParams"
            class="search-form"
            label-width="100px"
            ref="queryForm"
            :inline="true"
          >
            <el-form-item label="单位名称">
              <el-input v-model="queryParams.company" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="业务员">
              <el-input v-model="queryParams.salesman" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="付款方式">
              <el-input v-model="queryParams.payWay" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="是否逾期欠款">
              <el-select size="mini" v-model="queryParams.overdueFlag" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(dict, index) in overdueFlagList"
                  :key="index"
                  :label="dict.label"
                  :value="dict.key"
                ></el-option>
              </el-select>
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
      <el-row class="mb16">
        <el-col style="text-align: right">
          <el-button type="default" @click="exportReport" class="right-btn"> 导出 </el-button>
        </el-col>
      </el-row>
      <el-table
        ref="tableData"
        :data="listData"
        v-loading="loading"
        :show-summary="true"
        :summary-method="tableSummaries"
        :height="550"
        style="width: 100%"
      >
        <el-table-column
          label="单位名称"
          align="center"
          prop="company"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="累计欠款金额" align="center">
          <el-table-column
            label="已开票金额(元)"
            align="center"
            prop="invoiceAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="未开票金额(元)"
            align="center"
            prop="unInvoicedAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="总计金额(元)"
            align="center"
            prop="totalAmount"
            :show-overflow-tooltip="true"
          />
        </el-table-column>

        <el-table-column
          label="业务员"
          align="center"
          prop="salesman"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="付款方式"
          align="center"
          prop="payWay"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="center" label="月末应回款金额(元)">
          <el-table-column align="center" label="逾期金额(元)">
            <el-table-column
              label="1-30天"
              align="center"
              prop="oneMonthAmount"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="31-60天"
              align="center"
              prop="twoMonthAmount"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="61-90天"
              align="center"
              prop="threeMonthAmount"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="91-150天"
              align="center"
              prop="fourMonthAmount"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="150天以上"
              align="center"
              prop="fiveMonthAmount"
              :show-overflow-tooltip="true"
            />
          </el-table-column>
          <el-table-column
            label="月末到期金额(元)"
            align="center"
            prop="endMonthAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="合计金额"
            align="center"
            prop="endMonthTotalAmount"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getFinance, financeExport } from '@/api/report/receivablesKJ'
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 210,
      queryParams: {
        company: '',
        salesman: '',
        payWay: '',
        overdueFlag: '',
      },
      loading: false,
      listData: [],
      downloadLoading: false,
      overdueFlagList: [
        {
          key: '0',
          label: '是',
        },
        {
          key: '1',
          label: '否',
        },
      ],
    }
  },
  methods: {
    getList() {
      this.loading = true
      const { company, salesman, payWay, overdueFlag } = this.queryParams
      const data = {
        company,
        salesman,
        payWay,
        overdueFlag,
      }
      getFinance(data)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          this.listData = res.data
        })
    },
    tableSummaries(param) {
      console.log(param, 'param=========')
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => {
          let orignal = item[column.property]
          let Num
          orignal !== null && orignal !== '' ? (Num = Number(item[column.property])) : (Num = NaN)
          return Num
        })
        console.log(values, 'values=========')
        const valuesIsNum = values.every((value) => {
          return isNaN(value)
        })
        console.log(valuesIsNum, 'valuesIsNum=========')
        if (!valuesIsNum) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
          sums[index] += ' 元'
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.company = ''
      this.queryParams.salesman = ''
      this.queryParams.payWay = ''
      this.queryParams.overdueFlag = ''
      this.getList()
    },
    exportReport() {
      this.downloadLoading = true
      financeExport().finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    this.getList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout()
    })
  },
}
</script>
<style lang="scss" scoped>
::v-deep .search-form .el-form-item__content {
  width: calc(100% - 100px);
}
</style>
