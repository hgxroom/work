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
            <el-input v-model="queryParams.bjdh"></el-input>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="queryParams.ywy"></el-input>
          </el-form-item>

          <el-form-item label="客户名称">
            <el-input v-model="queryParams.khmc"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="queryParams.bm"></el-input>
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
            <el-input v-model="queryParams.bh"></el-input>
          </el-form-item> </el-form
      ></el-col>
      <el-col style="width: 224px">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="addProduct" class="add-btn">新增</el-button>
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
            prop="applyNo"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toDetail(scope)">{{ scope.row.applyNo }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            prop="customerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="客户名称"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="布号"
            align="center"
            prop="salesman"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="提交人"
            align="center"
            prop="quotedType"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="部门" align="center" prop="status" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="最终客户"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="提交日期"
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
export default {
  data() {
    return {
      pageSize: '',
      pageNum: '',
      total: '',
      listData: [], //数据
      type: 0,
      tabBtn: [
        {
          name: '全部',
          type: 0,
          num: '1',
        },
        {
          name: '草稿',
          type: 1,
          num: '2',
        },
        {
          name: '待报价',
          type: 2,
          num: '3',
        },
        {
          name: '待审核',
          type: 3,
          num: '4',
        },
        {
          name: '已审核',
          type: 4,
          num: '5',
        },
        {
          name: '已驳回',
          type: 5,
          num: '6',
        },
      ],
      queryParams: {
        bjdh: '',
        ywy: '',
        khmc: '',
        bm: '',
        dateTimePicker: ['', ''],
        bh: '',
        state: '',
      },
    }
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {
    //重置
    resetQuery() {
      this.queryParams.bjdh = ''
      this.queryParams.ywy = ''
      this.queryParams.khmc = ''
      this.queryParams.bm = ''
      this.queryParams.dateTimePicker = ''
      this.queryParams.bh = ''
      this.getList()
    },
    //获取数据
    getList() {
      const { bjdh, ywy, khmc, bm, bh, dateTimePicker } = this.queryParams
      let data = {}
      if (this.queryParams.dateTimePicker == null) {
        data = {
          bjdh,
          ywy,
          khmc,
          bm,
          bh,
          startTime: '',
          endTime: ' ',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      } else {
        data = {
          bjdh,
          ywy,
          khmc,
          bm,
          bh,
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
    addList() {
      let url = '/finance/addReport'
      this.$router.push({ path: url })
    },
    //状态选择
    checkTab(val) {
      this.type = val
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
