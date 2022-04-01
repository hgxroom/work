<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-row>
     <el-col :span="21">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true" size="mini">
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
    >
      <el-table-column
        label="客户名称"
        align="center"
        prop="khmch"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单号"
        align="center"
        prop="ddh"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单重量（KG）"
        align="center"
        prop="ddzlTotal"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="订单金额（元）"
        align="center"
        prop="ddjeTotal"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属办事处"
        align="center"
        prop="ywb"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客服经理"
        align="center"
        prop="zbr"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="业务员"
        align="center"
        prop="ywy"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="付款方式"
        align="center"
        prop="fktj"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货单号"
        align="center"
        prop="fhdh"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发货日期"
        align="center"
        prop="kdrq"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="开发单号"
        align="center"
        prop="bh"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="缸号"
        align="center"
        prop="lzkh"
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
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="收款日期"
        align="center"
        prop="hrrq"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="开票日期"
        align="center"
        prop="fprq"
        :show-overflow-tooltip="true"
      />
       <el-table-column
        label="发票号码"
        align="center"
        prop="fph"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="累计欠款金额" align="center">
        <el-table-column
          label="已开票金额（元）"
          align="center"
          prop="ykpje"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="未开票金额（元）"
          align="center"
          prop="wkpje"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="总计金额（元）"
          align="center"
          prop="zjje"
          :show-overflow-tooltip="true"
        />
      </el-table-column>
         <el-table-column
          label="超期天数"
          align="center"
          prop="cqts"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="超期日利率"
          align="center"
          prop="cqrll"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="超期利息（元）"
          align="center"
          prop="cqlx"
          :show-overflow-tooltip="true"
        />
           <el-table-column
          label="备注"
          align="center"
          prop="bz"
          :show-overflow-tooltip="true"
        />

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
      cqlxTotal:"", //超期利息合计
      fhjeTotal:"", //发货金额合计
      fhzlTotal:"", //发货重量合计
      pkjeTotal:"", //赔款金额合计
      wkpjeTotal:"",  //未开票金额合计
      ykpjeTotal:"",  //已开票金额合计
      zjjeTotal:"", //总计金额合计
      dateRange: [],
      queryParams:{
        company: "",//客户名称
        department: "",//所属办事处
        developNum: "",//开发单号
        gangNum: "",//缸号
        manager: "",//客服经理
        orderNum: "",//订单号
        payWay: "",//付款方式
        salesman: "",//业务员
        sendOutNum: "",//发货单号
      },
      loading: false,
      listData: [],
      downloadLoading: false,
      spanArr:[],
      pos:0
    }
  },
  methods: {

        //遍历数组去记录合并规则
        getSpanArr(data) {
            let that = this
                //页面展示的数据，不一定是全部的数据，所以每次都清空之前存储的 保证遍历的数据是最新的数据。以免造成数据渲染混乱
            that.spanArr = []
            that.pos = 0
                //遍历数据
            data.forEach((item, index) => {
                //判断是否是第一项（取决于你准备合并表格第几项）
                if (index === 0) {
                    this.spanArr.push(1)
                    this.pos = 0
                } else {
                    //不是第一项时，就根据标识去存储
                    if (data[index].qiyemingcheng === data[index - 1].qiyemingcheng) {
                        // 查找到符合条件的数据时每次要把之前存储的数据+1
                        this.spanArr[this.pos] += 1
                        this.spanArr.push(0)
                    } else {
                        // 没有符合的数据时，要记住当前的index
                        this.spanArr.push(1)
                        this.pos = index
                    }
                }
            })
            console.log(this.spanArr, this.pos)
        },
        // 列表方法
        arraySpanMethod({ rowIndex, columnIndex }) {
            // 页面列表上 表格合并行 -> 第几列(从0开始)
            // 需要合并多个单元格时 依次增加判断条件即可
            if (columnIndex === 1) {
                // 数组存储的数据 取出
                const _row = this.spanArr[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
                //不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
            } else {
                return false
            }
            
        },

    
    getList() {

      this.loading = true
      // const { company, department, payWdevelopNumay ,gangNum,manager,orderNum,payWay,salesman,sendOutNum} = this.queryParams
      
      // const data = {
      //   company,
      //   salesman,
      //   payWay,
      // }
      getOrderlist(this.queryParams)
        .finally(() => {
          this.loading = false
        })
        .then((res) => {
          console.log(res,"res=====")
          this.listData = res.data.resultList
          this.getSpanArr(this.listData)
          this.cqlxTotal= res.data.cqlxTotal
          this.fhjeTotal= res.data.fhjeTotal
          this.fhzlTotal= res.data.fhzlTotal
          this.pkjeTotal= res.data.pkjeTotal
          this.wkpjeTotal= res.data.wkpjeTotal
          this.ykpjeTotal= res.data.ykpjeTotal
          this.zjjeTotal= res.data.zjjeTotal
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
          case "fhje":
            sums[index] = this.fhjeTotal +" 元"
            break;
          case "fhzl":
            sums[index] = this.fhzlTotal +" KG"
            break;
          case "pkje":
          sums[index] = this.pkjeTotal +" 元"
          break;
          case "ykpje":
          sums[index] = this.ykpjeTotal +" 元"
          break;
          case "wkpje":
          sums[index] = this.wkpjeTotal +" 元"
          break;
          case "zjje":
          sums[index] = this.zjjeTotal +" 元"
          break;
          case "cqlx":
            console.log(this.cqlxTotal,"this.cqlxTotal=====")
          sums[index] = this.cqlxTotal +" 元"
          break;
          default:
            sums[index] = "--"
            break;
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
      this.queryParams.company = '';
      this.queryParams.salesman = '';
      this.queryParams.payWay = '';
      this.getList();
    },
    exportReport() {
      this.downloadLoading = true
      exportOrderDetail(this.queryParams).finally(() => {
        this.downloadLoading = false
      })
    },
  },
  mounted() {
    // this.getList()
    // this.gettest()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout()
    })
  },
}
</script>
