<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true">
      <el-form-item label="客户名称" prop="">
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
      <el-form-item>
        <el-button type="primary" @click="handleQueryBtn">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"
        ><el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleFromCustomer('add')"
          v-hasPermi="['customer:visit:add']"
          >新增拜访</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          size="mini"
          icon="el-icon-tickets"
          @click="handleExportBtn"
          v-hasPermi="['customer:visit:export']"
          >导出数据</el-button
        >
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="listData" style="width: 100%">
      <!-- <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        label="客户名称"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="品牌名称"
        align="center"
        prop="brandName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="业务员"
        align="center"
        prop="salesman"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="拜访对象"
        align="center"
        prop="visitObject"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="拜访内容"
        align="center"
        prop="visitContent"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p style="max-width: 600px">{{ scope.row.visitContent }}</p>
            <div slot="reference" class="content-colum">
              {{ scope.row.visitContent }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="拜访时间"
        align="center"
        prop="visitTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-monitor"
            @click.native.prevent="handleFromCustomer('detail', scope)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.prevent="handleFromCustomer('edit', scope)"
            v-hasPermi="['customer:visit:edit']"
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
import { getVisitList, visitExport } from '@/api/customer/visit'
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
     * 获取拜访信息列表
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
      console.log(data)
      getVisitList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },
    handleFromCustomer(type, scope) {
      let url = '/customer/visitDetails'
      if (scope) {
        let id = scope.row.id
        url = `/customer/visitDetails/${id}`
      }
      this.$router.push({ path: url, query: { type } })
    },
    // handleCreateCustomerBtn() {
    //   this.$router.push({ path: '/customer/visitDetails' })
    // },
    // handleReadCustomer(scope) {
    //   console.log(scope)
    //   const id = scope.row.id
    //   this.$router.push({ path: `/customer/visitDetailsRead/${id}` })
    // },
    // handleEditCustomer(scope) {
    //   const id = scope.row.id
    //   this.$router.push({ path: `/customer/visitDetails/${id}` })
    // },
    handleExportBtn() {
      console.log('点击导出')
      visitExport()
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
<style>
.content-colum {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* for Opera */
}
</style>
