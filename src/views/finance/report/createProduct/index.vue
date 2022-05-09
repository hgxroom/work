<!-- 自建产品列表 -->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-row>
      <el-col :span="18">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true">
          <el-form-item label="布号">
            <el-input
              v-model="queryParams.customerName"
              placeholder="请输入布号"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="布类">
            <el-select v-model="queryParams.customerState" clearable placeholder="请选择">
              <el-option
                v-for="(dict, index) in dict.type.customer_state"
                :key="index"
                :label="dict.label"
                :value="dict.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="织机">
            <el-select v-model="queryParams.customerState" clearable placeholder="请选择">
              <el-option
                v-for="(dict, index) in dict.type.customer_state"
                :key="index"
                :label="dict.label"
                :value="dict.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="handleQueryBtn">查询</el-button>
          </el-form-item>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
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
          @click="addProduct('add')"
          v-hasPermi="['finance:report:createProduct:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="listData" ref="customerList" border style="width: 100%">
      <el-table-column label="序号" type="index" align="center"> </el-table-column>
      <el-table-column
        label="布号"
        align="center"
        prop="customerNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="参考布号"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="品名"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="布类"
        align="center"
        prop="customerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="纱线品名"
        align="center"
        prop="salesman"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="纱线编号"
        align="center"
        prop="salesman"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="纱支比例"
        align="center"
        prop="customerArea"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="克重(g)"
        align="center"
        prop="revenueScale"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="幅宽(g/m2)"
        align="center"
        prop="customerState"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="成分"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="织机规模"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="特殊工艺"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="功能性承诺"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
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
            @click.native.prevent="handleFromCustomer('detail', scope)"
            >禁用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.prevent="handleFromCustomer('edit', scope)"
            v-hasPermi="['customer:customer:edit']"
            >启用</el-button
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
import { dictMap } from '../createProduct/utils'
export default {
  dicts: dictMap,
  data() {
    return {
      // 查询参数
      queryParams: {
        customerName: '', //客户名称
        salesman: '', //业务员名称
        customerState: '',
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
    //新增自建产品
    addProduct() {
      let url = '/finance/addCreateProduct'

      this.$router.push({ path: url })
    },
    /**
     * 获取客户信息列表
     */
    getList() {
      const { customerName, salesman, customerState, dateTimePicker } = this.queryParams
      let data = {}
      if (this.queryParams.dateTimePicker == null) {
        data = {
          customerName,
          salesman,
          customerState,
          startTime: '',
          endTime: ' ',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      } else {
        data = {
          customerName,
          salesman,
          customerState,
          startTime: dateTimePicker[0],
          endTime: dateTimePicker[1],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }
      const { pageNum, pageSize } = this
      getCustomerList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },
    handleFromCustomer(type, scope) {
      let url = '/customer/customerDetails'
      if (scope) {
        let id = scope.row.id
        url = `/customer/customerDetails/${id}`
      }
      this.$router.push({ path: url, query: { type } })
    },
    // handleCreateCustomerBtn() {
    //   this.$router.push({ path: '/customer/customerDetails' })
    // },
    // handleReadCustomer(scope) {
    //   const id = scope.row.id
    //   this.$router.push({ path: `/customer/customerDetailsRead/${id}` })
    // },
    // handleEditCustomer(scope) {
    //   const id = scope.row.id
    //   this.$router.push({ path: `/customer/customerDetails/${id}` })
    // },

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
