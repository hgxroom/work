<!-- 报价单列表 -->
<template>
  <div class="wrapper">
    <div class="app-container">
      <div class="card-box">
        <!-- 搜索和筛选栏 -->
        <el-row>
          <el-col class="search-col-from">
            <el-form
              class="base-form"
              :model="queryParams"
              ref="queryForm"
              label-width="90px"
              :inline="true"
            >
              <el-form-item label="报价单号">
                <el-input
                  v-model="queryParams.quotedOrderNo"
                  placeholder="请输入报价单号"
                ></el-input>
              </el-form-item>
              <el-form-item label="提交人" v-hasRole="['quotedPrice', 'business']">
                <el-input v-model="queryParams.createBy" placeholder="请输入提交人"></el-input>
              </el-form-item>

              <el-form-item label="客户名称">
                <el-input
                  v-model="queryParams.customerName"
                  placeholder="请输入客户名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="部门" v-hasRole="['quotedPrice']">
                <el-select v-model="queryParams.departmentId" placeholder="请选择部门">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(dict, index) in deptsList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提交时间" class="time-picker">
                <el-date-picker
                  v-model="queryParams.dateTimePicker"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="布号">
                <el-input v-model="queryParams.clothNo" placeholder="请输入布号"></el-input>
              </el-form-item> </el-form
          ></el-col>
          <el-col class="search-col-btn">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="card-box" style="padding-bottom: 24px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" class="add-btn" @click="addRepot()">新增</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="default" @click="handleExportBtn" class="right-btn"> 导出 </el-button>
          </el-col>
        </el-row>
        <!-- 列表状态 -->
        <el-row class="tab_head">
          <div
            @click="checkTab(item.type)"
            class="tab_box"
            :class="item.type == type ? 'tab_checked' : ''"
            v-for="(item, index) in tabBtn"
            :key="item.type"
          >
            {{ item.name }} ({{ item.num }})
          </div>
        </el-row>
        <!-- 列表 -->
        <el-row>
          <el-col>
            <el-table :data="listData" ref="list" :max-height="500" style="width: 100%">
              <el-table-column label="序号" type="index" align="center">
                <template slot-scope="scope">
                  <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="报价单号"
                align="left"
                prop="quotedOrderNo"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="toDetail(scope)">{{
                    scope.row.quotedOrderNo
                  }}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                label="客户名称"
                align="left"
                prop="customerName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="布号"
                align="left"
                prop="clothNo"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="提交人"
                align="left"
                prop="createBy"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                label="部门"
                align="left"
                prop="departmentName"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                label="最终客户"
                align="left"
                prop="finalCustomerName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="提交日期"
                align="left"
                prop="createTime"
                :show-overflow-tooltip="true"
              >
                <template v-slot="scope">
                  {{ scope.row.updateTime || scope.row.createTime }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
                prop="status"
                :show-overflow-tooltip="true"
              >
                <template v-slot="scope">
                  <div>
                    {{ statusFilter(scope.row.orderStatus) }}
                  </div>
                </template></el-table-column
              >
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getReportList,
  getStatusNum,
  getdeptList,
  salesmanExport,
  quotedPriceExport,
} from '@/api/finance/report'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      listData: [], //数据
      deptsList: [],
      type: '',
      tabBtn: [
        {
          name: '全部',
          type: '',
          num: 0,
        },
        {
          name: '草稿',
          type: '0',
          num: 0,
        },
        {
          name: '待报价',
          type: '1',
          num: 0,
        },
        {
          name: '待审核',
          type: '2',
          num: 0,
        },
        {
          name: '已审核',
          type: '3',
          num: 0,
        },
      ],
      queryParams: {
        quotedOrderNo: '',
        createBy: '',
        customerName: '',
        departmentId: '',
        orderStatus: '',
        dateTimePicker: ['', ''],
        clothNo: '',
        state: '',
      },
    }
  },

  components: {},

  computed: {
    ...mapGetters({ roles: 'roles' }),
  },

  created() {
    this.getList()
    this.getDeptList()
  },

  methods: {
    //获取状态条数
    getNum() {
      const { quotedOrderNo, createBy, customerName, departmentId, clothNo, dateTimePicker } =
        this.queryParams
      let data = {}
      if (this.queryParams.dateTimePicker == null) {
        data = {
          quotedOrderNo,
          createBy,
          customerName,
          departmentId,
          clothNo,
          startTime: '',
          endTime: ' ',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      } else {
        data = {
          quotedOrderNo,
          createBy,
          customerName,
          departmentId,
          clothNo,
          startTime: dateTimePicker[0] + ' 00:00:00',
          endTime: dateTimePicker[1] + ' 23:59:59',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }
      getStatusNum(data).then((res) => {
        console.log(res)

        this.tabBtn.forEach((val) => {
          switch (val.name) {
            case '全部':
              val.num = res.data.numAll
              break
            case '草稿':
              val.num = res.data.numDraft
              break
            case '待报价':
              val.num = res.data.numWaiting
              break
            case '待审核':
              val.num = res.data.numPendingReview
              break
            case '已审核':
              val.num = res.data.numReviewed
              break
            default:
              break
          }
        })
      })
    },
    addRepot() {
      let url = '/finance/addReport'
      this.$router.push({
        path: url,
        query: { type: 'add' },
      })
    },
    toDetail(val) {
      console.log(val.row.orderStatus)
      if (val.row.orderStatus == 0) {
        let url = '/finance/addReport'
        this.$router.push({
          path: url,
          query: { type: 'edit', quotedOrderNo: val.row.quotedOrderNo },
        })
      } else {
        let url = '/finance/reportDetail'
        this.$router.push({
          path: url,
          query: { type: 'detail', quotedOrderNo: val.row.quotedOrderNo },
        })
      }
    },
    //获取部门字典
    getDeptList() {
      getdeptList().then((res) => {
        this.deptsList = res.data.secondarySector
      })
    },
    statusFilter(type) {
      let obj = {
        0: '草稿',
        1: '待报价',
        2: '待审核',
        3: '已审核',
        4: '已驳回',
        5: '已完成',
      }
      return obj[type]
    },
    //查询
    handleQuery() {
      this.getList()
    },
    //重置
    resetQuery() {
      this.queryParams.quotedOrderNo = ''
      this.queryParams.createBy = ''
      this.queryParams.customerName = ''
      this.queryParams.departmentId = ''
      this.queryParams.dateTimePicker = ''
      this.queryParams.clothNo = ''
      this.queryParams.orderStatus = ''
      this.getList()
    },
    //获取数据
    getList() {
      const {
        quotedOrderNo,
        createBy,
        customerName,
        departmentId,
        clothNo,
        dateTimePicker,
        orderStatus,
      } = this.queryParams
      let data = {}
      if (this.queryParams.dateTimePicker == null) {
        data = {
          orderStatus,
          quotedOrderNo,
          createBy,
          customerName,
          departmentId,
          clothNo,
          startTime: '',
          endTime: ' ',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      } else {
        data = {
          orderStatus,
          quotedOrderNo,
          createBy,
          customerName,
          departmentId,
          clothNo,
          startTime: dateTimePicker[0] + ' 00:00:00',
          endTime: dateTimePicker[1] + ' 23:59:59',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }
      const { pageNum, pageSize } = this
      getReportList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
        this.getNum()
      })
    },
    addList() {
      let url = '/finance/addReport'
      this.$router.push({ path: url })
    },
    //状态选择
    checkTab(val) {
      this.type = val
      this.queryParams.orderStatus = val
      this.getList()
    },
    handleExportBtn() {
      const { quotedOrderNo, createBy, customerName, departmentId, clothNo, dateTimePicker } =
        this.queryParams
      let salesman = this.roles.includes('salesman')
      let quotedPrice = this.roles.includes('quotedPrice')
      let saleLeader = this.roles.includes('saleLeader')
      console.log(this.roles)
      console.log('点击导出')
      let params = {
        quotedOrderNo,
        createBy,
        customerName,
        departmentId,
        clothNo,
        startTime: this.queryParams.dateTimePicker[0] ? dateTimePicker[0] + ' 00:00:00' : '',
        endTime: this.queryParams.dateTimePicker[1] ? dateTimePicker[1] + ' 23:59:59' : '',
      }
      if (salesman) {
        salesmanExport(params)
      }
      if (quotedPrice || saleLeader) {
        quotedPriceExport(params)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  .card-box {
    position: relative;
    padding: 16px 16px 24px 16px;
    margin-bottom: 24px;
    border-radius: 8px;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 20px;
    }
    padding-bottom: 0px;
  }
  .add-btn {
    // margin: 16px 0;
    background-color: #00a870;
    border-color: #00a870;
    padding: 8px 15px;
  }
  .right-btn {
    // margin: 16px 0 16px 16px;
    padding: 8px 15px;
  }
  margin: 0px 0 24px 0;
  // padding: 0 16px;
  .status {
    color: #00a870;
  }
}
.base-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    min-width: 180px;
    width: calc(25% - 40px);
    margin-right: 40px;
  }
  ::v-deep .el-form-item__content {
    width: calc(100% - 90px);
  }

  ::v-deep .el-range-editor.el-input__inner {
    width: 100%;
  }
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
