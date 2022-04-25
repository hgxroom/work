<template>
  <div class="app-container">
    <!-- 客户基础信息 -->
    <el-form
      class="base-form"
      :model="baseInfo"
      ref="baseInfoForm"
      :inline="true"
      label-position="top"
    >
      <el-form-item label="客户编号">
        <el-input v-model="baseInfo.customerNo" placeholder="无需填写" readonly></el-input>
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-input v-model="baseInfo.salesman" placeholder="请输入业务员" readonly></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="baseInfo.customerName" placeholder="请输入客户名称" readonly></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="baseInfo.createTime" placeholder="无需填写" readonly></el-input>
      </el-form-item>
      <el-form-item label="客户区域" prop="customerArea">
        <el-input v-model="baseInfo.customerArea" placeholder="无需填写" readonly></el-input>
      </el-form-item>
      <el-form-item label="营收规模" prop="revenueScale">
        <el-input v-model.number="baseInfo.revenueScale" placeholder="请输入营收规模" readonly>
          <template slot="append">万元</template></el-input
        >
      </el-form-item>
    </el-form>
    <!-- 标签 -->
    <el-row>
      <el-col>
        <el-tabs v-model="tabActiveName">
          <el-tab-pane v-for="(item, index) in brandList" :key="item.id" :name="item.id">
            <span slot="label">{{ item.brandName }}</span>
            <!-- 品牌信息 -->
            <el-form
              class="brand-form"
              :model="item"
              ref="brandInfoForm"
              :inline="true"
              label-position="top"
            >
              <el-form-item label="品牌名称" prop="brandName">
                <el-input v-model="item.brandName" placeholder="请输入品牌名称" readonly></el-input>
              </el-form-item>
              <el-form-item label="营收规模" prop="revenueScale">
                <el-input v-model="item.revenueScale" placeholder="请输入营收规模" readonly>
                  <template slot="append">万元</template></el-input
                >
              </el-form-item>
              <el-form-item label="品牌分层" prop="brandGrade">
                <el-input
                  v-model="item.brandGrade"
                  placeholder="请输入营收规模"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="contacts">
                <el-input v-model="item.contacts" placeholder="请输入联系人" readonly></el-input>
              </el-form-item>
              <el-form-item label="职位" prop="position">
                <el-input v-model="item.position" placeholder="请输入职位" readonly></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="contactInformation">
                <el-input
                  v-model="item.contactInformation"
                  placeholder="请输入联系方式"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="人群圈层" prop="crowdCircle">
                <el-input
                  v-model="item.crowdCircle"
                  placeholder="请输入人群圈层"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="运营模式和能力" prop="operationModeAbility">
                <el-input
                  v-model="item.operationModeAbility"
                  placeholder="请输入运营模式和能力"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="时间节奏" prop="timeRhythm">
                <el-input
                  v-model="item.timeRhythm"
                  placeholder="请输入时间节奏"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="决策链路" prop="decisionLink">
                <el-input v-model="item.decisionLink" placeholder="请选择" readonly></el-input>
              </el-form-item>
              <el-form-item label="合作模式" prop="cooperationMode">
                <el-input v-model="item.cooperationMode" placeholder="请选择" readonly></el-input>
              </el-form-item>
              <el-form-item label="生意目标" prop="businessTarget">
                <el-input v-model="item.businessTarget" placeholder="请选择" readonly></el-input>
              </el-form-item>
              <el-form-item label="品牌占比" prop="brandProportion">
                <el-input v-model.number="item.brandProportion" placeholder="请输入占比" readonly>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="合作意向" prop="cooperationIntention">
                <el-input
                  v-model="item.cooperationIntention"
                  placeholder="请选择"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="销售渠道" prop="distributionChannel">
                <el-input
                  v-model="item.distributionChannel"
                  placeholder="请选择"
                  readonly
                ></el-input>
                <!-- <el-checkbox-group
                  v-model="item.distributionChannel"
                  @change="checkbox"
                  disabled
                >
                  <el-checkbox
                    v-for="(dict, index) in dict.type.customer_sales_channel"
                    :key="dict.value"
                    :label="dict.label"
                    >{{ dict.label }}</el-checkbox
                  >
                </el-checkbox-group> -->
              </el-form-item>
              <el-form-item label="备注" prop="brandRemark">
                <el-input
                  v-model="item.brandRemark"
                  type="textarea"
                  placeholder="请输入备注"
                  readonly
                >
                </el-input>
              </el-form-item>
            </el-form>
            <!-- 两表格 -->
            <el-row type="flex" :gutter="20">
              <el-col :span="10" class="form-table">
                <div class="table-title">覆盖品类及价格带</div>
                <el-table :data="item.categoryList">
                  <el-table-column property="categoryName" label="覆盖品类"> </el-table-column>
                  <el-table-column property="priceSection" label="价格带"> </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="14" class="form-table">
                <div class="table-title">供应商结构</div>
                <el-table :data="item.supplierList" highlight-current-row>
                  <el-table-column property="supplierName" label="供应商名称"> </el-table-column>
                  <el-table-column property="distributionCategory" label="分配品类">
                  </el-table-column
                  ><el-table-column property="shareProportion" label="份额占比"> </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 拜访记录 -->
    <el-row :gutter="20" style="margin-top: 30px; flex-wrap: wrap">
      <el-col class="visitCard" v-for="(item, index) in visitDetailVoList" :key="index">
        <el-card>
          <el-form label-position="right" label-width="90px" size="mini">
            <el-form-item label="拜访时间">
              <el-input v-model="item.visitTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="拜访对象">
              <el-input v-model="item.visitTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="item.visitObject" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="item.position" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="item.visitContent"
                type="textarea"
                :rows="2"
                autosize
                readonly
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            class="cardBtn"
            @click="
              () => {
                readVisit(item.id)
              }
            "
            type="primary"
            size="mini"
            plain
            >查看详情</el-button
          >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { dictMap } from './utils.js'
import { getCustomerById } from '@/api/customer/customer'
export default {
  dicts: dictMap,
  data() {
    return {
      //基础信息
      baseInfo: {
        customerNo: '', //客户编号
        salesman: '', //业务员
        customerName: '', //客户名称
        revenueScale: '', //收入规模
        customerArea: '', //客户区域
        createTime: '', //创建时间
      },
      //品牌列表
      brandList: [],
      //活动tabs
      tabActiveName: '',
      // 拜访记录列表
      visitDetailVoList: [],
    }
  },
  computed: {
    ...mapGetters(['name']),
    customerId: function () {
      const id = this.$route.params.id
      return id ? id : ''
    },
  },
  created() {
    console.log(this.dict)
    this.getData(this.customerId)
  },
  methods: {
    getData(id) {
      if (!id) {
        this.$message({
          message: '当前的客户ID不存在，退回列表页',
          type: 'error',
        })
        const obj = { path: '/customer/customerList' }
        this.$tab.closeOpenPage(obj)
        return
      }
      getCustomerById(this.customerId).then((res) => {
        const {
          customerNo,
          salesman,
          customerName,
          revenueScale,
          customerArea,
          createTime,
          brandList,
          visitDetailVoList,
        } = res.data
        brandList.forEach((element) => {
          element.id = String(element.id)
          // element.distributionChannel = element.distributionChannel.split(",");
        })
        this.baseInfo = {
          customerNo,
          salesman,
          customerName,
          revenueScale,
          customerArea,
          createTime,
        }
        this.brandList = brandList
        this.visitDetailVoList = visitDetailVoList
        if (brandList.length > 0) {
          this.tabActiveName = brandList[0].id
        }
      })
    },
    checkbox(value) {
      console.log(value)
      console.log(this.brandList)
    },
    readVisit(id) {
      console.log(id)
      this.$router.push({ path: `/customer/visitDetailsRead/${id}` })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index';
.visitCard {
  width: 300px;
  margin: 10px 0;
  .cardBtn {
    width: 130px;
    margin: auto;
    display: block;
  }
}
</style>
