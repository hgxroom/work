<template>
  <div class="app-main">
    <div class="title-box">
      <div class="tit">报价详情</div>
      <div class="tit-info">
        <el-row>
          <el-col :span="12">
            <span>单号：{{ this.baseInfo.quotedOrderNo }}</span>
          </el-col>
          <el-col
            :span="12"
            style="text-align: right; color: rgba(0, 0, 0, 0.4); font-weight: normal"
          >
            <span v-if="this.baseInfo.salesman">提交人：{{ this.baseInfo.salesman || '-' }}</span>
            <span v-if="this.baseInfo.createTime">提交时间：{{ this.baseInfo.createTime }}</span>
            <span v-if="this.baseInfo.offerMan">报价人：{{ this.baseInfo.offerMan }}</span>
            <span v-if="this.baseInfo.offerTime">报价时间：{{ this.baseInfo.offerTime }}</span>
            <span v-if="this.baseInfo.updateBy">审核人：{{ this.baseInfo.updateBy }}</span>
            <span v-if="this.baseInfo.updateTime">审核时间：{{ this.baseInfo.updateTime }}</span>
            <span style="color: rgba(0, 0, 0, 0.85)">
              状态：{{ statusFilter(this.baseInfo.orderStatus) }}
            </span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container">
      <div class="card-box">
        <p class="title">基本信息</p>
        <el-form
          class="base-form"
          :model="baseInfo"
          :rules="rules"
          ref="baseInfoForm"
          :inline="true"
          label-width="90px"
          :label-position="labelPosition"
        >
          <el-form-item label="客户">
            <el-input
              v-model="baseInfo.customerName"
              placeholder="请输入客户"
              disabled
              :clearable="type == 'detail' ? false : true"
              :class="[type == 'detail' ? 'input-detail' : '']"
            ></el-input>
          </el-form-item>
          <el-form-item label="最终客户">
            <span v-if="!baseInfo.finalCustomerName" style="color: #999; padding-left: 25px">
              -
            </span>
            <el-input
              v-if="baseInfo.finalCustomerName"
              v-model="baseInfo.finalCustomerName"
              placeholder="请输入最终客户"
              disabled
              :clearable="type == 'detail' ? false : true"
              :class="[type == 'detail' ? 'input-detail' : '']"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算方式" prop="settlementMethod">
            <el-input
              v-model="baseInfo.settlementMethod"
              placeholder="请输入结算方式"
              disabled
              :clearable="type == 'detail' ? false : true"
              :class="[type == 'detail' ? 'input-detail' : '']"
            ></el-input>
          </el-form-item>
          <el-form-item label="成品用途">
            <span v-if="!baseInfo.productApplication" style="color: #999; padding-left: 25px">
              -
            </span>
            <el-input
              v-if="baseInfo.productApplication"
              v-model="baseInfo.productApplication"
              placeholder="请输入成品用途"
              disabled
              :clearable="type == 'detail' ? false : true"
              :class="[type == 'detail' ? 'input-detail' : '']"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注"
            :class="['mark-textarea', type == 'detail' ? 'textarea-detail' : '']"
          >
            <span>{{ baseInfo.remark || '-' }}</span>
          </el-form-item>
        </el-form>
        <div class="upload-img">
          <div style="width: 90px; text-align: right; padding-right: 12px">上传图片</div>
          <div class="flex">
            <span v-for="item in this.imgList" :key="item" style="padding-right: 15px">
              <el-image style="width: 100px; height: 100px" :src="item" fit="fill"></el-image>
            </span>
          </div>
        </div>
        <p class="img-tips" v-if="false">只能上传JPG/JPEG/PNG文件，且单个文件不超过10Mb</p>
      </div>
      <div class="card-box">
        <p class="title">报价产品</p>
        <el-table
          size="small"
          :data="formData.data"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          header-row-class-name="tableHeader"
        >
          <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
          <el-table-column label="布号" prop="clothNo" width="100"></el-table-column>
          <el-table-column label="布类" prop="clothType" width="100"></el-table-column>
          <el-table-column label="品名" prop="pm" width="260" :show-overflow-tooltip="true">
            <template v-slot="scope">
              <div class="content-colum">
                {{ scope.row.pm }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="纱线编号" width="150">
            <template v-slot="scope">
              <div
                class="tab-div tab-divline"
                v-for="(item, index) in scope.row.rawYarnVoList"
                :key="index"
              >
                {{ item.yarnNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="纱线品名" width="260">
            <template v-slot="scope">
              <div class="tab-div" v-for="(item, index) in scope.row.rawYarnVoList" :key="index">
                <el-popover
                  trigger="hover"
                  placement="top"
                  popper-class="popper-class"
                  :visible-arrow="false"
                >
                  <p style="max-width: 600px; margin: 0">{{ item.yarnName }}</p>
                  <div slot="reference" class="content-colum">
                    {{ item.yarnName }}
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="纱线比例(%)" width="100">
            <template v-slot="scope">
              <div
                class="tab-div tab-divline2"
                v-for="(item, index) in scope.row.rawYarnVoList"
                :key="index"
              >
                {{ item.yarnRatio }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in formData.columns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align"
          >
            <template v-slot="scope">
              <div>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="特殊工艺">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.specialProcessName" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="功能性承诺" width="120">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.functionName" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="作业类型"
            width="120"
            v-if="baseInfo.orderStatus !== 1 && baseInfo.orderStatus !== 0"
          >
            <template v-slot="scope">
              {{ scope.row.jobType || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="颜色" width="120">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.colorName" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="成本价格"
            v-if="
              baseInfo.orderStatus == 2 || baseInfo.orderStatus == 3 || baseInfo.orderStatus == 5
            "
          >
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.costPrice" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <template v-if="baseInfo.orderStatus == 3 || baseInfo.orderStatus == 5">
            <el-table-column label="最终报价1" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.finalQuotedPrice1" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率1" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.interestRate1" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最终报价2" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.finalQuotedPrice1" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率2" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.interestRate2" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最终报价3" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.finalQuotedPrice1" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率3" width="120">
              <template v-slot="scope">
                <div v-for="(item, index) in scope.row.interestRate3" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
          </template>
          <!-- <el-table-column label="颜色11111" width="120">
            <template>
              <div>
                {{ baseInfo.orderStatus }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            width="100"
            align="center"
            v-show="baseInfo.orderStatus"
            fixed="right"
          >
            <template v-slot="scope">
              <el-button
                v-if="baseInfo.orderStatus == 1"
                type="text"
                @click="toCostOffer(scope.row)"
                size="small"
              >
                成本报价
              </el-button>
              <el-button
                v-if="baseInfo.orderStatus == 2"
                type="text"
                @click="toCostOffer(scope.row)"
                size="small"
              >
                销售报价
              </el-button>
              <el-button
                v-if="
                  baseInfo.orderStatus == 3 ||
                  baseInfo.orderStatus == 4 ||
                  baseInfo.orderStatus == 5
                "
                type="text"
                @click="toCostOffer(scope.row)"
                size="small"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer" v-if="baseInfo.orderStatus == 1 || baseInfo.orderStatus == 2">
        <el-button @click="save()" class="save-btn">取消</el-button>
        <el-button
          @click="submit()"
          :disabled="
            (baseInfo.offerFlag == '1' && baseInfo.orderStatus == 1) ||
            (baseInfo.auditFlag == '1' && baseInfo.orderStatus == 2)
          "
          class="sub-btn"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDictList,
  getFabricQuotationByBh,
  getTableDataInfoToAble,
  getFunctionalCommitmentByName,
  getColorDataToAble,
  getWeightStepDtoToAble,
  addQuotedOrder,
  getQuotedPriceByNo,
  commitStatus,
} from '@/api/finance/report'
import { formRules, brandInfoTemp, dictMap } from './utils.js'
export default {
  dicts: dictMap,
  data() {
    return {
      type: '', // 表单类型
      labelPosition: 'right',
      // 表单验证规则
      rules: Object.freeze(formRules),
      brandInfoTemp: Object.freeze(brandInfoTemp),
      //特殊工艺
      specialList: [],
      //功能性承诺
      functionList: [],
      // 颜色选择
      colorList: [],
      // 下单重量选择
      weightList: [],
      imgList: [],
      //基础信息
      baseInfo: {
        customerName: '', // 客户名称
        enclosureAddress: '', // 附件地址：多个用;分割
        finalCustomerName: '', // 最终客户
        productApplication: '', // 成品用途
        productList: [],
        remark: '', // 	备注
        settlementMethod: '', // 	结算方式
        clothNo: '', //参考布号
      },
      // 新增产品数据
      productInfo: {
        clothType: '', //布类
        loomSpecification: '', //织机规模
        gramWeight: '', //克重
        widthCloth: '', //幅宽
        component: '', //成分
        specialProcessName: '', // 特殊工艺
        functionName: '', // 功能性承诺
        colorName: '', // 颜色
        orderNum: '', // 重量
        yarnName: '', // 品名
        meterWeight: 0, // 米重
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      // 表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '织机规格',
            align: 'center',
            type: 'text',
            prop: 'loomSpecification',
          },
          {
            label: '成分',
            align: 'center',
            type: 'text',
            prop: 'component',
          },
          {
            label: '幅宽',
            align: 'center',
            type: 'text',
            prop: 'widthCloth',
          },
          {
            label: '克重',
            align: 'center',
            type: 'text',
            prop: 'gramWeight',
          },
          {
            label: '米重',
            align: 'center',
            type: 'text',
            prop: 'meterWeight',
          },
          {
            label: '下单重量',
            align: 'center',
            type: 'text',
            prop: 'orderNum',
          },
        ],
        data: [],
      },

      // 添加产品弹框
      productDialogVisible: false,
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    statusFilter(type) {
      let obj = {
        0: '草稿',
        1: '待报价',
        2: '待审核',
        3: '已审核',
        4: '已驳回',
        5: '已完成',
      }
      return obj[type]
    },
    getQuotedPriceByNo() {
      getQuotedPriceByNo(this.quotedOrderNo).then((res) => {
        res.data.productList.forEach((item) => {
          let colorArray = []
          let costPriceArray = []
          let finalQuotedPrice1Array = []
          let interestRate1Array = []
          let finalQuotedPrice2Array = []
          let interestRate2Array = []
          let finalQuotedPrice3Array = []
          let interestRate3Array = []
          let jobType = ''
          if (item.quotedOrderPriceVoList) {
            item.quotedOrderPriceVoList.forEach((j) => {
              colorArray.push(j.colorName)
              costPriceArray.push(j.costPrice)
              finalQuotedPrice1Array.push(j.finalQuotedPrice1)
              interestRate1Array.push(j.interestRate1)
              finalQuotedPrice2Array.push(j.finalQuotedPrice2)
              interestRate2Array.push(j.interestRate2)
              finalQuotedPrice3Array.push(j.finalQuotedPrice3)
              interestRate3Array.push(j.interestRate3)
              jobType = j.jobType
            })
          }
          item.colorName = []
          item.costPrice = []
          item.finalQuotedPrice1 = []
          item.finalQuotedPrice2 = []
          item.finalQuotedPrice3 = []
          item.interestRate1 = []
          item.interestRate2 = []
          item.interestRate3 = []
          item.colorName = colorArray
          item.costPrice = costPriceArray
          item.finalQuotedPrice1 = finalQuotedPrice1Array
          item.finalQuotedPrice2 = finalQuotedPrice2Array
          item.finalQuotedPrice3 = finalQuotedPrice3Array
          item.interestRate1 = interestRate1Array
          item.interestRate2 = interestRate2Array
          item.interestRate3 = interestRate3Array
          if (item.functionName) {
            item.functionName = item.functionName.split(',')
          }
          if (item.specialProcessName) {
            item.specialProcessName = item.specialProcessName.split(',')
          }

          item.jobType = jobType
        })
        this.baseInfo = res.data
        console.log('this.baseInfo', this.baseInfo)
        this.formData.data = this.baseInfo.productList
        if (res.data.enclosureAddress) {
          this.imgList = res.data.enclosureAddress.split(';')
        }
        console.log(this.baseInfo)
        console.log(res.data.enclosureAddress.split(';'))
      })
    },
    toCostOffer(val) {
      console.log(this.baseInfo)
      if (this.baseInfo.orderStatus == 1) {
        let url = '/finance/reportCalculator'
        this.$router.push({
          path: url,
          query: {
            type: 'detail',
            quotedOrderNo: this.$route.query.quotedOrderNo,
            clothNo: val.clothNo,
            component: val.component,
            yarnName: val.pm,
          },
        })
      } else if (this.baseInfo.orderStatus == 2) {
        let url = '/finance/finalReport'
        this.$router.push({
          path: url,
          query: {
            type: 'add',
            quotedOrderNo: this.$route.query.quotedOrderNo,
            clothNo: val.clothNo,
          },
        })
      } else if (
        this.baseInfo.orderStatus == 3 ||
        this.baseInfo.orderStatus == 4 ||
        this.baseInfo.orderStatus == 5
      ) {
        let url = '/finance/finalReport'
        this.$router.push({
          path: url,
          query: {
            type: 'detail',
            quotedOrderNo: this.$route.query.quotedOrderNo,
            clothNo: this.baseInfo.clothNo,
          },
        })
      }
    },
    getCheckList() {
      getTableDataInfoToAble().then((res) => {
        this.specialList = res.data
      })
      getFunctionalCommitmentByName().then((res) => {
        this.functionList = res.data
      })
      getColorDataToAble().then((res) => {
        this.colorList = res.data
      })
      getWeightStepDtoToAble().then((res) => {
        this.weightList = res.data
      })
    },
    //选择布号
    handleSelectReferenceClothNo(item) {
      //基本信息
      this.productInfo.clothNo = item.clothNo
      this.productInfo.component = item.cf
      this.productInfo.clothType = item.productCategory
      this.productInfo.widthCloth = item.fk
      this.productInfo.gramWeight = item.kz
      this.productInfo.yarnName = item.yarnName
      this.productInfo.loomSpecification = item.loomType
      //纱织信息
      if (item.quotationYarnVoList) {
        let list = []
        item.quotationYarnVoList.forEach((val) => {
          let param = {
            yarnName: '',
            yarnNo: '',
            yarnRatio: '',
            editFlag: false,
            states: 0,
          }
          param.yarnName = val.wlmch
          param.yarnNo = val.wlbh
          param.yarnRatio = val.bl
          list.push(param)
        })
        this.formProductData.data = list
      }
    },
    //模糊布号
    queryReferenceClothNo(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      let data = {
        referenceClothNo: queryString,
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getFabricQuotationByBh(data).then((res) => {
          cb(res.data)
        })
      }, 700)
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传文件
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10
      let isImg = isJPG || isJPEG || isPNG
      if (!isImg) {
        this.$message.error('只能上传JPG/JPEG/PNG文件!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isImg && isLt10M
    },
    add() {
      this.productDialogVisible = true
    },
    // 弹框--确定按钮
    confirm(done) {
      let flag = this.validateForm('productInfoForm')
      //如果验证未通过
      if (!flag) {
        this.$notify({
          title: '错误',
          message: '存在必填信息没有填选的情况',
          type: 'error',
        })
        return
      }
      for (const item in this.productInfo) {
        if (this.productInfo[item] instanceof Array) {
          // this.productInfo[item] = this.productInfo[item].join(',')
        }
      }
      this.baseInfo.productList.push(this.productInfo)
      this.formData.data = this.baseInfo.productList
      // this.$refs['productInfoForm'].resetFields()
      this.productDialogVisible = false
    },
    //取消
    handleClose(done) {
      this.productDialogVisible = false
    },
    save() {
      console.log(this.baseInfo)
    },
    submit() {
      let data = {
        orderStatus: Number(this.baseInfo.orderStatus) + 1,
        quotedOrderNo: this.$route.query.quotedOrderNo,
      }
      console.log(data)
      commitStatus(data).then((res) => {
        const obj = { path: `/finance/reportList` }
        this.$tab.closeOpenPage(obj)
      })
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
  },
  created() {
    this.type = this.$route.query.type
    this.quotedOrderNo = this.$route.query.quotedOrderNo
    this.getQuotedPriceByNo()
  },
  watch: {
    $route(to, from) {
      this.type = this.$route.query.type
      this.quotedOrderNo = this.$route.query.quotedOrderNo
      this.getQuotedPriceByNo()
    },
  },
}
</script>
<style lang="scss" scoped>
.app-main {
  background: rgba(245, 247, 250, 1);
  padding-bottom: 80px;
  .title-box {
    position: relative;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    padding: 0 24px;
    .tit {
      padding: 20px 0;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #f3f3f3;
    }
    .tit-info {
      padding: 20px 0;
      font-weight: bold;
      span {
        margin-right: 80px;
      }
    }
  }
}
.container {
  margin: 24px;
  .card-box {
    position: relative;
    padding: 16px 16px 24px 16px;
    margin-bottom: 24px;
    border-radius: 8px;
    background-color: #fff;
    .title {
      color: rgba(0, 0, 0, 0.85);
      margin: 0 0 16px 0;
      font-weight: 600;
      text-align: left;
    }
    .btn-box {
      margin-top: 24px;
      text-align: center;
      .el-button {
        border: 1px dashed rgba(38, 111, 232, 1);
        border-color: rgba(38, 111, 232, 1);
        color: rgba(38, 111, 232, 1);
      }
    }
  }
  .upload-img {
    display: flex;
    font-size: 14px;
    .flex {
      flex: 1;
    }
  }
  .img-tips {
    font-size: 12px;
    font-weight: 400;
    color: #8b8b8b;
    line-height: 17px;
    margin-left: 90px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 80px;
  line-height: 80px;
  width: 100%;
  padding-right: 24px;
  background-color: #fff;
  text-align: right;
  box-shadow: 0 -1px 6px rgba(245, 247, 250, 0.6);
  z-index: 99;
  .sub-btn {
    background-color: rgba(0, 82, 217, 1);
    color: #fff;
  }
  .el-button {
    margin-left: 16px;
  }
}
.base-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
  .mark-textarea {
    width: calc(25% + 308px) !important;
    margin-right: 0 !important;
    ::v-deep .el-form-item__content {
      width: calc(100% - 90px);
    }
  }
  .fullWidth {
    width: 100%;
    ::v-deep .el-form-item__label {
      width: 110px;
      text-align: left;
    }
    ::v-deep .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
  .btn-group {
    margin: auto;
    display: flex;
    justify-content: center;
  }
}
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
.input-textarea-detail {
  ::v-deep .el-textarea__inner {
    width: 100%;
    border-color: transparent;
    background: transparent;
    cursor: auto;
  }
}
.textarea-detail {
  span {
    color: #666;
    padding-left: 15px;
  }
}
// 弹框样式
.dialog-contant {
  ::v-deep .el-dialog {
    border-radius: 8px;
    .el-dialog__title {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
    }
  }
  .box {
    position: relative;
    ::v-deep.el-form-item {
      width: calc(25% - 10px);
      .el-form-item__label {
        font-weight: normal !important;
        color: rgba(36, 36, 36, 1);
      }
    }
    ::v-deep.el-form-item {
      width: calc(33% - 10px);
      .el-form-item__label {
        font-weight: normal !important;
        color: rgba(36, 36, 36, 1);
      }
    }
    .basic-info {
      position: relative;
      margin-bottom: 16px;
      .info {
        font-size: 16px;
        font-weight: bold;
        color: rgba(36, 36, 36, 1);
      }
      ul {
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          width: 33.33%;
          font-size: 14px;
          list-style-type: none;
          color: rgba(36, 36, 36, 1);
          margin-bottom: 12px;
          span {
            display: inline-block;
            text-align: right;
            min-width: 70px;
            color: rgba(139, 139, 139, 1);
            margin-right: 26px;
          }
        }
        li:first-child {
          width: 100%;
        }
      }
    }
    .bottom-btn {
      margin-top: 24px;
      text-align: center;
      .sub-btn {
        background-color: rgba(0, 82, 217, 1);
        border-color: rgba(0, 82, 217, 1);
      }
    }
    .el-button:last-child {
      margin-left: 16px;
    }
  }
}
::v-deep .tableHeader th {
  background-color: #f5f7fa;
  color: #8b8b8b;
  font-size: 14px;
  height: 48px;
}
::v-deep .el-table th.is-leaf {
  border-color: transparent;
}
::v-deep .el-table td {
  border-bottom: 1px solid #f3f3f3;
}
::v-deep .el-table tr:hover > td {
  background-color: #fff !important;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #f3f3f3;
}
::v-deep.el-form-item {
  width: calc(25% - 10px);
  .el-form-item__label {
    font-weight: normal !important;
    color: rgba(36, 36, 36, 1);
  }
}
.tab-div {
  border-bottom: 1px solid #f3f3f3;
  margin: 0 -10px;
  padding: 8px 10px;
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
.el-divider {
  background-color: rgba(243, 243, 243, 1);
}
.content-colum {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* for Opera */
}
</style>
<style>
.popper-class {
  background-color: rgba(48, 49, 51, 0.95);
  color: #fff;
}
</style>
