<!-- 报价单列表 -->
<template>
  <div class="app-container">
    <!-- 搜索和筛选栏 -->
    <el-row>
      <el-col style="width: calc(100% - 224px)">
        <el-form
          class="base-form"
          :model="queryParams"
          ref="queryForm"
          label-width="90px"
          :inline="true"
          size="mini"
        >
          <el-form-item label="报价单号">
            <el-input v-model="queryParams.quotedOrderNo"></el-input>
          </el-form-item>
          <el-form-item label="提交人">
            <el-input v-model="queryParams.createBy"></el-input>
          </el-form-item>

          <el-form-item label="客户名称">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="queryParams.departmentId">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(dict, index) in deptsList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围" class="time-picker">
            <el-date-picker
              v-model="queryParams.dateTimePicker"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="布号">
            <el-input v-model="queryParams.clothNo"></el-input>
          </el-form-item> </el-form
      ></el-col>
      <el-col style="width: 224px">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" class="add-btn" @click="addRepot()">新增</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right"></el-col>
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
          <el-table-column
            label="报价单号"
            align="center"
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
            align="center"
            prop="customerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="布号"
            align="center"
            prop="clothNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="提交人"
            align="center"
            prop="createBy"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="部门"
            align="center"
            prop="departmentName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="最终客户"
            align="center"
            prop="finalCustomerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="提交日期"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true">
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
</template>

<script>
import { getReportList } from '@/api/finance/report'
import { getPlanVisitDeptList } from '@/api/customer/visitPlanList'
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
          num: '1',
        },
        {
          name: '草稿',
          type: '0',
          num: '2',
        },
        {
          name: '待报价',
          type: '1',
          num: '3',
        },
        {
          name: '待审核',
          type: '2',
          num: '4',
        },
        {
          name: '已审核',
          type: '3',
          num: '5',
        },
        {
          name: '已驳回',
          type: '4',
          num: '6',
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

  computed: {},

  created() {
    this.getList()
    this.getDeptList()
  },

  methods: {
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
      getPlanVisitDeptList().then((res) => {
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
          startTime: dateTimePicker[0],
          endTime: dateTimePicker[1],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }
      const { pageNum, pageSize } = this
      getReportList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
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
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  .add-btn {
    margin: 16px 0;
    background-color: #00a870;
    padding: 8px 15px;
  }
  .right-btn {
    margin: 16px 0 16px 16px;
    padding: 8px 15px;
  }
  margin: 24px;
  padding: 0 16px;
  .status {
    color: #00a870;
  }
}
.base-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    min-width: 180px;
    width: calc(30% - 40px);
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
.tab_head {
  border-bottom: 1px solid #f3f3f3;
  width: 100%;
  display: flex;
}
.tab_box {
  font-size: 14px;
  padding: 16px 14px;
  cursor: pointer;
}
.tab_checked {
  border-bottom: 2px solid #0052d9;
}
</style>
