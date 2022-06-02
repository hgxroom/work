<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div class="card-box">
      <el-row :gutter="10" class="mb8" type="flex" justify="space-between">
        <el-col :span="20">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              @click="searchAll('0')"
              :class="queryParams.type == '0' ? 'btn_pitch' : ''"
              >全部</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              @click="searchAll('1')"
              :class="queryParams.type == '1' ? 'btn_pitch' : ''"
              >本周</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              @click="searchAll('2')"
              :class="queryParams.type == '2' ? 'btn_pitch' : ''"
              >本月</el-button
            >
          </el-col>
          <el-col :span="2.5">
            <el-form>
              <el-form-item label="搜索范围" label-width="100px">
                <el-date-picker
                  @change="dateTime"
                  v-model="dateRange"
                  size="small"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
        <el-col :span="4">
          <el-col :span="2.5">
            <el-button
              type="primary"
              @click="changeBtn = true"
              plain
              :class="changeBtn ? 'btn_pitch' : ''"
              >柱形图</el-button
            >
          </el-col>
          <el-col :span="2.5">
            <el-button
              type="primary"
              @click="changeBtn = false"
              plain
              :class="!changeBtn ? 'btn_pitch' : ''"
              >表格</el-button
            >
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="card-box" v-if="!changeBtn">
      <el-table ref="tableData" :data="listData" v-loading="loading" style="width: 100%">
        <el-table-column label="客户及拜访数据汇总表" align="center">
          <el-table-column type="index" width="100" :index="indexType"> </el-table-column>
          <el-table-column label="华东办" align="center" prop="1" />[]
          <el-table-column label="华北办" align="center" prop="2" />
          <el-table-column label="华南办" align="center" prop="3" />
          <el-table-column label="台湾办" align="center" prop="4" />
          <el-table-column label="跨境业务" align="center" prop="5" />
          <el-table-column label="烟台木村" align="center" prop="6" />
          <el-table-column label="合计" align="center" prop="7" />
        </el-table-column>
      </el-table>
    </div>
    <div class="card-box" v-if="changeBtn">
      <!-- 柱形表 -->
      <el-row>
        <bar-chart :xAxisList="xAxisList" :charList="charList" :width="'80%'"></bar-chart>
      </el-row>
    </div>
  </div>
</template>

<script>
import BarChart from '@/views/dashboard/visit_BarChart.vue'
import { getCustomersList, getgetSecondarySector } from '@/api/customer/visitrecord'
export default {
  components: { BarChart },
  data() {
    return {
      changeBtn: true, //切换按钮
      dateRange: [],
      // 查询参数
      queryParams: {
        beginTime: '', //开始时间
        endTime: '', //结束时间
        type: '0', //查询类型
      },
      // loading
      charList: [], //图形数据
      xAxisList: [],
      loading: false,
      // 总条数
      total: 0,
      labelList: [],
      listData: [],
      pageNum: 1,
      pageSize: 10,
      selectionList: [], //多选选择数据
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dateTime() {
      if (this.dateRange.length == 0) {
        this.queryParams.beginTime == ''
        this.queryParams.endTime == ''
      } else {
        this.queryParams.beginTime = this.dateRange[0]
        this.queryParams.endTime = this.dateRange[1]
      }
      this.queryParams.type = '3'
      this.getList()
    },
    searchAll(type) {
      this.dateRange = []
      this.queryParams.beginTime = ''
      this.queryParams.endTime = ''
      this.queryParams.type = type
      this.getList()
    },
    getList() {
      const { beginTime, endTime, type } = this.queryParams
      const data = {
        beginTime,
        endTime,
        type,
      }
      getCustomersList(data).then((res) => {
        this.listData = res.data
        this.transformChar(this.listData, 1)
      })
    },
    // 转化成柱形表格式
    transformChar(data, type) {
      this.charList = []
      let xlist = []
      data.forEach((val) => {
        let list = []
        switch (type) {
          case 0:
            xlist.push(val.label)
            break
          case 1:
            for (let i in val) {
              if (i == 7) {
              } else {
                list.push(val[i])
              }
            }
            this.charList.push(list)
            break
          default:
            break
        }
      })
      if (type == 0) {
        this.xAxisList = xlist
      }
    },
    indexType(index) {
      let mark
      switch (index) {
        case 0:
          mark = '客户数'
          break
        case 1:
          mark = '拜访数'
          break
        default:
          mark = '标记头'
          break
      }
      return mark
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button--primary.is-plain.btn_pitch {
  background: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}
</style>
