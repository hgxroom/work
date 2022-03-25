<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-row>
      <el-col :span="22">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true">
          <el-form-item label="客户名称">
            <el-input
              v-model="queryParams.customerName"
              placeholder="请输入客户名称"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务员" v-hasRole="['admin']">
            <el-input
              v-model="queryParams.salesman"
              placeholder="请输入业务员"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="搜索区间">
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
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="handleQueryBtn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mb8">
      <el-col>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleCreateCustomerBtn"
          v-hasPermi="['customer:customer:add']"
          >新增客户</el-button
        >
        <el-button
          plain
          size="mini"
          icon="el-icon-tickets"
          @click="handleExportBtn"
          v-hasPermi="['customer:customer:export']"
          >导出数据</el-button
        >
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table
      :data="listData"
      ref="customerList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      default-expand-all
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <!-- <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions
            class="list-expand-form"
            v-for="(item, index) in props.row.brandList"
            :key="index"
            :column="4"
          >
            <el-descriptions-item label="品牌名">
              <el-tag size="small">{{ item.brandName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="营收规模">{{ item.revenueScale }}万</el-descriptions-item>
            <el-descriptions-item label="品牌分层">{{ item.brandGrade }}</el-descriptions-item>
            <el-descriptions-item label="合作意向">{{
              item.cooperationIntention
            }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column
        label="客户编号"
        align="center"
        prop="customerNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户名称"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="业务员"
        align="center"
        prop="salesman"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="客户区域"
        align="center"
        prop="customerArea"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="营收规模"
        align="center"
        prop="revenueScale"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.revenueScale }} 万</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-monitor"
            @click.native.prevent="handleReadCustomer(scope)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.prevent="handleEditCustomer(scope)"
            v-hasPermi="['customer:customer:edit']"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import { getCustomerList, customerExport } from '@/api/customer/customer'
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        customerName: '', //客户名称
        salesman: '', //业务员名称
        dateTimePicker: ['', ''], //时间区间 Array
      },
      // loading
      loading: false,
      // 总条数
      total: 0,
      listData: [],
      pageNum: 1,
      pageSize: 10,

      selectionList: [], //多选选择数据
    }
  },
  methods: {
    /**
     * 获取客户信息列表
     */
    getList() {
      const { customerName, salesman, dateTimePicker } = this.queryParams
      const { pageNum, pageSize } = this
      const data = {
        customerName,
        salesman,
        startTime: dateTimePicker[0],
        endTime: dateTimePicker[1],
        pageNum,
        pageSize,
      }
      getCustomerList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },

    handleCreateCustomerBtn() {
      this.$router.push({ path: '/customer/customerDetails' })
    },
    handleReadCustomer(scope) {
      const id = scope.row.id
      this.$router.push({ path: `/customer/customerDetailsRead/${id}` })
    },
    handleEditCustomer(scope) {
      const id = scope.row.id
      this.$router.push({ path: `/customer/customerDetails/${id}` })
    },

    handleExportBtn() {
      console.log('点击导出')
      customerExport()
    },

    handleSelectionChange(selection) {
      this.selectionList = selection
    },
  },
  created() {
    this.getList()
  },
}
</script>
<style lang="scss" scoped>
.list-expand-form {
  padding-left: 150px;
}
</style>