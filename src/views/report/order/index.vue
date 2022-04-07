<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="21">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true" size="mini">
          <el-form-item label="收获日期">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="queryParams.company"></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="queryParams.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="queryParams.salesman"></el-input>
          </el-form-item>
          <el-form-item label="所属办事处">
            <el-input v-model="queryParams.department"></el-input>
          </el-form-item>
          <el-form-item label="客服经理">
            <el-input v-model="queryParams.manager"></el-input>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-input v-model="queryParams.payWay"></el-input>
          </el-form-item>
          <el-form-item label="发货单号">
            <el-input v-model="queryParams.sendOutNum"></el-input>
          </el-form-item>
          <el-form-item label="缸号">
            <el-input v-model="queryParams.gangNum"></el-input>
          </el-form-item>
          <el-form-item label="开发单号">
            <el-input v-model="queryParams.developNum"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="getList">查询</el-button>
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
      :show-summary="true"
      :summary-method="tableSummaries"
      :height="tableHeight"
      style="width: 100%"
      :span-method="arraySpanMethod"
      v-loadmore="load"
    >
      <el-table-column
        label="客户名称"
        align="center"
        prop="khmch"
        min-width="150px"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="订单号" align="center" prop="ddh" min-width="120px" />
      <el-table-column
        label="订单重量（KG）"
        align="center"
        prop="ddzlTotal"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="订单金额（元）" align="center" prop="ddjeTotal" min-width="100px" />
      <el-table-column label="所属办事处" align="center" prop="ywb" :show-overflow-tooltip="true" />
      <el-table-column label="客服经理" align="center" prop="zbr" :show-overflow-tooltip="true" />
      <el-table-column label="业务员" align="center" prop="ywy" :show-overflow-tooltip="true" />
      <el-table-column
        label="付款方式"
        align="center"
        prop="fktj"
        min-width="100px"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="发货单号" align="center" prop="fhdh" min-width="150px" />
      <el-table-column
        label="发货日期"
        align="center"
        prop="kdrq"
        min-width="110px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="开发单号"
        align="center"
        prop="bh"
        min-width="100px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="缸号"
        align="center"
        prop="lzkh"
        min-width="130px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="发货重量（KG）"
        align="center"
        prop="fhzl"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="发货金额（元）"
        align="center"
        prop="fhje"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="赔款金额（元）"
        align="center"
        prop="pkje"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="收款到期日"
        align="center"
        prop="skdqr"
        min-width="100px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="收款日期"
        align="center"
        prop="hrrq"
        min-width="110px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="开票日期"
        align="center"
        prop="fprq"
        min-width="110px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="发票号码"
        align="center"
        prop="fph"
        min-width="130px"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="累计欠款金额" align="center">
        <el-table-column
          label="已开票金额（元）"
          align="center"
          prop="ykpje"
          min-width="100px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="未开票金额（元）"
          align="center"
          prop="wkpje"
          min-width="100px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="总计金额（元）"
          align="center"
          prop="zjje"
          min-width="100px"
          :show-overflow-tooltip="true"
        />
      </el-table-column>
      <el-table-column
        label="超期天数"
        align="center"
        prop="cqts"
        min-width="60px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="超期日利率"
        align="center"
        prop="cqrll"
        min-width="100px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="超期利息（元）"
        align="center"
        prop="cqlx"
        min-width="100px"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="备注" align="center" prop="bz" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>
<script>
import { getOrderlist, exportOrderDetail } from '@/api/report/order'
// import { getExternalOrderList, externalExport } from '@/api/test/testapi'
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 255,
      // queryParams: {
      //   company: '',
      //   salesman: '',
      //   payWay: '',
      // },
      // 日期范围
      cqlxTotal: '', //超期利息合计
      fhjeTotal: '', //发货金额合计
      fhzlTotal: '', //发货重量合计
      pkjeTotal: '', //赔款金额合计
      wkpjeTotal: '', //未开票金额合计
      ykpjeTotal: '', //已开票金额合计
      zjjeTotal: '', //总计金额合计
      dateRange: [],
      queryParams: {
        startDate: '', //开始时间
        endDate: '', //结束时间
        company: '', //客户名称
        department: '', //所属办事处
        developNum: '', //开发单号
        gangNum: '', //缸号
        manager: '', //客服经理
        orderNum: '', //订单号
        payWay: '', //付款方式
        salesman: '', //业务员
        sendOutNum: '', //发货单号
      },
      loading: false,
      listData: [],
      downloadLoading: false,
      //订单号合并标记数组
      spanArr: [],
      pos: 0,
      //发货单号合并标记数组
      spanArr_fhdh: [],
      pos_fhdh: 0,
      dataList: [], //传输数据数组
      dataIndex: 0, //合并数据index
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
    load() {
      if (this.dataIndex >= this.dataList.length - 1) {
        this.$message.success('数据没有啦！')
      } else {
        this.dataIndex++
        this.listData = this.listData.concat(this.dataList[this.dataIndex])
        this.getSpanArr(this.listData)
      }
    },
    //遍历数组去记录合并规则
    getSpanArr(data) {
      let that = this
      //页面展示的数据，不一定是全部的数据，所以每次都清空之前存储的 保证遍历的数据是最新的数据。以免造成数据渲染混乱
      that.spanArr = []
      that.pos = 0
      that.spanArr_fhdh = []
      that.pos_fhdh = 0
      //遍历数据
      data.forEach((item, index) => {
        //判断是否是第一项（取决于你准备合并表格第几项）
        if (index === 0) {
          this.spanArr.push(1)
          this.pos = 0
          this.spanArr_fhdh.push(1)
          this.pos_fhdh = 0
        } else {
          //不是第一项时，就根据标识去存储

          if (data[index].ddh === data[index - 1].ddh) {
            // 查找到符合条件的数据时每次要把之前存储的数据+1
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            // 没有符合的数据时，要记住当前的index
            this.spanArr.push(1)
            this.pos = index
          }
          if (data[index].fhdh === data[index - 1].fhdh) {
            // 查找到符合条件的数据时每次要把之前存储的数据+1
            this.spanArr_fhdh[this.pos_fhdh] += 1
            this.spanArr_fhdh.push(0)
          } else {
            // 没有符合的数据时，要记住当前的index
            this.spanArr_fhdh.push(1)
            this.pos_fhdh = index
          }
        }
      })
    },
    // 列表方法
    arraySpanMethod({ rowIndex, columnIndex }) {
      // 页面列表上 表格合并行 -> 第几列(从0开始)
      // 需要合并多个单元格时 依次增加判断条件即可
      let data_ddh = [0, 1, 2, 3, 4, 5, 6, 7] //订单号规则合并列字段
      for (let index = 0; index < data_ddh.length; index++) {
        const element = data_ddh[index]
        if (columnIndex === element) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      }
      let data_fhdh = [8, 9, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26] //发货单号规则合并列字段
      for (let index = 0; index < data_fhdh.length; index++) {
        const element = data_fhdh[index]
        if (columnIndex === element) {
          const _row = this.spanArr_fhdh[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      }
      // if (columnIndex === 0 ||columnIndex === 1 || columnIndex === 2|| columnIndex === 3|| columnIndex === 4|| columnIndex === 5|| columnIndex === 6|| columnIndex === 7) {
      //     // 数组存储的数据 取出
      //     const _row = this.spanArr[rowIndex]
      //     const _col = _row > 0 ? 1 : 0
      //     return {
      //         rowspan: _row,
      //         colspan: _col
      //     }
      //     //不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
      //     // 8 9  16 17 20 21 22 23 24 25 26
      // }else if( columnIndex === 8 || columnIndex === 9 || columnIndex === 16 || columnIndex === 17|| columnIndex === 20|| columnIndex === 21|| columnIndex === 22|| columnIndex === 23|| columnIndex === 24|| columnIndex === 25|| columnIndex === 26) {
      //     // 数组存储的数据 取出
      //     const _row = this.spanArr_fhdh[rowIndex]
      //     const _col = _row > 0 ? 1 : 0
      //     return {
      //         rowspan: _row,
      //         colspan: _col
      //     }
      //     //不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
      // }else {
      //     return false
      // }
    },
    getList() {
      this.loading = true
      // const { company, department, payWdevelopNumay ,gangNum,manager,orderNum,payWay,salesman,sendOutNum} = this.queryParams

      // const data = {
      //   company,
      //   salesman,
      //   payWay,
      // }
      if (this.dateRange) {
        this.queryParams.startDate = this.dateRange[0]
        this.queryParams.endDate = this.dateRange[1]
      } else {
        this.queryParams.startDate = ''
        this.queryParams.endDate = ''
      }
      getOrderlist(this.queryParams)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          this.packetData(res.data.resultList) //初始化分组数据
          this.listData = this.dataList[this.dataIndex]
          if (this.listData.length > 0) {
            this.getSpanArr(this.listData)
          }
          this.cqlxTotal = res.data.cqlxTotal
          this.fhjeTotal = res.data.fhjeTotal
          this.fhzlTotal = res.data.fhzlTotal
          this.pkjeTotal = res.data.pkjeTotal
          this.wkpjeTotal = res.data.wkpjeTotal
          this.ykpjeTotal = res.data.ykpjeTotal
          this.zjjeTotal = res.data.zjjeTotal
        })
    },
    //数据分组
    packetData(data) {
      this.dataIndex = 0
      this.dataList = []
      //数组分组数量;
      let chunk = 100

      //执行数组分组;
      for (let i = 0, j = data.length; i < j; i += chunk) {
        this.dataList.push(data.slice(i, i + chunk))
      }
      console.log(this.dataList, 'result==========')
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
          case 'fhje':
            sums[index] = this.fhjeTotal + ' 元'
            break
          case 'fhzl':
            sums[index] = this.fhzlTotal + ' KG'
            break
          case 'pkje':
            sums[index] = this.pkjeTotal + ' 元'
            break
          case 'ykpje':
            sums[index] = this.ykpjeTotal + ' 元'
            break
          case 'wkpje':
            sums[index] = this.wkpjeTotal + ' 元'
            break
          case 'zjje':
            sums[index] = this.zjjeTotal + ' 元'
            break
          case 'cqlx':
            sums[index] = this.cqlxTotal + ' 元'
            break
          default:
            sums[index] = '--'
            break
        }
        // const values = data.map((item) => {
        //   let orignal = item[column.property]
        //   let Num
        //   orignal !== null && orignal !== '' ? (Num = Number(item[column.property])) : (Num = NaN)
        //   return Num
        // })
        // const valuesIsNum = values.every((value) => {
        //   return isNaN(value)
        // })
        // if (!valuesIsNum) {

        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr)
        //     if (!isNaN(value)) {
        //       return prev + curr
        //     } else {
        //       return prev
        //     }
        //   }, 0)

        //   sums[index] = sums[index].toFixed(2)
        //   sums[index] += ' 元'

        // } else {
        //   sums[index] = '--'
        // }
      })
      return sums
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.company = ''
      this.queryParams.department = ''
      this.queryParams.developNum = ''
      this.queryParams.gangNum = ''
      this.queryParams.manager = ''
      this.queryParams.orderNum = ''
      this.queryParams.payWay = ''
      this.queryParams.salesman = ''
      this.queryParams.sendOutNum = ''
      this.queryParams.startDate = ''
      this.queryParams.endDate = ''
      // this.getList();
    },
    exportReport() {
      this.downloadLoading = true
      exportOrderDetail(this.queryParams).finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    let now = new Date() // 当前日期
    let nowMonth = now.getMonth() // 当前月
    let nowYear = now.getYear()
    nowYear += nowYear < 2000 ? 1900 : 0 // 当前年
    let monthStartDate = new Date(nowYear, nowMonth, 1)
    this.dateRange[0] = this.parseTime(monthStartDate, '{y}-{m}-{d}')
    this.dateRange[1] = this.parseTime(now, '{y}-{m}-{d}')
    this.$set(this.dateRange)
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
