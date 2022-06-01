<template>
  <div class="app-container wrapper">
    <div class="card-box">
      <!-- 搜索栏 -->
      <el-row>
        <el-col class="search-col-from">
          <el-form
            :model="queryParams"
            ref="queryForm"
            class="search-form"
            label-width="90px"
            :inline="true"
          >
            <el-form-item label="部门">
              <el-select v-model="queryParams.deptId">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(dict, index) in deptsList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
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
          </el-form>
        </el-col>
        <el-col class="search-col-btn">
          <el-button type="primary" @click="handleQueryBtn">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="card-box">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" class="add-btn" @click="handleCreate">新增</el-button>
        </el-col>
      </el-row>
      <!-- 列表状态 -->
      <el-row class="tab_head">
        <div style="display: flex">
          <div
            @click="handleStateTag(item)"
            class="tab_box"
            :class="item.value == queryParams.visitState ? 'tab_checked' : ''"
            v-for="(item, index) in listTypes"
            :key="item.name"
          >
            {{ item.name }} ({{ item.num }})
          </div>
        </div>
      </el-row>

      <!-- 列表 -->
      <el-row>
        <el-col>
          <el-table :data="listData" style="width: 100%" :max-height="500">
            <!-- <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->

            <el-table-column
              label="客户名称"
              align="left"
              prop="customerName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="品牌名称"
              align="left"
              prop="brandName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="业务员"
              align="left"
              prop="salesman"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="标题名称"
              align="left"
              prop="titleName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="拜访对象"
              align="left"
              prop="visitObject"
              :show-overflow-tooltip="false"
            />
            <el-table-column
              label="职位"
              align="left"
              prop="position"
              :show-overflow-tooltip="false"
            />

            <el-table-column label="拜访时间" align="left" :show-overflow-tooltip="true">
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
                  icon="el-icon-edit"
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
</template>
<script>
import {
  getCustomerVisitPlan,
  editCustomerVisitPlan,
  getPlanVisitDeptList,
  getStateList,
} from '@/api/customer/visitPlanList'
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
      showFlag: false,
      selectionList: [], //多选选择数据
      deptsList: [],

      //类型标签
      listTypes: [
        { name: '全部', num: 0, isActive: true, type: 'primary', value: '' },
        {
          name: '未开始',
          num: 0,
          isActive: false,
          type: 'success',
          value: '未开始',
        },
        { name: '进行中', num: 0, isActive: false, type: 'info', value: '进行中' },
        { name: '未完成', num: 0, isActive: false, type: 'danger', value: '未完成' },
        {
          name: '已完成',
          num: 0,
          isActive: false,
          type: 'warning',
          value: '已完成',
        },
        {
          name: '已取消',
          num: 0,
          isActive: false,
          type: 'info',
          value: '已取消',
        },
        {
          name: '已改期',
          num: 0,
          isActive: false,
          type: 'danger',
          value: '已改期',
        },
      ],
    }
  },

  methods: {
    //获取状态数量
    getState(val) {
      delete val.visitState
      delete val.pageNum
      delete val.pageSize
      getStateList(val).then((res) => {
        this.listTypes[0].num = res.data.all
        this.listTypes[1].num = res.data.unStarted
        this.listTypes[2].num = res.data.Starting
        this.listTypes[3].num = res.data.unComplete
        this.listTypes[4].num = res.data.complete
        this.listTypes[5].num = res.data.cancel
        this.listTypes[6].num = res.data.reschedule
      })
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
      this.queryParams.visitState = item.value
      //发起请求
      this.getList()
    },
    getDeptList() {
      getPlanVisitDeptList().then((res) => {
        this.deptsList = res.data.secondarySector
        this.showFlag = res.data.showFlag
      })
    },
    resetQuery() {
      this.queryParams.deptId = ''
      this.queryParams.visitState = ''
      this.queryParams.dateTimePicker = ['', '']
      this.getList()
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
      getCustomerVisitPlan(data).then((res) => {
        this.getState(data)
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },
    handleFromCustomer(type, scope) {
      let id = scope.row.id
      let url = `/customer/visitPlanDetails/${id}`
      if (type == 'detail') {
        this.$router.push({ path: url, query: { type } })
      } else {
        this.$confirm('是否要将该计划延期？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            scope.row.visitState = '已改期'

            this.$router.push({ path: url, query: { type: type, data: JSON.stringify(scope.row) } })
            // editCustomerVisitPlan(scope.row).then((res) => {

            // })
          })
          .catch(() => {})
      }
    },
    handleCreate() {
      debugger
      this.$router.push({ path: `/customer/visitPlanDetails` })
    },
    handleEditStatus(val, item) {
      let self = this
      if (val == '已取消') {
        self
          .$confirm('是否确认取消拜访?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            self.$message({
              type: 'success',
              message: '取消成功!',
            })
            item.row.visitState = val
            editCustomerVisitPlan(item.row).then((res) => {
              self.getList()
            })
          })
          .catch(() => {})
      } else if (val == '已完成') {
        item.row.visitState = val

        self.$router.push({
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
