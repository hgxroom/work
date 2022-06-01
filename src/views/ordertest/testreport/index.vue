<template>
  <div class="app-container">
    <div class="card-box">
      <!-- 搜索框 -->
      <el-row>
        <el-col class="search-col-from">
          <el-form
            class="search-form"
            label-width="90px"
            :model="queryParams"
            ref="queryForm"
            :inline="true"
          >
            <el-form-item label="客户名称">
              <el-input v-model="queryParams.khmc" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="queryParams.ddh" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="颜色">
              <el-input v-model="queryParams.ys" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="缩水日期">
              <el-date-picker
                v-model="dateRange"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="流转卡号">
              <el-input v-model="queryParams.lzkh" size="mini" clearble></el-input>
            </el-form-item>
            <el-form-item label="缸号">
              <el-input v-model="queryParams.gh" size="mini" clearble></el-input>
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
        :height="550"
        style="width: 100%"
      >
        <el-table-column
          label="订单号"
          align="center"
          prop="ddh"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="流转卡号"
          align="center"
          prop="lzkh"
          width="80"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="缸号" align="center" prop="gh" :show-overflow-tooltip="true" />
        <el-table-column label="客户" align="center" prop="khmc" :show-overflow-tooltip="true" />
        <el-table-column
          label="款号"
          align="center"
          prop="kh"
          width="80"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="颜色" align="center" prop="ys" :show-overflow-tooltip="true" />
        <el-table-column label="布类" align="center" prop="bl" :show-overflow-tooltip="true" />
        <el-table-column label="客户要求" align="center">
          <el-table-column
            label="封度"
            align="center"
            prop="fd"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="克重"
            align="center"
            prop="kz"
            width="60"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
        <el-table-column label="色牢度" align="center">
          <el-table-column
            label="湿擦"
            align="center"
            prop="sc"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="干擦"
            align="center"
            prop="gc"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="日光牢度"
            align="center"
            prop="rgld"
            width="60"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
        <el-table-column label="" align="center">
          <el-table-column
            label="PH值"
            align="center"
            prop="phz"
            width="60"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
        <el-table-column label="定后" align="center">
          <el-table-column
            label="封度"
            align="center"
            prop="fd2"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="克重"
            align="center"
            prop="kz2"
            width="60"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
        <el-table-column label="定后缩水" align="center">
          <el-table-column
            label="横缩"
            align="center"
            prop="hs"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="直缩"
            align="center"
            prop="zs"
            width="60"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="扭度"
            align="center"
            prop="nj"
            width="60"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="bz"
          width="80"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="缩水日期"
          align="center"
          prop="ssrq"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import { getExternalOrderList, externalExport } from '@/api/ordertest/testreport'
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 210,
      // 日期范围
      dateRange: [],
      queryParams: {
        gh: '', //缸号
        jsrq: '', //结束日期
        khmc: '', //客户名称
        ksrq: '', //开始日期
        lzkh: '', //流转卡号
        ddh: '', //订单号
        ys: '', //颜色
      },
      loading: false,
      listData: [],
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '过去一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 1) //不算今天时间
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '过去三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 1) //不算今天时间
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 1) //不算今天时间
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          //    {
          //         text: '最近一个月',
          //         onClick(picker) {
          //         const end = new Date();
          //         const start = new Date();
          //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          //         picker.$emit('pick', [start, end]);
          //         }
          //     },
        ],
      },
    }
  },
  methods: {
    getList() {
      if (this.dateRange) {
        this.queryParams.ksrq = this.dateRange[0]
        this.queryParams.jsrq = this.dateRange[1]
      } else {
        this.queryParams.ksrq = ''
        this.queryParams.jsrq = ''
      }
      this.loading = true
      const { gh, jsrq, khmc, ksrq, lzkh, ddh, ys } = this.queryParams
      const data = {
        gh,
        jsrq,
        khmc,
        ksrq,
        lzkh,
        ddh,
        ys,
      }

      getExternalOrderList(data)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          this.listData = res.data
        })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.gh = ''
      this.queryParams.jsrq = ''
      this.queryParams.khmc = ''
      this.queryParams.ksrq = ''
      this.queryParams.lzkh = ''
      this.queryParams.ddh = ''
      this.queryParams.ys = ''
      this.dateRange = []
      this.getList()
    },
    exportReport() {
      this.downloadLoading = true
      externalExport(JSON.stringify(this.listData)).finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    // this.getList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout()
    })
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  .card-box {
    padding-bottom: 0px;
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}
</style>
