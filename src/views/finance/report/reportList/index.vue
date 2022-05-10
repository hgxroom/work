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
      <el-button @click="addList" v-hasPermi="['finance:report:addReport:add']">新增</el-button>
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
        {{ item.name }}
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      tabBtn: [
        {
          name: '全部',
          type: 0,
        },
        {
          name: '草稿',
          type: 1,
        },
        {
          name: '待报价',
          type: 2,
        },
        {
          name: '待审核',
          type: 3,
        },
        {
          name: '已审核',
          type: 4,
        },
        {
          name: '已驳回',
          type: 5,
        },
      ],
      queryParams: {
        bjdh: '',
        ywy: '',
        khmc: '',
        bm: '',
        dateTimePicker: '',
        bh: '',
      },
    }
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {
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
