<!-- 自建产品列表 -->
<template>
  <div class="app-container">
    <div class="card-box">
      <!-- 搜索栏 -->
      <!-- 搜索和筛选栏 -->
      <el-row>
        <el-col style="width: calc(100% - 224px)">
          <el-form
            class="base-form"
            :model="queryParams"
            ref="queryForm"
            label-width="90px"
            :inline="true"
          >
            <el-form-item label="布号">
              <el-input
                v-model="queryParams.newClothNo"
                placeholder="请输入布号"
                clearable
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="布类">
              <!-- 搜索框 -->
              <el-autocomplete
                v-model="queryParams.clothType"
                :fetch-suggestions="queryClothType"
                placeholder="请输入布类"
                @select="handleSelectClothType"
                style="width: 100%"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.dictLabel }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="织机规格">
              <!-- 搜索框 -->
              <el-autocomplete
                v-model="queryParams.loomSpecification"
                :fetch-suggestions="queryLoomSpecification"
                placeholder="请输入织机规格"
                @select="handleSelectLoomSpecification"
                style="width: 100%"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.dictLabel }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="width: 224px">
          <el-button type="primary" @click="handleQueryBtn">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="card-box">
      <el-row>
        <el-col :span="12">
          <el-button style="color: #fff" @click="addProduct" class="add-btn">新增</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right"></el-col>
      </el-row>
      <!-- 列表 -->
      <el-table
        :data="listData"
        ref="customerList"
        style="width: 100%"
        border
        :max-height="550"
        :row-style="rowstyle"
      >
        <el-table-column label="序号" align="center" width="60px">
          <template v-slot="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="布号"
          align="left"
          prop="newClothNo"
          width="170px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="cloBtn" @click="toDetail(scope)">{{ scope.row.newClothNo }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="参考布号"
          align="left"
          prop="referenceClothNo"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="品名"
          align="left"
          prop="productName"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="布类" align="left" prop="clothType" :show-overflow-tooltip="true" />
        <!-- <el-table-column
        label="纱线品名"
        align="left"
        prop="salesman"
        :show-overflow-tooltip="true"
      /> -->
        <!-- <el-table-column
        label="纱线编号"
        align="left"
        prop="salesman"
        :show-overflow-tooltip="true"
      /> -->
        <el-table-column label="纱线品名" align="left" width="280px" :show-overflow-tooltip="true">
          <template v-slot="scope">
            <div class="tab-div" v-for="(j, index) in scope.row.buildProductYarnList" :key="index">
              {{ j.yarnName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="纱线编号" width="120px" align="left" :show-overflow-tooltip="true">
          <template v-slot="scope">
            <div class="tab-div" v-for="(j, index) in scope.row.buildProductYarnList" :key="index">
              {{ j.yarnNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="纱线比例" align="left" :show-overflow-tooltip="true">
          <template v-slot="scope">
            <div class="tab-div" v-for="(j, index) in scope.row.buildProductYarnList" :key="index">
              {{ j.yarnRatio }}
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column
        label="纱线比例"
        align="left"
        prop="customerArea"
        :show-overflow-tooltip="true"
      /> -->
        <el-table-column
          label="克重(g/m2)"
          align="left"
          width="100px"
          prop="gramWeight"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="幅宽(cm)"
          align="left"
          prop="widthCloth"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="成分" align="left" prop="component" :show-overflow-tooltip="true" />
        <el-table-column
          label="织机规格"
          align="left"
          prop="loomSpecification"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="特殊工艺"
          align="left"
          prop="specialProcessName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="功能性承诺"
          width="100px"
          align="left"
          prop="functionName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建人"
          align="left"
          prop="createBy"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建时间"
          align="left"
          prop="createTime"
          width="170px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="状态"
          align="center"
          fixed="right"
          prop="status"
          width="112px"
          :show-overflow-tooltip="true"
        >
          <template v-slot="scope">
            <div :style="scope.row.status == '0' ? 'color: #00a870' : ''">
              {{ statusFilter(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="112px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="mini"
              type="text"
              icon="el-icon-monitor"
              @click.native.prevent="handleFromCustomer(scope.row, scope.row.status)"
              >禁用</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.native.prevent="handleFromCustomer(scope.row, scope.row.status)"
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
  </div>
</template>
<script>
import { getCustomerList, customerExport } from '@/api/customer/customer'
import { getProductList, getDictList, editStatus } from '@/api/finance/report'
import { dictMap } from '../createProduct/utils'

export default {
  dicts: dictMap,
  data() {
    return {
      // 查询参数
      queryParams: {
        newClothNo: '', //布号
        clothType: '', //布类
        loomSpecification: '', //织机规格
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
    rowstyle(row) {
      console.log('row=======', row)
      if (row.row.status == '1') {
        let a = {
          color: '#C5C5C5',
        }
        return a
      }
    },
    toDetail(val) {
      let url = '/finance/addCreateProduct'
      this.$router.push({ path: url, query: { type: 'detail', id: val.row.id } })
    },
    //选择布类
    handleSelectClothType(item) {
      this.queryParams.clothType = item.dictLabel
    },
    //模糊搜索布类
    queryClothType(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      let data = {
        dictType: 'fabric_type',
        dictLabel: queryString,
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        console.log(data, 'data===')
        getDictList(data).then((res) => {
          cb(res.rows)
        })
      }, 700)
    },
    //选择织机规模
    handleSelectLoomSpecification(item) {
      this.queryParams.loomSpecification = item.dictLabel
    },
    //模糊搜索织机规模
    queryLoomSpecification(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      let data = {
        dictType: 'loom_specifications',
        dictLabel: queryString,
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        console.log(data, 'data===')
        getDictList(data).then((res) => {
          cb(res.rows)
        })
      }, 700)
    },
    statusFilter(type) {
      let obj = {
        0: '已启用',
        1: '已禁用',
        2: '删除',
      }
      return obj[type]
    },
    //重置
    resetQuery() {
      this.queryParams.newClothNo = '' //布号
      this.queryParams.clothType = '' //布类
      this.queryParams.loomSpecification = '' //织机规格
      this.pageNum = 1
      this.getList()
    },
    //新增自建产品
    addProduct() {
      let url = '/finance/addCreateProduct'

      this.$router.push({ path: url, query: { type: 'edit' } })
    },
    /**
     * 获取客户信息列表
     */
    getList() {
      const { newClothNo, clothType, loomSpecification } = this.queryParams
      const { pageNum, pageSize } = this
      let data = {}

      data = {
        newClothNo,
        clothType,
        loomSpecification,
        pageNum: pageNum,
        pageSize: pageSize,
      }
      getProductList(data).then((res) => {
        this.total = res.total
        this.listData = res.rows
      })
    },

    handleQueryBtn() {
      this.pageNum = 1
      this.getList()
    },
    handleFromCustomer(scope, type) {
      let data = {
        type: type === '0' ? '1' : '0',
        id: scope.id,
      }
      editStatus(data).then((res) => {
        this.getList()
      })
      console.log(data)
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
.app-container {
  height: 100%;
  overflow-y: auto;
  .add-btn {
    margin-bottom: 16px;
    background-color: #00a870;
    border-color: #00a870;
    padding: 8px 15px;
  }
  .right-btn {
    margin: 16px 0 16px 16px;
    padding: 8px 15px;
  }
  // margin: 24px;
  // padding: 0 16px;
  .status {
    color: #00a870;
  }
}
.list-expand-form {
  padding-left: 150px;
}
.cloBtn {
  color: #1890ff;
  cursor: pointer;
}
.tab-div {
  border-bottom: 1px solid #dfe6ec;
  margin: 0 -10px;
  padding: 8px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tab-divline {
  padding-left: 0;
  margin-left: 0px;
}
.tab-divline2 {
  padding-right: 0;
  margin-right: 0px;
}
.tab-div:last-child {
  border-bottom: none;
}
.base-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    min-width: 180px;
    width: calc(25% - 40px);
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
</style>
<style>
.el-tooltip__popper {
  max-width: 300px;
}
</style>
