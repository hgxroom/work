<template>
  <div class="app-container">
    <!-- 客户基础信息 -->
    <el-form
      class="base-form"
      :model="baseInfo"
      :rules="rules"
      ref="baseInfoForm"
      :inline="true"
      label-width="90px"
      :label-position="labelPosition"
    >
      <el-form-item label="客户编号">
        <el-input
          v-model="baseInfo.customerNo"
          placeholder="无需填写"
          :clearable="type == 'detail' ? false : true"
          disabled
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-input
          v-model="baseInfo.salesman"
          placeholder="无需输入"
          :clearable="type == 'detail' ? false : true"
          disabled
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="baseInfo.customerName"
          placeholder="请输入客户名称"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail input-customer-name' : '']"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input
          v-model="baseInfo.createTime"
          placeholder="无需填写"
          :clearable="type == 'detail' ? false : true"
          disabled
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户区域" prop="customerArea">
        <el-select
          v-model="baseInfo.customerArea"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_area"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <template>
        <el-form-item label="营收规模" prop="revenueScale">
          <template v-if="type !== 'detail'">
            <el-input
              v-model.number="baseInfo.revenueScale"
              placeholder="请输入营收规模"
              :clearable="type == 'detail' ? false : true"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'input-detail' : '']"
            >
              <template slot="append">万元</template>
            </el-input>
          </template>
          <template v-else>
            <div class="unit-detail">{{ baseInfo.revenueScale }}万元</div>
          </template>
        </el-form-item>
      </template>
      <el-form-item label="状态" prop="customerState">
        <el-select
          v-model="baseInfo.customerState"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_state"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 标签 -->
    <el-row>
      <el-col :span="22">
        <el-tabs v-model="tabActiveName" :before-leave="beforeTabsChange">
          <el-tab-pane v-for="(item, index) in brandList" :key="item.id" :name="item.id">
            <span slot="label">{{ item.brandName }}</span>
          </el-tab-pane>
        </el-tabs>
        <div v-if="noBrand">暂无品牌信息，请从右边按钮点击添加</div>
      </el-col>
      <el-col :span="2">
        <!-- 右侧按钮 -->
        <div
          v-if="type !== 'detail'"
          :class="{
            'tab-btn-box': !noBrand,
            'tab-btn-box-noline': noBrand,
          }"
        >
          <div>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              circle
              @click="handleCreateBrand"
            ></el-button>
            <el-button
              :disabled="brandList.length === 0"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="handleDelBrand"
            ></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 品牌信息 -->
    <el-form
      v-if="!noBrand"
      class="brand-form"
      :model="brandInfo"
      :rules="rules"
      ref="brandInfoForm"
      :inline="true"
      label-width="90px"
      :label-position="labelPosition"
    >
      <el-form-item label="品牌名称" prop="brandName">
        <el-input
          v-model="brandInfo.brandName"
          placeholder="请输入品牌名称"
          @input="inputBrandName"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="营收规模" prop="revenueScale">
        <template v-if="type !== 'detail'">
          <el-input v-model.number="brandInfo.revenueScale" placeholder="请输入营收规模">
            <template slot="append">万元</template></el-input
          >
        </template>
        <template v-else>
          <div class="unit-detail">{{ brandInfo.revenueScale }}万元</div>
        </template>
      </el-form-item>
      <el-form-item label="品牌分层" prop="brandGrade">
        <el-select
          v-model="brandInfo.brandGrade"
          placeholder="请选择品牌分层"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_brand_stratification"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input
          v-model="brandInfo.contacts"
          placeholder="请输入联系人"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input
          v-model="brandInfo.position"
          placeholder="请输入职位"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInformation">
        <el-input
          v-model="brandInfo.contactInformation"
          placeholder="请输入联系方式"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
          maxlength="11"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="人群圈层" prop="crowdCircle">
        <el-select
          v-model="brandInfo.crowdCircle"
          multiple
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_crowd_circle"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营模式" prop="operationModeAbility">
        <el-select
          v-model="brandInfo.operationModeAbility"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_operation_mna"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间节奏" prop="timeRhythm">
        <el-select
          v-model="brandInfo.timeRhythm"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_time_rhythm"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="决策链路" prop="decisionLink">
        <el-input
          v-model="brandInfo.decisionLink"
          placeholder="请选择"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        label="合作模式"
        prop="cooperationMode"
        :class="[type == 'detail' ? 'multiple-detail' : '']"
      >
        <el-select
          v-model="brandInfo.cooperationMode"
          multiple
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_cooperate_model"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生意目标" prop="businessTarget">
        <el-select
          v-model="brandInfo.businessTarget"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_business_goals"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌占比" prop="brandProportion">
        <template v-if="type !== 'detail'">
          <el-input v-model="brandInfo.brandProportion" placeholder="请输入占比" clearable>
            <template slot="append">%</template>
          </el-input>
        </template>
        <template v-else>
          <div class="unit-detail">{{ brandInfo.brandProportion || 0 }}%</div>
        </template>
      </el-form-item>
      <el-form-item label="合作意向" prop="cooperationIntention">
        <el-select
          v-model="brandInfo.cooperationIntention"
          placeholder="请选择合作意向"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_cooperation_intention"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售渠道" prop="distributionChannelList">
        <!-- checkbox形式改 select形式 -->
        <!-- <el-checkbox-group v-model="brandInfo.distributionChannelList">
          <el-checkbox
            v-for="(dict, index) in dict.type.customer_sales_channel"
            :key="index"
            :label="dict.label"
            name="type"
            >{{ dict.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <el-select
          v-model="brandInfo.distributionChannelList"
          multiple
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_sales_channel"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="brandRemark"
        :class="['mark-textarea', type == 'detail' ? 'textarea-detail' : '']"
      >
        <el-input
          maxlength="200"
          v-model="brandInfo.brandRemark"
          rows="2"
          type="textarea"
          :disabled="type == 'detail' ? true : false"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <!-- 两表格 -->
    <el-row :gutter="20" type="flex" v-if="!noBrand">
      <el-col :span="10" class="form-table">
        <div class="table-title">覆盖品类及价格带</div>
        <div class="table-btn" v-if="type !== 'detail'">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            circle
            @click="dialogCategoryVisible = true"
          ></el-button>
        </div>
        <el-table :data="brandInfo.categoryList">
          <el-table-column property="categoryName" label="覆盖品类"></el-table-column>
          <el-table-column property="priceSection" label="价格带"></el-table-column>
          <el-table-column label="操作" v-if="type !== 'detail'">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click.native.prevent="handleDialogCategoryDel(scope, brandInfo.categoryList)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 品类和价格带弹框 -->
        <el-dialog title="品类和价格" :visible.sync="dialogCategoryVisible" width="40%">
          <el-form :model="dialogCategory" label-width="90px" :label-position="'right'">
            <el-form-item label="覆盖品类">
              <el-select v-model="dialogCategory.categoryName" placeholder="请选择">
                <el-option
                  v-for="(dict, index) in dict.type.customer_category_coverage"
                  :key="index"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="价格带">
              <el-input
                v-model="dialogCategory.priceSection"
                maxlength="12"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCategoryVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDialogCategoryCreate">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col :span="14" class="form-table">
        <div class="table-title">供应商结构</div>
        <div class="table-btn" v-if="type !== 'detail'">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            circle
            @click="dialogSupplierVisible = true"
          ></el-button>
        </div>
        <el-table :data="brandInfo.supplierList" highlight-current-row>
          <el-table-column property="supplierName" label="供应商名称"></el-table-column>
          <el-table-column property="distributionCategory" label="分配品类"></el-table-column>
          <el-table-column property="shareProportion" label="份额占比"></el-table-column>
          <el-table-column label="操作" v-if="type !== 'detail'">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click.native.prevent="handleDialogSupplierDel(scope, brandInfo.supplierList)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 供应商弹框 -->
        <el-dialog title="品类和价格" :visible.sync="dialogSupplierVisible" width="40%">
          <el-form :model="dialogSupplier" label-width="90px" :label-position="'right'">
            <el-form-item label="供应商名称">
              <el-input v-model="dialogSupplier.name" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="分配品类">
              <el-input
                v-model="dialogSupplier.categories"
                maxlength="15"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="份额占比">
              <el-input v-model="dialogSupplier.proportion"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSupplierVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDialogSupplierCreate">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 拜访记录 -->
    <el-row :gutter="20" v-if="type == 'detail'" style="margin-top: 30px; flex-wrap: wrap">
      <el-col class="visitCard" v-for="(item, index) in visitDetailVoList" :key="index">
        <el-card>
          <el-form label-position="right" label-width="90px" size="mini">
            <el-form-item label="拜访时间">
              <span class="unit-detail">{{ item.visitTime }}</span> -
              <span class="unit-detail" style="padding-left: 0">{{ item.visitEndTime }}</span>
            </el-form-item>
            <el-form-item label="拜访对象">
              <span class="unit-detail">{{ item.visitTarget }}</span>
            </el-form-item>
            <el-form-item label="职位">
              <span class="unit-detail">{{ item.position }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span class="unit-detail">{{ item.contactInformation }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span class="unit-detail">{{ item.visitContent }}</span>
            </el-form-item>
          </el-form>
          <el-button
            class="cardBtn"
            @click="
              () => {
                readVisit('detail', item.id)
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
    <!-- 操作按钮 -->
    <el-row type="flex" v-if="type !== 'detail'">
      <el-col>
        <div class="btn-box">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="submit" v-hasPermi="['customer:customer:edit']" type="primary"
            >保存</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { formRules, brandInfoTemp, dictMap } from './utils.js'
import { createCustomer, editCustomer, getCustomerById } from '@/api/customer/customer'
export default {
  dicts: dictMap,
  data() {
    return {
      labelPosition: 'right',
      type: '', // 表单类型
      // 表单验证规则
      rules: Object.freeze(formRules),
      brandInfoTemp: Object.freeze(brandInfoTemp),
      //基础信息
      baseInfo: {
        customerNo: '', //客户编号
        salesman: '', //业务员
        customerName: '', //客户名称
        revenueScale: '', //收入规模
        customerArea: '', //客户区域
        createTime: '', //创建时间
        customerState: '', // 状态
      },
      //品牌列表
      brandList: [],
      //
      tabActiveName: '',
      //当前编辑品牌
      brandInfo: {
        // id: "", //主键id
        brandRemark: '', //备注
        brandName: '', //品牌名称
        revenueScale: '', //营收规模，单位：万元
        brandGrade: '', //品牌分层

        contacts: '', //联系人
        position: '', //职位
        contactInformation: '', //联系方式

        crowdCircle: [], //人群圈层
        operationModeAbility: '', //运营模式和能力
        timeRhythm: '', //时间节奏（取数据字典label）

        decisionLink: '', //决策链路
        cooperationMode: [], //合作模式
        businessTarget: '', //生意目标

        brandProportion: '', //品牌占比
        cooperationIntention: '', //合作意向
        distributionChannelList: [], //销售渠道

        categoryList: [], //覆盖品类及价格带
        supplierList: [], //供应商结构，id集合，逗号（英文）分割
      },
      // 覆盖品类模态框
      dialogCategoryVisible: false,
      dialogCategory: {
        categoryName: '',
        priceSection: '',
      },
      // 供应商
      dialogSupplierVisible: false,
      dialogSupplier: {
        name: '',
        categories: '',
        proportion: '',
      },
      // 拜访记录列表
      visitDetailVoList: [],
    }
  },
  computed: {
    ...mapGetters(['name']),
    noBrand: function () {
      const flag = this.brandList.length === 0
      return flag
    },
    editState: function () {
      const id = this.$route.params.id
      return id ? '编辑' : '新增'
    },
    customerId: function () {
      return this.$route.params.id
    },
  },
  watch: {},
  created() {
    this.type = this.$route.query.type
    // console.log(this.editState);
    // console.log(this.dict);
    const obj = Object.assign({}, this.$route, {
      title: `客户(${this.editState})`,
    })
    if (this.type == 'detail') {
      obj.meta.title = '客户(详情)'
    }
    if (this.type == 'edit') {
      obj.meta.title = '客户(编辑)'
    }
    if (this.type == 'detail') {
      obj.title = '客户(详情)'
    }
    this.$tab.updatePage(obj)
    this.getData(this.customerId)
  },
  methods: {
    //操作函数=====================================
    getData(id) {
      if (!id) return
      getCustomerById(id).then((res) => {
        const {
          customerNo,
          salesman,
          customerName,
          revenueScale,
          customerArea,
          createTime,
          brandList,
          customerState,
          visitDetailVoList,
        } = res.data

        // 如果id请求为不存在的客户
        if (customerNo === null) {
          this.$message({
            message: '不存在当前客户',
            type: 'error',
          })
          this.cancel()
          return
        }
        brandList.forEach((element) => {
          element.id = String(element.id)
          element.crowdCircle = element.crowdCircle ? element.crowdCircle.split(',') : []
          element.cooperationMode = element.cooperationMode
            ? element.cooperationMode.split(',')
            : []
          element.distributionChannelList = element.distributionChannel
            ? element.distributionChannel.split(',')
            : []
        })
        this.baseInfo = {
          customerNo,
          salesman,
          customerName,
          revenueScale,
          customerArea,
          createTime,
          customerState,
        }
        this.brandList = brandList
        this.visitDetailVoList = visitDetailVoList
        console.log('brandList', this.brandList)
        if (brandList.length > 0) {
          this.tabActiveName = brandList[0].id
        }
      })
    },
    handleCreateBrand() {
      //判断是否存在未填写完毕的信息
      let findItem = this.brandList.find((item) => {
        return item.brandName === '请输入品牌名'
      })
      //校验表单
      const flag = this.validateForm('brandInfoForm')

      if (!findItem && flag) {
        //没有才创建
        //当前时间戳作为唯一标识 新建时用
        const id = new Date().getTime().toString()
        const brandTemp = {
          brandName: '请输入品牌名',
          id,
          isNew: true,
        }

        this.brandList.push(brandTemp)
        this.tabActiveName = id
      } else {
        this.$notify({
          title: '错误',
          message: '存在必填信息没有填选的情况，填完后再创建新品类',
          type: 'error',
        })
      }
    },

    handleDelBrand() {
      this.$confirm('确定要删除当前品牌？如未保存，数据并不会真实删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const delIndex = this.brandList.findIndex((item) => {
            return item.id === this.tabActiveName
          })
          this.brandList.splice(delIndex, 1)
          const length = this.brandList.length
          if (!length <= 0) {
            this.tabActiveName = this.brandList[0].id
          } else {
            this.tabActiveName = ''
          }
        })
        .catch(() => {})
    },
    beforeTabsChange(value, oldValue) {
      const oldTab = this.brandList.find((item) => {
        return item.id === oldValue
      })
      const newTab = this.brandList.find((item) => {
        return item.id === value
      })
      // console.log("this.tabActiveName", this.tabActiveName);
      // console.log("value", value, newTab);
      // console.log("oldValue", oldValue, oldTab);

      //新值不存在 删除最后一个Tabs
      if (newTab === undefined) {
        this.resetBandInfo()
        return true
      }
      //旧值不存在 全新创建/删除
      if (oldTab === undefined) {
        this.setBrandInfoFromTabs(value)
        return true
      }

      // 新旧值都存在，切换，验证当前表单是否校验
      const validateed = this.validateForm('brandInfoForm')
      if (!validateed) {
        this.$notify({
          title: '错误',
          message: '当前品牌信息不符合需求，请正确填写再切换',
          type: 'error',
        })
        return validateed
      }
      //校验通过 先把旧数据存入结构
      this.moveBrandInfoToTabs(oldValue)
      this.resetBandInfo()
      this.setBrandInfoFromTabs(value)
    },

    handleDialogCategoryCreate() {
      const { categoryName, priceSection } = this.dialogCategory
      const temp = { categoryName, priceSection }
      this.brandInfo.categoryList.push(temp)
      this.dialogCategoryVisible = false
      this.resetDialogCategory()
    },
    handleDialogCategoryDel(scope, data) {
      this.$confirm(
        `将删除 ${scope.row.categoryName} 价格带 ${scope.row.priceSection}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          data.splice(scope.$index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleDialogSupplierCreate() {
      const {
        name: supplierName,
        categories: distributionCategory,
        proportion: shareProportion,
      } = this.dialogSupplier
      const temp = {
        supplierName,
        distributionCategory,
        shareProportion,
      }
      this.brandInfo.supplierList.push(temp)
      this.dialogSupplierVisible = false
      this.resetDialogSupplier()
    },
    handleDialogSupplierDel(scope, data) {
      console.log(scope)
      this.$confirm(`将删除 ${scope.row.supplierName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          data.splice(scope.$index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /**
     * 提交信息
     */
    submit() {
      let flag = this.validateForm('baseInfoForm') && this.validateForm('brandInfoForm')
      //如果验证未通过
      if (!flag) {
        this.$notify({
          title: '错误',
          message: '存在必填信息没有填选的情况',
          type: 'error',
        })
        return
      }
      // 把当前品牌数据保存好
      this.moveBrandInfoToTabs(this.tabActiveName)
      const data = {
        brandList: JSON.parse(JSON.stringify(this.brandList)),
        ...this.baseInfo,
        salesman: this.name,
      }

      data.brandList.forEach((element) => {
        if (element.isNew) {
          element.id = ''
        }
        //数组处理成字符串提交
        element.crowdCircle = element.crowdCircle.join()
        element.cooperationMode = element.cooperationMode.join()
      })
      this.saveCustomer(data, this.customerId)
    },
    cancel() {
      const obj = { path: '/customer/customerList' }
      this.$tab.closeOpenPage(obj)
    },
    /**
     * 同步品牌名和tab标题
     * @param {string} value input的输入内容
     */
    inputBrandName(value) {
      let input = value
      if (input === '') {
        input = '请输入品牌名'
      }
      const findTab = this.brandList.find((item) => {
        return item.id === this.tabActiveName
      })
      findTab.brandName = input
    },
    //功能函数==============================================
    saveCustomer(data, id = '') {
      if (id) {
        data.customerInfoId = id
        editCustomer(data).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success',
          })

          this.cancel()
        })
      } else {
        createCustomer(data).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success',
          })

          this.cancel()
        })
      }
    },
    /**
     * 清空在填品牌信息
     */
    resetBandInfo() {
      const temp = JSON.parse(JSON.stringify(this.brandInfoTemp))
      this.brandInfo = temp
    },
    /**
     * 在填品牌信息，保存进tabs结构中
     * @param {string} id 匹配项的ID
     */
    moveBrandInfoToTabs(id) {
      if (this.brandList.length === 0) return
      let findItem = this.brandList.find((item) => {
        return item.id === id
      })
      Object.assign(findItem, this.brandInfo)
    },
    /**
     * 从tabs中把数据取出来填充到表单里
     * @param {string} id 匹配项的ID
     */
    setBrandInfoFromTabs(id) {
      if (this.brandList.length === 0) return
      let findItem = this.brandList.find((item) => {
        return item.id === id
      })
      //初始化的tabs 属性会比全量少
      if (Object.keys(findItem).length < Object.keys(this.brandInfo).length) return
      Object.assign(this.brandInfo, findItem)
      if (this.type == 'detail') {
        for (let item in this.brandInfo) {
          let type = typeof this.brandInfo[item]
          if (type == 'string' && this.brandInfo[item] == '') {
            this.brandInfo[item] = '-'
          } else if (type == 'object' && this.brandInfo[item] == null) {
            this.brandInfo[item] = '无'
          } else if (
            type == 'object' &&
            Array.isArray(this.brandInfo[item]) &&
            this.brandInfo[item].length == 0
          ) {
            this.brandInfo[item] = ['-']
          }
        }
        console.log('this.brandInfo', this.brandInfo)
      }
    },
    /**
     * 清空覆盖品类模态框填选内容
     */
    resetDialogCategory() {
      this.dialogCategory = {
        categoryName: '',
        priceSection: '',
      }
    },
    /**
     * 清空供应商模态框填选内容
     */
    resetDialogSupplier() {
      this.dialogSupplier = {
        name: '',
        categories: '',
        proportion: '',
      }
    },
    /**
     * 验证表单
     * @param {string} formName 表单实例的名字
     */
    validateForm(formName) {
      let flag = true
      if (this.$refs[formName]) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证通过
          } else {
            // 验证不通过
            flag = false
          }
        })
      }
      return flag
    },
    readVisit(type, id) {
      console.log(id)
      this.$router.push({ path: `/customer/visitDetails/${id}`, query: { type } })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index';
.input-detail {
  ::v-deep .el-input__inner {
    border: 1px solid transparent;
    background: transparent;
    cursor: auto;
    color: #666;
  }
  ::v-deep .el-input-group__append {
    margin: 0;
    padding: 0;
    border-color: transparent;
    background: transparent;
  }
}
.input-customer-name {
  ::v-deep .el-input__inner {
    width: 300px;
    padding-right: 0;
  }
}
.select-detail {
  ::v-deep .el-input__inner {
    border: 1px solid transparent;
    background: transparent;
    color: #666;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
  ::v-deep .el-input.is-disabled .el-input__inner:hover {
    border-color: transparent;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
.unit-detail {
  color: #666;
  padding-left: 15px;
}
.multiple-detail {
  ::v-deep .el-form-item__content {
    width: calc(100% - 90px);
  }
}
.mark-textarea {
  width: 100% !important;
  margin-right: 0 !important;
  ::v-deep .el-form-item__content {
    width: calc(100% - 320px);
  }
}
.textarea-detail {
  width: 100% !important;
  margin-right: 0 !important;
  ::v-deep .el-form-item__content {
    width: calc(100% - 90px);
  }
  ::v-deep .el-textarea__inner {
    border: 1px solid transparent;
    background: transparent;
    color: #666;
    background: transparent;
    cursor: auto;
  }
  ::v-deep .el-textarea__inner {
    border-color: transparent;
  }
}
.visitCard {
  width: 500px;
  margin: 10px 0;
  .cardBtn {
    width: 130px;
    margin: auto;
    display: block;
  }
}
</style>
