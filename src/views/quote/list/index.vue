<template>
  <div class="app-container">
    <!-- 搜索和筛选栏 -->
    <el-row>
      <el-col :span="20">
        <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true" size="mini">
          <el-form-item label="报价单编号">
            <el-input v-model="queryParams.applyNo"></el-input>
          </el-form-item>
          <el-form-item label="报价类型">
            <el-select v-model="queryParams.quotedType">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(dict, index) in dict.type.quote_quote_type"
                :key="index"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="queryParams.customerName"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(dict, index) in dict.type.quote_quote_state"
                :key="index"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="queryParams.deptId">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(dict, index) in deptsList"
                :key="dict.deptId"
                :label="dict.deptName"
                :value="dict.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="queryParams.salesman"></el-input>
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
          </el-form-item> </el-form
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 列表状态 -->
    <el-row class="mb18">
      <el-col :span="22">
        <el-button
          class="mr20"
          v-for="item in listTypes"
          :key="item.label"
          :type="item.type"
          :plain="item.isActive ? false : true"
          size="small"
          @click="handleStateTag(item)"
        >
          {{ item.label }}
          {{ item.num }}
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          size="small"
          @click="handleCreate"
          v-hasPermi="['quote:detail:salesman']"
          >新增</el-button
        ></el-col
      >
    </el-row>
    <!-- 列表 -->
    <el-row>
      <el-col>
        <el-table :data="listData" ref="list" :max-height="500" style="width: 100%">
          <el-table-column
            label="报价单编号"
            align="center"
            prop="applyNo"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toDetail(scope)">{{ scope.row.applyNo }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="客户名称"
            align="center"
            prop="customerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="业务员"
            align="center"
            prop="salesman"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="报价类型"
            align="center"
            prop="quotedType"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ dict.label.quote_quote_type[scope.row.quotedType] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ dict.label.quote_quote_state[scope.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          />
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
import { getQuoteList } from '@/api/quote/quote'
import { listDept } from '@/api/system/dept'
export default {
  name: 'QuoteList',
  dicts: ['quote_quote_type', 'quote_quote_state'],
  data() {
    return {
      // 查询参数
      queryParams: {
        applyNo: '', //申请单编号
        customerName: '', //客户名称
        deptId: '', // 部门
        quotedType: '', //报价类型
        /**
         * 状态
         * 0未提交申请单（保存）
         * 1已提交申请单
         * 2开发部已提交
         * 3开发部驳回
         * 4已提交报价
         * 5报价驳回
         * 6申请人重申
         * 7申请人确认完结
         */
        status: '',
        salesman: '', // 业务员
        statusTag: '', //页签状态 10待提交，20进行中，30已完结，40已驳回
        dateTimePicker: ['', ''], //时间区间 Array
      },
      //类型标签
      listTypes: [
        { label: '全部', num: 0, isActive: true, type: 'primary', value: '' },
        {
          label: '待提交',
          num: 0,
          isActive: false,
          type: 'success',
          value: 10,
        },
        { label: '进行中', num: 0, isActive: false, type: 'info', value: 20 },
        { label: '已完结', num: 0, isActive: false, type: 'danger', value: 30 },
        {
          label: '已驳回',
          num: 0,
          isActive: false,
          type: 'warning',
          value: 40,
        },
      ],
      //列表数据
      listData: [],
      deptsList: [],
      total: 0,
      pageNum: 1,
      pageSize: 30,
    }
  },
  methods: {
    getList() {
      const {
        applyNo,
        customerName,
        deptId,
        quotedType,
        status,
        salesman,
        statusTag,
        dateTimePicker,
      } = this.queryParams
      const { pageNum, pageSize } = this
      const data = {
        applyNo,
        customerName,
        deptId,
        quotedType,
        startTime: dateTimePicker[0],
        endTime: dateTimePicker[1],
        status,
        salesman,
        statusTag,
        pageNum,
        pageSize,
      }
      getQuoteList(data).then((res) => {
        // 更新页签数据

        if (statusTag === '') {
          this.listTypes.forEach((item) => {
            item.num = 0
          })
          res.rows.forEach((element) => {
            const state = element.status
            this.listTypes[0].num += 1
            switch (state) {
              case 0:
                //待提交
                this.listTypes[1].num += 1
                break
              case 1:
              case 2:
              case 4:
              case 6:
                //进行中
                this.listTypes[2].num += 1
                break
              case 7:
                //已完结
                this.listTypes[3].num += 1
                break
              case 3:
              case 5:
                //已驳回
                this.listTypes[4].num += 1
                break
              default:
                break
            }
          })
        }
        // 赋值数据
        this.listData = res.rows
        this.total = res.total
      })
    },
    getDeptList() {
      listDept().then((res) => {
        this.deptsList = res.data
      })
    },
    toDetail(scope) {
      const id = scope.row.applyNo
      this.$router.push({ path: `/quote/quoteDetail/${id}` })
    },
    resetQuery() {
      this.queryParams = {
        applyNo: '', //申请单编号
        customerName: '', //客户名称
        deptId: '', // 部门
        quotedType: '', //报价类型
        status: '',
        salesman: '', // 业务员
        statusTag: '', //页签状态 10待提交，20进行中，30已完结，40已驳回
        dateTimePicker: ['', ''], //时间区间 Array
      }
    },
    /**
     * 重置状态标签
     */
    resetStateTags() {
      this.listTypes.forEach((item) => {
        item.isActive = false
      })
      this.listTypes[0].isActive = true
      this.queryParams.statusTag = ''
    },
    /**
     * 点击页签发起请求
     * @param {object} item 点击的页签数据项
     */
    handleStateTag(item) {
      if (item.isActive) {
        return
      }
      this.listTypes.forEach((element) => {
        element.isActive = false
      })
      item.isActive = true
      this.queryParams.statusTag = item.value
      //发起请求
      this.getList()
    },
    handleQuery() {
      this.resetStateTags()
      this.pageNum = 1
      this.queryParams.statusTag = ''
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: `/quote/quoteDetail` })
    },
    test(scope) {
      console.log(scope)
    },
  },
  created() {
    this.getList()
    this.getDeptList()
  },
  activated() {
    this.getList()
    this.getDeptList()
  },
  destroyed() {},
  deactivated() {},
}
</script>

<style lang="scss" scoped>
.mb18 {
  margin-bottom: 18px;
}
.el-form-item {
  .el-select {
    width: 150px;
  }
  ::v-deep .el-form-item__content {
    width: 150px;
  }
}
.time-picker {
  ::v-deep .el-form-item__content {
    width: auto;
  }
}
</style>
