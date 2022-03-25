<template>
  <div class="app-container">
    <!-- 按钮组 -->
    <el-row class="btn-group">
      <el-col>
        <!-- 业务用 -->
        <span v-hasPermi="['quote:detail:salesman']">
          <el-button
            type="info"
            v-if="ifNew || [0].includes(salesmanFormInfo.status)"
            @click="salesmanSave"
            >业务保存</el-button
          >
          <el-button
            type="primary"
            v-if="ifNew || [0, 3, 5].includes(salesmanFormInfo.status)"
            @click="salesmanSubmit"
            >业务提交</el-button
          >
          <el-button
            type="primary"
            v-if="[4].includes(salesmanFormInfo.status)"
            @click="salesmanReiterate"
            >业务重申</el-button
          >
          <el-button
            type="success"
            v-if="[4].includes(salesmanFormInfo.status)"
            @click="salesmanFinish"
            >业务完结</el-button
          >
        </span>
        <!-- 开发用 -->
        <span span="6" v-hasPermi="['quote:detail:develop']">
          <el-button type="primary" v-if="showDevBtn" @click="devSubmit">开发提交</el-button>
          <el-button type="warning" v-if="showDevBtn" @click="devReject">开发驳回</el-button>
        </span>
        <!-- 报价用 -->
        <span span="6" v-hasPermi="['quote:detail:quoteer']">
          <el-button type="primary" v-if="showQuoteBtn" @click="quoteSubmit">报价提交</el-button>
          <el-button type="warning" v-if="showQuoteBtn" @click="quoteReject">报价驳回</el-button>
        </span>

        <el-button @click="cancel" style="margin-left: 10px">退出</el-button>
      </el-col>
    </el-row>
    <!-- 业务员表单 -->
    <el-row>
      <el-col>
        <div class="title">业务信息</div>
        <LuForm
          class="base-form"
          :ref-obj.sync="formRef.salesman"
          :formData="salesmanFormInfo"
          :fieldList="salesmanFieldList"
          :listTypeInfo="listTypeInfo"
          :rules="rules"
          :inline="true"
          label-position="top"
          size="small "
          labelWidth="120px"
        >
          <template v-slot:form-component>
            <div>
              <el-button
                size="mini"
                v-if="[null, 0, 3, 5].includes(salesmanFormInfo.status)"
                @click="componentDialogVisible = true"
                >选择成分</el-button
              >
              <el-input readonly type="textarea" v-model="salesmanFormInfo.component" autosize>
              </el-input>
            </div>
          </template>
          <template v-slot:form-enclosureAddr>
            <div>
              <ImageUpload
                v-model="salesmanFormInfo.enclosureAddr"
                fileField="multipartFile"
                :disabled="![null, 0, 3, 5].includes(salesmanFormInfo.status)"
              ></ImageUpload>
            </div>
          </template>
        </LuForm>
      </el-col>
    </el-row>
    <!-- 开发填表 -->
    <el-row v-if="showDev">
      <el-col>
        <el-divider></el-divider>
        <div class="title">开发信息</div>
        <LuForm
          class="base-form"
          :ref-obj.sync="formRef.dev"
          :formData="developerFormInfo"
          :fieldList="developerFieldList"
          :rules="rules"
          :inline="true"
          label-position="top"
          size="small "
        />
      </el-col>
    </el-row>
    <!-- 报价表单 -->
    <el-row v-if="showQuote" v-hasPermi="['quote:detail:salesman', 'quote:detail:quoteer']">
      <el-col>
        <el-divider></el-divider>
        <div class="title">报价信息</div>
        <LuForm
          class="base-form"
          :ref-obj.sync="formRef.quote"
          :formData="quoteFormInfo"
          :fieldList="quoteFieldList"
          :rules="rules"
          :inline="true"
          label-position="top"
          size="small "
        />
      </el-col>
    </el-row>
    <!-- 动态 -->
    <el-row v-if="showLog">
      <el-col>
        <el-divider></el-divider>
        <div class="title">制单动态</div>
        <el-steps direction="vertical" :space="60">
          <el-step
            v-for="(item, index) in logList"
            :key="index"
            icon="el-icon-edit-outline"
            :title="item.operationExplain"
            :status="item.status"
            :description="item.showStepContent"
          >
          </el-step>
        </el-steps>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      title="成分"
      :visible.sync="componentDialogVisible"
      :before-close="closeDialogSetData"
    >
      <!-- 把勾选去掉 -->
      <!-- <el-checkbox-group size="small" v-model="checkList">
        <el-checkbox
          v-for="(item, index) in componentList"
          :key="item.value"
          :label="index"
          class="check-item"
        >
          <div class="check-title">{{ item.label }}</div>
          <el-input v-model="item.input" class="check-input" size="small"
            ><template slot="append">%</template></el-input
          >
        </el-checkbox>
      </el-checkbox-group> -->
      <div>
        <div class="check-item" v-for="(item, index) in componentList" :key="index">
          <div class="check-title">{{ item.label }}</div>
          <el-input v-model="item.input" class="check-input" size="mini"
            ><template slot="append">%</template></el-input
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import LuForm from '@/components/LuForm/index.vue'

import {
  salesmanFormInfo,
  salesmanFieldList,
  developerFormInfo,
  developerFieldList,
  quoteFormInfo,
  quoteFieldList,
  formRules,
  componentList,
} from './config'
import {
  getQuoteDetail,
  getQuoteDetailLog,
  createQuoteDetail,
  editQuoteDetail,
  submitQuoteDetail,
  reiterateQuote,
  quoteOver,
  devSubmitInfo,
  devRejectionInfo,
  quoteSubmitInfo,
  quoteRejectionInfo,
} from '@/api/quote/quote'

export default {
  // name: "QuoteDetail",
  components: {
    LuForm,
  },
  dicts: [
    'quote_quote_type',
    'quote_quote_state',
    'quote_loss_measurement',
    'quote_fabric_composition',
    'fabric_type',
    'loom_specifications',
  ],
  data() {
    return {
      canSubmit: true,
      formRef: {
        salesman: {},
        dev: {},
        quote: {},
      },
      // ------表单数据
      // 业务员表单配置
      salesmanFormInfo: _.cloneDeep(salesmanFormInfo),
      salesmanFieldList: _.cloneDeep(salesmanFieldList),
      // 开发员表单配置
      developerFormInfo: _.cloneDeep(developerFormInfo),
      developerFieldList: _.cloneDeep(developerFieldList),
      // 报价表单配置
      quoteFormInfo: _.cloneDeep(quoteFormInfo),
      quoteFieldList: _.cloneDeep(quoteFieldList),
      // option列表
      listTypeInfo: {},
      // 表单规则
      rules: _.cloneDeep(formRules),
      // 制单动态
      logList: [],
      //成分dialog需要的数据----------------
      componentDialogVisible: false,
      componentList: _.cloneDeep(componentList),
      checkList: [],
    }
  },
  computed: {
    ...mapGetters(['name', 'dept']),
    editState: function () {
      const id = this.$route.params.id
      return id ? id : '新增'
    },
    ifNew: function () {
      const id = this.$route.params.id
      return id ? false : true
    },
    showDevBtn: function () {
      if (this.ifNew) {
        return false
      }
      let statuCanEdit = [1].includes(this.salesmanFormInfo.status)
      //有布号的时候不需要开发部填写信息
      let typeCanEdit = this.salesmanFormInfo.quotedType === '0' ? false : true

      return statuCanEdit && typeCanEdit
    },
    /**
     * 展示报价信息
     * 1：业务 已提交
     */
    showDev: function () {
      if (this.ifNew) {
        return false
      }
      let statuCanEdit = [1, 2, 4, 5, 6, 7].includes(this.salesmanFormInfo.status)
      //有布号的时候不需要开发部填写信息
      let typeCanEdit = this.salesmanFormInfo.quotedType === '0' ? false : true

      return statuCanEdit && typeCanEdit
    },
    /**
     * 展示报价按钮
     * 1:业务 已提交
     * 2:开发 已提交
     * 6:业务 重申报价
     */
    showQuoteBtn: function () {
      if (this.ifNew) {
        return false
      }
      let statuCanEdit = [2, 6].includes(this.salesmanFormInfo.status)
      let typeCanEdit =
        this.salesmanFormInfo.status === 1 && this.salesmanFormInfo.quotedType === '0'
      return statuCanEdit || typeCanEdit
    },
    /**
     * 展示报价信息
     * 1:业务 已提交
     * 2:开发 已提交
     * 4:报价 已提交
     * 6:业务 重申报价
     */
    showQuote: function () {
      if (this.ifNew) {
        return false
      }
      let statuCanEdit = [2, 4, 6, 7].includes(this.salesmanFormInfo.status)
      let typeCanEdit =
        this.salesmanFormInfo.status === 1 && this.salesmanFormInfo.quotedType === '0'
      return statuCanEdit || typeCanEdit
    },
    showLog: function () {
      if (this.ifNew) {
        return false
      }
      return true
    },
  },
  watch: {},
  methods: {
    // 获取报价详情
    getData(id) {
      if (!id) return
      //加载详情
      getQuoteDetail(id).then((res) => {
        // 业务资料
        const business = res.data?.quotedPriceApply
        const dev = res.data?.devInfo
        const quote = res.data?.quotedPriceInfo
        const { id, status, applyNo } = business

        if (business) {
          const {
            salesman,
            deptId,
            deptName,
            createTime,
            customerName,
            quotedType,
            clothNo,
            clothCategory,
            loomSpecifications,
            testLoss,
            component,
            widthCloth,
            gramWeight,
            specialProcedure,
            productPurpose,
            ecologyCapacity,
            yarnSpecifications,
            recommendSupplierQuoted,
            specialQualityRequirements,
            remark,
            enclosureAddr,
            reiterateReason,
            rejectReason,
          } = business
          this.salesmanFormInfo = {
            salesman, //业务员
            deptId, //部门id
            deptName, //部门名称
            createTime, //创建时间
            customerName, //客户名称
            quotedType: String(quotedType), //报价类型

            clothNo, //布号

            clothCategory, //布类
            loomSpecifications, //织机规格
            testLoss: testLoss ? testLoss.split(',') : [], //测损
            component, //成分
            widthCloth, //幅宽
            gramWeight, //克重
            specialProcedure, //特殊工序整理

            productPurpose, //成品用途
            ecologyCapacity, //建议生态产能
            yarnSpecifications, //已知纱线规格
            recommendSupplierQuoted, //推荐纱线供应商及大致报价
            specialQualityRequirements, //特殊品质要求
            remark, //备注

            enclosureAddr, //附件地址
            reiterateReason, //	重申理由
            rejectReason, //驳回理由
          }
        }
        // 开发资料
        if (dev) {
          const {
            yarnCountNum,
            gramWeight,
            doorWidth,
            loom,
            mixtureRatio,
            accuracy,
            referenceOpinions,
          } = dev
          this.developerFormInfo = {
            yarnCountNum,
            gramWeight,
            doorWidth,
            loom,
            mixtureRatio,
            accuracy,
            referenceOpinions,
          }
        }
        // 报价资料
        if (quote) {
          const {
            whitePrice,
            lightColourPrice,
            mediumColorPrice,
            darkPrice,
            extraDarkPrice,
            colorSpinningPrice,
            printingPrice,
            referenceClothNo,
            grossProfitMargin = '',
            fabricInfo,
            remark,
          } = quote
          this.quoteFormInfo = {
            whitePrice,
            lightColourPrice,
            mediumColorPrice,
            darkPrice,
            extraDarkPrice,
            colorSpinningPrice,
            printingPrice,
            referenceClothNo,
            grossProfitMargin,
            fabricInfo,
            remark,
          }
        }

        // 统一设置状态，id，单号，便于表单判断
        this.salesmanFormInfo = Object.assign({}, this.salesmanFormInfo, {
          id,
          status,
          applyNo,
        })
        this.developerFormInfo = Object.assign({}, this.developerFormInfo, {
          id,
          status,
          applyNo,
        })
        this.quoteFormInfo = Object.assign({}, this.quoteFormInfo, {
          id,
          status,
          applyNo,
        })
      })
      //加载动态
      getQuoteDetailLog(id).then((res) => {
        let logList = res.data
        logList.reverse()
        /**
         * error
         * process
         * wait
         * finish
         * success
         */
        logList.forEach((item) => {
          item.showStepContent = `${item.createTime} - ${item.createBy} - ${item.operationExplain} : ${item.operationContent}`
          item.status = 'process'
        })
        //最上面的状态设置成蓝色
        logList[0].status = 'finish'
        this.logList = logList
      })
    },
    /**
     * 新建申请单方法
     */
    newData() {
      if (this.ifNew) {
        this.salesmanFormInfo.salesman = this.name
        this.salesmanFormInfo.deptName = this.dept.deptName
      }
    },
    /**
     * 返回业务员需提交信息
     */
    pickSalesmanInfo() {
      const {
        id,
        applyNo,
        customerName,
        quotedType,

        clothNo,

        clothCategory,
        loomSpecifications,
        testLoss,
        widthCloth,
        gramWeight,
        specialProcedure,
        component,

        productPurpose,
        ecologyCapacity,
        yarnSpecifications,
        recommendSupplierQuoted,
        specialQualityRequirements,
        remark,
        enclosureAddr,
      } = this.salesmanFormInfo

      const info = {
        id,
        salesman: this.name,
        deptId: this.dept.deptId,
        testLoss: testLoss.join(),

        applyNo,
        customerName,
        quotedType,

        clothNo,

        clothCategory,
        loomSpecifications,
        widthCloth,
        gramWeight,
        specialProcedure,
        component,

        productPurpose,
        ecologyCapacity,
        yarnSpecifications,
        recommendSupplierQuoted,
        specialQualityRequirements,
        remark,
        enclosureAddr,
      }
      return info
    },
    /**
     * 返回开发需提交信息
     */
    pickDevInfo() {
      const { id, applyNo } = this.salesmanFormInfo
      const {
        yarnCountNum,
        gramWeight,
        doorWidth,
        loom,
        mixtureRatio,
        accuracy,
        referenceOpinions,
      } = this.developerFormInfo
      const info = {
        id,
        applyNo,
        yarnCountNum,
        gramWeight,
        doorWidth,
        loom,
        mixtureRatio,
        accuracy,
        referenceOpinions,
      }
      return info
    },
    /**
     * 返回报价需提交信息
     */
    pickQuoteInfo() {
      const { id, applyNo } = this.salesmanFormInfo
      const {
        whitePrice,
        lightColourPrice,
        mediumColorPrice,
        darkPrice,
        extraDarkPrice,
        colorSpinningPrice,
        printingPrice,
        referenceClothNo,
        grossProfitMargin,
        fabricInfo,
        remark,
      } = this.quoteFormInfo
      const info = {
        id,
        applyNo,
        whitePrice,
        lightColourPrice,
        mediumColorPrice,
        darkPrice,
        extraDarkPrice,
        colorSpinningPrice,
        printingPrice,
        referenceClothNo,
        grossProfitMargin,
        fabricInfo,
        remark,
      }
      return info
    },
    closeDialogSetData(done) {
      let text = ''
      //遍历勾选列表
      // console.log(this.checkList);
      //组合文字
      // this.checkList.forEach((i) => {
      //   const item = this.componentList[i];
      //   text += `${item.label}(${item.input}%);`;
      // });
      // 以上为需要勾选功能
      this.componentList.forEach((i) => {
        const item = i
        if (item.input) {
          text += `${item.label}(${item.input}%);`
        }
      })
      this.salesmanFormInfo.component = text
      done()
    },

    /**
     * 业务员-保存申请单
     */
    salesmanSave: _.throttle(function () {
      const flag = this.validateForm('salesman')
      if (!flag) {
        return
      }

      let quoteDetail = this.pickSalesmanInfo()
      if (quoteDetail.applyNo) {
        editQuoteDetail(quoteDetail).then((res) => {
          this.$message.success('保存成功')
        })
      } else {
        createQuoteDetail(quoteDetail).then((res) => {
          this.$message({
            message: '提交成功',
            type: 'success',
          })
          this.salesmanFormInfo.applyNo = res.data.applyNo
          this.salesmanFormInfo.id = res.data.id

          const obj = {
            path: `/quote/quoteDetail/${this.salesmanFormInfo.applyNo}`,
          }
          this.$tab.closeOpenPage(obj)
        })
      }
    }, 2000),
    /**
     * 业务员-提交申请单
     */
    salesmanSubmit: _.throttle(function () {
      const flag = this.validateForm('salesman')
      if (!flag) {
        return
      }
      this.$confirm('是否确认提交申请单？', '提示')
        .then(() => {
          let quoteDetail = this.pickSalesmanInfo()
          submitQuoteDetail(quoteDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 业务员-重申报价
     */
    salesmanReiterate: _.throttle(function () {
      this.$prompt('请说明重申理由!', '提示', {
        inputValidator: function (value) {
          if (!value) {
            return '重申理由不能为空'
          }
        },
      })
        .then(({ value }) => {
          let quoteDetail = this.pickSalesmanInfo()
          quoteDetail.reiterateReason = value
          reiterateQuote(quoteDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 业务员-结束报价
     */
    salesmanFinish: _.throttle(function () {
      this.$confirm('是否确认本申请单流程完结，流程不可逆', '提示')
        .then(() => {
          let quoteDetail = this.pickSalesmanInfo()
          quoteOver(quoteDetail.id).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 开发-提交信息
     */
    devSubmit: _.throttle(function () {
      const flag = this.validateForm('dev')
      if (!flag) {
        return
      }
      this.$confirm('是否确认提交开发信息', '提示')
        .then(() => {
          let devDetail = this.pickDevInfo()
          devSubmitInfo(devDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 开发-驳回
     */
    devReject: _.throttle(function () {
      this.$prompt('请说明驳回理由!', '提示', {
        inputValidator: function (value) {
          if (!value) {
            return '驳回理由不能为空'
          }
        },
      })
        .then(({ value }) => {
          let devDetail = this.pickDevInfo()
          devDetail.rejectReason = value
          devDetail.rejectType = value
          devRejectionInfo(devDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 报价-提交信息
     */
    quoteSubmit: _.throttle(function () {
      const flag = this.validateForm('quote')
      if (!flag) {
        return
      }
      this.$confirm('是否确认提交报价信息', '提示')
        .then(() => {
          let quoteDetail = this.pickQuoteInfo()
          quoteSubmitInfo(quoteDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }, 2000),
    /**
     * 报价-驳回
     */
    quoteReject: _.throttle(function () {
      this.$prompt('请说明驳回理由!', '提示', {
        inputValidator: function (value) {
          if (!value) {
            return '驳回理由不能为空'
          }
        },
      })
        .then(({ value }) => {
          let quoteDetail = this.pickQuoteInfo()
          quoteDetail.rejectReason = value
          quoteDetail.rejectType = value
          quoteRejectionInfo(quoteDetail).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          })
        })
        .catch(() => {})
    }),
    /**
     * 退出
     */
    cancel() {
      const obj = { path: '/quote/quoteList' }
      this.$tab.closeOpenPage(obj)
    },
    /**
     * 主动表单校验
     * @param {string} formName 表单实例名称
     */
    validateForm(formName) {
      let flag = true
      if (this.formRef[formName]) {
        this.formRef[formName].validate((valid) => {
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
  },
  created() {
    const obj = Object.assign({}, this.$route, {
      title: `报价信息(${this.editState})`,
    })
    this.$tab.updatePage(obj)
    this.listTypeInfo = this.dict.type

    this.getData(this.$route.params.id)
    this.newData()
  },
}
</script>

<style lang="scss" scoped>
.btn-group {
  margin-bottom: 10px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
::v-deep .base-form .el-form {
  display: flex;
  flex-wrap: wrap;
  .upload-row {
    width: 100% !important;
  }
  .el-form-item {
    min-width: 180px;
    width: calc(33.33% - 100px);
    margin-right: 100px;
  }

  .el-select {
    width: 100%;
  }
}
.check-item {
  display: inline-block;
  width: 78px;
  margin: 10px;
}
.check-title {
  color: #000;
}
.check-input {
  color: #000;
}
::v-deep .el-input-group__append {
  padding: 0 7px;
}

// input 和 textarea disabled 时的字清晰一些
::v-deep .el-input.is-disabled .el-input__inner {
  color: #000;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #000;
}
</style>
