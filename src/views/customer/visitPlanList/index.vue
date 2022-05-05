<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryForm" label-width="90px" :inline="true">
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
          v-hasPermi="['customer:plan:add']"
          >新增</el-button
        ></el-col
      >
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
        label="标题名称"
        align="center"
        prop="titleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="拜访对象"
        align="center"
        prop="visitObject"
        :show-overflow-tooltip="false"
      />
      <el-table-column label="职位" align="center" prop="position" :show-overflow-tooltip="false" />

      <el-table-column label="拜访时间" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.planStartTime }}</span> -
          <span>{{ scope.row.planEndTime.slice(10, 19) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="visitState"
        :show-overflow-tooltip="false"
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
            icon="el-icon-monitor"
            @click.native.prevent="handleEditStatus('已取消', scope)"
            v-if="scope.row.visitState == '未开始' || scope.row.visitState == '未完成'"
            >取消</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.prevent="handleFromCustomer('edit', scope)"
            v-hasPermi="['customer:visit:edit']"
            v-if="scope.row.visitState == '未开始'"
            >改期</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['customer:visit:edit']"
            @click.native.prevent="handleEditStatus('已完成', scope)"
            v-if="
              scope.row.visitState == '进行中' ||
              scope.row.visitState == '未完成' ||
              scope.row.visitState == '未开始'
            "
            >确认拜访</el-button
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
import {
  getVisitList,
  getCustomerVisitPlan,
  editCustomerVisitPlan,
} from '@/api/customer/visitPlanList'
import { listDept } from '@/api/system/dept'
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        deptId: '',
        visitState: '',
        dateTimePicker: ['', ''], //时间区间 Array
      },
      // loading
      loading: false,
      // 总条数
      total: 0,
      listData: [],
      pageNum: 1,
      pageSize: 30,

      selectionList: [], //多选选择数据
      deptsList: [],
      //类型标签
      listTypes: [
        { label: '全部', num: 0, isActive: true, type: 'primary', value: '' },
        {
          label: '未开始',
          num: 0,
          isActive: false,
          type: 'success',
          value: '未开始',
        },
        { label: '进行中', num: 0, isActive: false, type: 'info', value: '进行中' },
        { label: '未完成', num: 0, isActive: false, type: 'danger', value: '未完成' },
        {
          label: '已完成',
          num: 0,
          isActive: false,
          type: 'warning',
          value: '已完成',
        },
        {
          label: '已取消',
          num: 0,
          isActive: false,
          type: 'info',
          value: '已取消',
        },
        {
          label: '已改期',
          num: 0,
          isActive: false,
          type: 'danger',
          value: '已改期',
        },
      ],
    }
  },

  methods: {
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
      this.queryParams.visitState = item.value
      //发起请求
      this.getList()
    },
    getDeptList() {
      listDept().then((res) => {
        this.deptsList = res.data
      })
    },
    /**
     * 获取拜访信息列表
     */
    getList() {
      const { deptId, visitState, dateTimePicker } = this.queryParams
      const { pageNum, pageSize } = this
      let data = {}
      if (this.queryParams.dateTimePicker == null) {
        data = {
          deptId,
          visitState,
          planStartTime: '',
          planEndTime: '',
          pageNum,
          pageSize,
        }
      } else {
        data = {
          deptId,
          visitState,
          planStartTime: dateTimePicker[0],
          planEndTime: dateTimePicker[1],
          pageNum,
          pageSize,
        }
      }
      console.log(data)
      getCustomerVisitPlan(data).then((res) => {
        if (visitState === '') {
          this.listTypes.forEach((item) => {
            item.num = 0
          })
          res.rows.forEach((element) => {
            const state = element.visitState
            this.listTypes[0].num += 1
            switch (state) {
              case '未开始':
                //待提交
                this.listTypes[1].num += 1
                break
              case '进行中':
                this.listTypes[2].num += 1
                break
              case '未完成':
                this.listTypes[3].num += 1
                break
              case '已完成':
                this.listTypes[4].num += 1
                break
              case '已取消':
                this.listTypes[5].num += 1
                break
              case '已改期':
                this.listTypes[6].num += 1
                break

              default:
                break
            }
          })
        }
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },
    handleFromCustomer(type, scope) {
      let url = '/customer/visitPlanDetails'
      if (scope) {
        let id = scope.row.id
        url = `/customer/visitPlanDetails/${id}`
      }
      this.$router.push({ path: url, query: { type } })
    },
    handleCreate() {
      this.$router.push({ path: `/customer/visitPlanDetails` })
    },
    handleEditStatus(val, item) {
      if (val == '已取消') {
        item.row.visitState = val
        editCustomerVisitPlan(item.row),
          then((res) => {
            this.getList()
          })
      } else if (val == '已完成') {
        item.row.visitState = val

        this.$router.push({
          path: `/customer/visitDetails`,
          query: { type: 'addPlanVisit', planVisit: JSON.stringify(item.row) },
        })
      }
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
}
</script>
<style>
.mb18 {
  margin-bottom: 18px;
}
.content-colum {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* for Opera */
}
</style>
