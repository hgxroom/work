<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-row>
     <el-col :span="20">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true" size="mini">
          <el-form-item label="客户名称">
            <el-input v-model="queryParams.applyNo"></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="queryParams.applyNo"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="queryParams.salesman"></el-input>
          </el-form-item>
           <el-form-item label="业务部">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="客服经理">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="发货单号">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="缸号">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="开发单号">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
        </el-form>
        </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>
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
    
      :summary-method="tableSummaries"
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column
        label="客户名称"
        align="center"
        prop="lzkh"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单号"
        align="center"
        prop="gh"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单重量（KG）"
        align="center"
        prop="kh"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单金额（元）"
        align="center"
        prop="ys"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属办事处"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客服经理"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="业务员"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="付款方式"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货单号"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货日期"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="开发单号"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="缸号"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货重量（KG）"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货金额（元）"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="赔款金额（元）"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="收款到日期"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="收款日期"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="开票日期"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发票号码"
        align="center"
        prop="bl"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="累计欠款金额" align="center">
        <el-table-column
          label="已开票金额（元）"
          align="center"
          prop="fd"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="未开票金额（元）"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="总计金额（元）"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />
      </el-table-column>
         <el-table-column
          label="超期天数"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="超期日利率"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="超期利息（元）"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="备注"
          align="center"
          prop="kd"
          :show-overflow-tooltip="true"
        />

    </el-table>
  </div>
</template>
<script>
import { getFinance, financeExport } from '@/api/report/receivables'
// import { getExternalOrderList, externalExport } from '@/api/test/testapi'
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 210,
      // queryParams: {
      //   company: '',
      //   salesman: '',
      //   payWay: '',
      // },
      // 日期范围
      dateRange: [],
      queryParams:{
        gh: "",//缸号
        jsrq: "",//结束日期
        khmc: "",//客户名称
        ksrq: "",//开始日期
        lzkh: ""//流转卡号
      },
      loading: false,
      listData: [],
      downloadLoading: false,
    }
  },
  methods: {
    gettest(){
      const { gh, jsrq, khmc, ksrq, lzkh } = this.queryParams
      const data = {
        gh,
        jsrq,
        khmc,
        ksrq,
        lzkh
      }
      getExternalOrderList(data)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          console.log(res)
          // this.listData = res.data
        })
    },
    getList() {
      this.loading = true
      const { company, salesman, payWay } = this.queryParams
      
      const data = {
        company,
        salesman,
        payWay,
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
        const valuesIsNum = values.every((value) => {
          return isNaN(value)
        })
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
      this.queryParams.company = '';
      this.queryParams.salesman = '';
      this.queryParams.payWay = '';
      this.getList();
    },
    exportReport() {
      this.downloadLoading = true
      externalExport(this.queryParams).finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    this.getList()
    // this.gettest()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout()
    })
  },
}
</script>
