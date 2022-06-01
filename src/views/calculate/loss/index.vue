<template>
  <div class="app-container">
    <div class="card-box">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="search-group">
            <el-form :inline="true">
              <el-form-item label="输入布号">
                <el-input v-model="searchValue"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="searchOption.loading" @click="handleSearch">{{
                  searchOption.showText
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-group" v-if="fabricInfo">
            <div class="base-info">
              <div class="info-item">
                <span class="info-label">织造损耗：</span>
                <el-tag class="info-value">{{ fabricInfo.textileLossResult }}%</el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">染整损耗：</span>
                <el-tag class="info-value">{{ fabricInfo.dyeingLossResult }}%</el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">布号：</span>
                <el-tag class="info-value">{{ fabricInfo.clothNo }}</el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">有效门幅：</span>
                <el-tag class="info-value">{{ fabricInfo.doorWidth }}</el-tag>
              </div>
            </div>
            <div class="yarn-list">
              <el-table :data="fabricInfo.rawYarnVoList">
                <el-table-column
                  label="物料编号（纱支编号）"
                  align="center"
                  prop="wlbh"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  label="纱支成分"
                  align="center"
                  prop="wlmch"
                  :show-overflow-tooltip="false"
                />
                <el-table-column
                  label="纱支比例"
                  align="center"
                  prop="bl"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope"> {{ scope.row.bl }}% </template></el-table-column
                >
              </el-table>
              <!-- <div class="yarn-list--nodata">无纱支信息，请在右边计算</div> -->
            </div>
            <div class="route-info">工艺路线：{{ fabricInfo.workmanshipRoute }}</div>
          </div>
        </el-col>
        <div class="divider"></div>
        <el-col :span="12">
          <el-collapse v-model="showCollapse" style="margin-bottom: 10px">
            <el-collapse-item title="计算输入(可折叠)">
              <div class="check-box">
                <div class="fabric-proportion">
                  纱支比例
                  <el-input v-model="fabricProportion" class="check-input" size="mini">
                    <template slot="append">%</template>
                  </el-input>
                </div>
                <div class="check-item" v-for="(item, index) in fabricLoss" :key="index">
                  <div class="check-title">{{ item.component }}</div>
                  <el-input v-model="item.value" class="check-input" size="mini"
                    ><template slot="append">%</template></el-input
                  >
                </div>
              </div>
              <div class="btn-group">
                <el-button type="primary" @click="handleSaveInfo"> 保存信息 </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>

          <div class="btn-group">
            <el-button type="warning" v-if="calculateList.length !== 0" @click="resetCalculateList">
              清空列表
            </el-button>
          </div>

          <el-table :data="calculateList">
            <el-table-column label="纱支成分" align="center" prop="showText" />
            <el-table-column
              label="纱支比例"
              align="center"
              prop="fabricProportion"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope"> {{ scope.row.fabricProportion }}% </template>
            </el-table-column>
            <el-table-column
              label="织造损耗"
              align="center"
              prop="textileLossResult"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope"> {{ scope.row.textileLossResult }}% </template>
            </el-table-column>
            <el-table-column
              label="染整损耗"
              align="center"
              prop="dyeingLossResult"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope"> {{ scope.row.dyeingLossResult }}% </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click.native.prevent="handleListDel(scope)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="special-group" v-if="calculateList.length !== 0">
            <el-form>
              <el-form-item label="有效门幅">
                <el-input v-model="doorWidth">
                  <template slot="append">cm</template>
                </el-input>
              </el-form-item>

              <el-form-item label="特殊工艺">
                <el-checkbox-group v-model="craftListCheck">
                  <el-checkbox v-for="(item, index) in craftList" :key="index" :label="index">{{
                    item.name
                  }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-group" v-if="calculateList.length !== 0">
            <div class="base-info">
              <div class="info-item">
                <span class="info-label">织造损耗：</span>
                <el-tag class="info-value">{{ SunTextileLoss }}%</el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">染整损耗：</span>
                <el-tag class="info-value">{{ SunDyeingLoss }}%</el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { findFabricInfo, findComponentLoss } from '@/api/calculate/weavingLoss'

export default {
  data() {
    return {
      searchValue: '',
      searchOption: {
        loading: false,
        showText: '搜索',
      },
      /** 布号对应的信息 */
      fabricInfo: null,
      /** 布料比例 */
      fabricProportion: null,
      showCollapse: [],
      /** 各成分损耗 */
      fabricLoss: null,
      /** 计算展示表 */
      calculateList: [],
      /** 工艺表 */
      craftList: Object.freeze([
        { name: '蚀毛', value: 1 },
        { name: '烧毛', value: 0.5 },
        { name: '烧毛收布', value: 0.5 },
        { name: '烧毛发布', value: 0.5 },
        { name: '外发烧毛', value: 0.5 },
        { name: '浆切边定型', value: 1 },
        { name: '浆切边定型前', value: 1 },
        { name: '浆切边定型中', value: 1 },
        { name: '浆切边定型后', value: 1 },
        { name: '起毛收布', value: 1 },
        { name: '起毛', value: 1 },
        { name: '起毛发布', value: 1 },
        { name: '外发起毛', value: 1 },
        { name: '双面起毛', value: 1 },
        { name: '双面磨毛', value: 1 },
        { name: '外发磨毛', value: 1 },
        { name: '磨毛收布', value: 1 },
        { name: '磨毛', value: 1 },
        { name: '磨毛发布', value: 1 },
        { name: '剪毛收布', value: 0.3 },
        { name: '剪毛', value: 0.3 },
        { name: '剪毛发布', value: 0.3 },
        { name: '外发剪毛', value: 0.3 },
        { name: '双面剪毛', value: 0.3 },
      ]),
      /** 选择工艺表 */
      craftListCheck: [],
      /** 面料幅宽低于150 */
      doorWidth: null,
    }
  },
  computed: {
    SunDyeingLoss: function () {
      let result = 0
      // 算填入信息
      this.calculateList.forEach((item) => {
        result += parseFloat(item.dyeingLossResult)
      })
      // 算门幅
      if (parseFloat(this.doorWidth) < 150) {
        result += 3
      }
      // 算特殊工艺
      this.craftListCheck.forEach((index) => {
        const item = this.craftList[index]
        result += parseFloat(item.value)
      })
      result = result.toFixed(2)
      return result
    },
    SunTextileLoss: function () {
      let result = 0
      // 算填入信息
      this.calculateList.forEach((item) => {
        result += parseFloat(item.textileLossResult)
      })
      // 算门幅
      // if (parseFloat(this.doorWidth) < 150) {
      //   result += 3
      // }
      // 算特殊工艺
      // this.craftListCheck.forEach((index) => {
      //   const item = this.craftList[index]
      //   result += parseFloat(item.value)
      // })
      result = result.toFixed(2)
      return result
    },
    calculateInputPass: function () {
      let fabricProportion = parseFloat(this.fabricProportion)
      if (isNaN(fabricProportion) || fabricProportion <= 0 || fabricProportion > 100) {
        return false
      }

      return true
    },
  },
  methods: {
    /** 根据布号获取信息 */
    getFabricInfo(order) {
      findFabricInfo(order).then((res) => {
        this.fabricInfo = res.data
      })
    },
    /**获取所有成分的损耗比例 */
    getFabricLoss() {
      findComponentLoss().then((res) => {
        const result = []
        res.data.forEach((item) => {
          const { component, dyeingLoss, textileLoss } = item
          const temp = { component, dyeingLoss, textileLoss, value: '' }
          result.push(temp)
        })
        this.fabricLoss = result
      })
    },
    /** 重置计算填入信息 */
    resetCalculate() {
      this.fabricProportion = null
      this.fabricLoss.forEach((item) => {
        item.value = ''
      })
      this.showCollapse = []
    },
    /** 重置计算列表 */
    resetCalculateList() {
      this.calculateList = []
    },
    handleSearch() {
      const searchValue = this.searchValue
      if (!searchValue) {
        return
      }
      // 视觉上处理
      this.searchOption.loading = true
      // let count = 30
      let count = 0
      this.searchOption.showText = `冷却(${count})`
      const timer = setInterval(() => {
        count -= 1
        if (count <= 0) {
          clearInterval(timer)
          this.searchOption.loading = false
          this.searchOption.showText = '搜索'
        } else {
          this.searchOption.showText = `冷却(${count})`
        }
      }, 1000)
      // 功能处理
      this.getFabricInfo(this.searchValue)
    },
    handleSaveInfo() {
      let showText = ''
      let fabricProportion = parseFloat(this.fabricProportion)
      let dyeingLossResult = 0
      let textileLossResult = 0
      // 判断输入
      if (!this.calculateInputPass) {
        this.$message({
          message: '输入信息不符合要求',
          type: 'error',
        })
        return
      }

      const deepCopy = _.cloneDeep(this.fabricLoss)
      const filterList = deepCopy.filter((item) => {
        // 非空而且是数字
        const isNotEmpty = item.value !== ''
        const isNumber = !isNaN(item.value)
        return isNotEmpty && isNumber
      })

      // 输入的值不能大于100
      const fabricInputFalse = filterList.some((item) => {
        return parseFloat(item.value) > 100
      })

      if (filterList.length === 0 || fabricInputFalse) {
        this.$message({
          message: '输入信息有误',
          type: 'error',
        })
        return
      }

      filterList.forEach((item) => {
        // 染损
        dyeingLossResult +=
          item.dyeingLoss * 0.01 * parseFloat(item.value) * 0.01 * fabricProportion
        // 织损
        textileLossResult +=
          item.textileLoss * 0.01 * parseFloat(item.value) * 0.01 * fabricProportion
        showText += `${item.component}${item.value}% / `
      })

      const result = {
        filterList,
        showText,
        fabricProportion,
        dyeingLossResult: dyeingLossResult.toFixed(2),
        textileLossResult: textileLossResult.toFixed(2),
      }
      this.calculateList.push(result)
      this.resetCalculate()
    },
    handleListDel(scope) {
      console.log(scope)
      this.$confirm('确定删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.calculateList.splice(scope.$index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  created() {
    this.getFabricLoss()
  },
}
</script>
<style lang="scss" scoped>
.base-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 22px;
  .info-item {
    width: 50%;
    padding: 8px;
    .info-label {
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 10px;
    }
  }
}
.yarn-list {
  margin-bottom: 22px;
  &--nodata {
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 10px 0;
  }
}

.route-info {
  text-align: center;
}
.btn-group {
  display: flex;
  flex-direction: row-reverse;
  margin: 0 0 10px;
  > button {
    margin: 0 5px;
  }
}

.fabric-proportion {
  width: 100%;
  margin: 10px;
}
.check-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // justify-content: space-between;
  .check-item {
    display: block;
    width: 78px;
    margin: 10px;
    flex: 1 0 auto;
  }
  .check-title {
    color: #000;
    font-size: 14px;
    font-weight: bold;
  }
  .check-input {
    color: #000;
    ::v-deep .el-input-group__append {
      padding: 0 5px;
    }
  }
}

.divider {
  display: block;
  position: absolute;
  width: 1px;
  height: 100%;
  top: 0;
  left: 50%;
  background-color: #dcdfe6;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
