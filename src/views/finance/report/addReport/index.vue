<template>
  <div class="app-main">
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
          <div class="search-form" style="width: 100%">
            <el-form-item label="客户" prop="customerName">
              <!-- <el-select
                v-model="baseInfo.customerName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                class="auto-prop"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <!-- 搜索框 -->
              <el-autocomplete
                v-model.trim="baseInfo.customerName"
                :fetch-suggestions="queryName"
                placeholder="请输入客户名称"
                :trigger-on-focus="false"
                @select="handleSelect"
                class="auto-prop"
                style="width: 100%"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.khmch }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="最终客户" prop="finalCustomerName">
              <el-input
                v-model="baseInfo.finalCustomerName"
                placeholder="请输入最终客户"
                :clearable="type == 'detail' ? false : true"
                :class="[type == 'detail' ? 'input-detail' : '']"
              ></el-input>
            </el-form-item>
            <el-form-item label="结算方式" prop="settlementMethod">
              <el-select v-model="baseInfo.settlementMethod" clearable placeholder="请选择">
                <el-option
                  v-for="(dict, index) in dict.type.pay_ways"
                  :key="index"
                  :label="dict.label"
                  :value="dict.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成品用途">
              <el-input
                v-model="baseInfo.productApplication"
                placeholder="请输入成品用途"
                :clearable="type == 'detail' ? false : true"
                class="auto-prop"
                :class="[type == 'detail' ? 'input-detail' : '']"
              ></el-input>
            </el-form-item>
          </div>

          <el-form-item
            label="备注"
            :class="['mark-textarea', type == 'detail' ? 'textarea-detail' : '']"
          >
            <el-input
              maxlength="200"
              v-model="baseInfo.remark"
              rows="3"
              type="textarea"
              :disabled="type == 'detail' ? true : false"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
        <div class="upload-img">
          <div style="width: 90px; text-align: right; padding-right: 12px">附件</div>
          <div class="flex">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :before-remove="handleRemove"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-change="handleLicensePreview"
              :auto-upload="false"
              :headers="headers"
              :limit="4"
              :class="{ hide: showUpload }"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </div>
        </div>
        <p class="img-tips">只能上传JPG/JPEG/PNG文件，且单个文件不超过10Mb</p>
      </div>
      <div class="card-box">
        <p class="title">报价产品</p>
        <el-table
          size="small"
          :data="formData.data"
          border
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          header-row-class-name="tableHeader"
          empty-text=" "
        >
          <el-table-column label="布号" prop="clothNo" width="100"></el-table-column>
          <el-table-column label="布类" prop="clothType" width="100"></el-table-column>
          <el-table-column label="品名" prop="pm" width="120" :show-overflow-tooltip="true">
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
          <el-table-column label="纱线品名" width="260" :show-overflow-tooltip="false">
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
                <!-- {{ item.yarnName }} -->
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
          <el-table-column label="颜色">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.colorName" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template v-slot="scope">
              <el-button type="text" @click="deleteRow(scope.row, scope.$index)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-box">
          <el-button @click="add" class="add-btn-dashed">添加产品</el-button>
        </div>
      </div>
      <div class="footer">
        <el-button v-if="this.quotedOrderNo" @click="deleteQuoted()" class="save-btn">
          删除
        </el-button>
        <el-button @click="submit(0)" class="save-btn">保存</el-button>
        <el-button @click="submit(1)" class="sub-btn">提交</el-button>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="选择产品"
      :visible.sync="productDialogVisible"
      width="1104px"
      class="dialog-contant"
      :before-close="handleClose"
    >
      <div class="box">
        <el-form
          class="base-form"
          :model="productInfo"
          :rules="productRules"
          ref="productInfoForm"
          :inline="true"
          label-width="90px"
          :label-position="labelPosition"
        >
          <el-form-item label="布号" prop="clothNo">
            <el-select
              v-model="productInfo.clothNo"
              filterable
              remote
              reserve-keyword
              placeholder="请输入布号"
              :remote-method="queryReferenceClothNo"
              :loading="loading"
              class="auto-prop"
              @change="handleSelectReferenceClothNo($event)"
            >
              <el-option
                v-for="item in clothoptions"
                :key="item.clothNo"
                :label="item.clothNo"
                :value="item.clothNo"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特殊工艺" prop="specialProcessName">
            <el-select
              v-model="productInfo.specialProcessName"
              multiple
              placeholder="请选择"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'select-detail' : '']"
            >
              <el-option
                v-for="(dict, index) in specialList"
                :key="index"
                :label="dict.processName"
                :value="dict.processName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="功能性承诺" prop="functionName">
            <el-select
              v-model="productInfo.functionName"
              multiple
              placeholder="请选择"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'select-detail' : '']"
            >
              <el-option
                v-for="(dict, index) in functionList"
                :key="index"
                :label="dict.commitmentName"
                :value="dict.commitmentName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色" prop="colorName">
            <el-select
              v-model="productInfo.colorName"
              multiple
              placeholder="请选择"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'select-detail' : '']"
            >
              <el-option
                v-for="(dict, index) in colorList"
                :key="index"
                :label="dict.category"
                :value="dict.category"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单规模" prop="orderNum">
            <el-select
              v-model="productInfo.orderNum"
              placeholder="请选择"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'select-detail' : '']"
            >
              <el-option
                v-for="(dict, index) in weightList"
                :key="index"
                :label="dict.weightRange"
                :value="dict.weightRange"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div class="basic-info">
          <p class="info">{{ productInfo.pm }}</p>
          <ul>
            <li><span class="tit">成分</span>{{ productInfo.component }}</li>
            <li><span class="tit">布类</span>{{ productInfo.clothType }}</li>
            <li><span class="tit">织机规格</span>{{ productInfo.loomSpecification }}</li>
            <li><span class="tit">幅宽(cm)</span>{{ productInfo.widthCloth }}</li>
            <li><span class="tit">克重(g/㎡)</span>{{ productInfo.gramWeight }}</li>
            <li><span class="tit">米重(g/m)</span>{{ productInfo.meterWeight }}</li>
          </ul>
        </div>
        <el-table
          size="small"
          :data="formProductData.data"
          style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
          highlight-current-row
          header-row-class-name="tableHeader"
        >
          <el-table-column
            v-for="(item, index) in formProductData.columns"
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
        </el-table>
        <div class="bottom-btn">
          <el-button class="cancel-btn" @click="handleClose">取消</el-button>
          <el-button class="sub-btn" type="primary" @click="confirm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  getDictList,
  getFabricQuotationByBh,
  getTableDataInfoToAble,
  getFunctionalCommitmentByName,
  getColorDataToAble,
  getWeightStepDtoToAble,
  addQuotedOrder,
  getQuotedPriceByNo,
  deleteQuotedOrderProduct,
  deleteQuotedOrderNo,
  getProductCustomerInfoByName,
  ossUpload,
} from '@/api/finance/report'
import { getCustomerInfoByName } from '@/api/customer/visit'
import { formRules, formProductRules, brandInfoTemp, dictMap } from './utils.js'
export default {
  dicts: dictMap,
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/file/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      quotedOrderNo: '',
      type: '', // 表单类型
      labelPosition: 'right',
      // 表单验证规则
      rules: Object.freeze(formRules),
      productRules: Object.freeze(formProductRules),
      brandInfoTemp: Object.freeze(brandInfoTemp),
      //特殊工艺
      specialList: [],
      //功能性承诺
      functionList: [],
      // 颜色选择
      colorList: [],
      // 下单重量选择
      weightList: [],
      // 图片上传地址
      imgUrl: [],
      fileList: [],
      options: [],
      clothoptions: [],
      loading: false,
      showUpload: false,
      //基础信息
      baseInfo: {
        orderStatus: '',
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
        specialProcessName: [], // 特殊工艺
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
            label: '订单规模',
            align: 'center',
            type: 'text',
            prop: 'orderNum',
          },
        ],
        data: [],
      },
      // 表格数据
      formProductData: {
        sel: null, // 选中行
        columns: [
          {
            label: '纱线编号',
            align: 'center',
            type: 'number',
            prop: 'yarnNo',
          },
          {
            label: '纱线品名',
            align: 'center',
            type: 'text',
            prop: 'yarnName',
          },
          {
            label: '比例(%)',
            align: 'center',
            type: 'number',
            prop: 'yarnRatio',
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

  mounted() {
    console.log('process.env.VUE_APP_BASE_API', process.env.VUE_APP_BASE_API)
  },

  methods: {
    getQuotedPriceByNo() {
      getQuotedPriceByNo(this.quotedOrderNo).then((res) => {
        res.data.productList.forEach((item) => {
          let colorArray = []
          if (item.quotedOrderPriceVoList) {
            item.quotedOrderPriceVoList.forEach((j) => {
              colorArray.push(j.colorName)
            })
          }
          item.colorName = []
          item.colorName = colorArray
          if (item.functionName) {
            item.functionName = item.functionName.split(',')
          }
          if (item.specialProcessName) {
            item.specialProcessName = item.specialProcessName.split(',')
          }
        })
        if (res.data.enclosureAddress) {
          let imgList = res.data.enclosureAddress.split(';').map((x) => {
            return {
              url: x,
            }
          })
          this.imgUrl = res.data.enclosureAddress.split(';')
          this.fileList = imgList
          if (this.fileList.length >= 4) {
            this.showUpload = true
          }
        }
        this.baseInfo = res.data
        this.formData.data = this.baseInfo.productList
      })
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
    /**
     * 输入客户名搜索
     * @param {string} queryString
     * @param {*} cb
     */
    queryName(queryString, cb) {
      console.log(queryString === '')
      if (queryString === '' || queryString === ' ') {
        cb([])
        return
      }

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getProductCustomerInfoByName(queryString).then((res) => {
          cb(res.data.data)
        })
      }, 700)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getProductCustomerInfoByName(query).then((res) => {
            if (res.data.data) {
              let data = res.data.data.map((item) => {
                return {
                  value: item.khmch,
                  label: item.khmch,
                }
              })
              // cb(res.data)
              this.options = data
              this.loading = false
            }
          })
        }, 700)
      } else {
        this.options = []
      }
    },
    /**
     * 点选客户名称事件
     * @param {*} item 选择的客户名称
     */
    handleSelect(item) {
      this.baseInfo.customerName = item.khmch
    },
    //选择布号
    handleSelectReferenceClothNo(evt) {
      let item = this.clothoptions.find((val) => {
        return val.clothNo == evt
      })
      //基本信息
      this.productInfo.clothNo = item.clothNo
      this.productInfo.component = item.cf
      this.productInfo.clothType = item.productCategory
      this.productInfo.widthCloth = item.fk
      this.productInfo.gramWeight = item.kz
      this.productInfo.pm = item.pm
      this.productInfo.specialProcessName = item.specialProcessName
      this.productInfo.functionName = item.functionName
      this.productInfo.loomSpecification = item.loomType
      this.productInfo.meterWeight = (((+item.fk + 5) / 100) * +item.kz).toFixed(2) || 0
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
        this.productInfo.rawYarnVoList = JSON.parse(JSON.stringify(list))
      }
    },
    //模糊布号
    queryReferenceClothNo(query) {
      if (query !== '') {
        this.loading = true
        let data = {
          referenceClothNo: query,
        }
        clearTimeout(this.timeout)
        if (query.length >= 4) {
          this.timeout = setTimeout(() => {
            getFabricQuotationByBh(data).then((res) => {
              // cb(res.data)
              this.clothoptions = res.data
              this.loading = false
            })
          }, 700)
        }
      } else {
        this.clothoptions = []
      }
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
      fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.imgUrl.splice(index, 1)
          return false
        }
      })
      if (fileList.length < 5) {
        setTimeout(() => {
          this.showUpload = false
        }, 800)
      }
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
    handleSuccess(file) {
      this.imgUrl.push(file.data.url)
    },
    handleLicensePreview(file, fileList) {
      if (file) {
        const isJPG = file.raw.type === 'image/jpeg'
        const isPNG = file.raw.type === 'image/png'
        const isJPEG = file.raw.type === 'image/jpeg'
        const isLt10M = file.raw.size / 1024 / 1024 < 10
        let isImg = isJPG || isJPEG || isPNG
        if (!isImg) {
          this.$message.error('只能上传JPG/JPEG/PNG文件!')
          fileList.pop()
          return
        }
        if (!isLt10M) {
          this.$message.error('图片大小不能超过 10MB!')
          fileList.pop()
          return
        }
      }
      if (this.imgUrl.length > 2) {
        this.showUpload = true
      }
      let fd = new FormData()
      fd.append('multipartFile', file.raw)
      ossUpload(fd).then((res) => {
        this.imgUrl.push(res.data.url)
      })
    },
    add() {
      this.productDialogVisible = true
      this.productInfo = {
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
        rawYarnVoList: [], // 纱支信息
      }
      this.formProductData.data = []
      setTimeout(() => {
        this.$refs['productInfoForm'].clearValidate()
      }, 0)
    },
    deleteRow(row, index) {
      if (row.orderProductId) {
        let data = {
          clothNo: row.clothNo,
          quotedOrderNo: this.quotedOrderNo,
        }
        deleteQuotedOrderProduct(data).then((res) => {
          this.formData.data.splice(index, 1)
        })
      } else {
        this.formData.data.splice(index, 1)
      }
    },
    // 弹框--确定按钮
    confirm(done) {
      // console.log(this.productInfo)
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
      if (
        !(
          this.productInfo.clothType &&
          this.productInfo.component &&
          this.productInfo.loomSpecification &&
          this.productInfo.widthCloth &&
          this.productInfo.gramWeight
        )
      ) {
        this.$message.error('布号参数不完整，请选择其他布号')
        return
      }
      let index = this.baseInfo.productList.findIndex(
        (item) => item.clothNo === this.productInfo.clothNo,
      )
      if (index > -1) {
        this.$message.error('不能添加重复布号')
        return
      }
      this.baseInfo.productList.push(JSON.parse(JSON.stringify(this.productInfo)))
      this.formData.data = this.baseInfo.productList
      this.productDialogVisible = false
      this.clothoptions = []
    },
    //取消
    handleClose(done) {
      this.productDialogVisible = false
    },
    save() {
      // console.log(this.baseInfo)
    },
    submit(type) {
      let flag = this.validateForm('baseInfoForm')
      //如果验证未通过
      if (!flag) {
        this.$notify({
          title: '错误',
          message: '存在必填信息没有填选的情况',
          type: 'error',
        })
        return
      }
      if (this.baseInfo.productList.length == 0) {
        this.$message.error('请添加产品')
        return
      }
      this.baseInfo.enclosureAddress = this.imgUrl.toString()
      this.baseInfo.enclosureAddress = this.baseInfo.enclosureAddress.replaceAll(',', ';')
      this.baseInfo.orderStatus = type
      addQuotedOrder(this.baseInfo).then((res) => {
        // let url = '/finance/reportList'
        // this.$router.push({ path: url })
        const obj = { path: '/finance/reportList' }
        this.$tab.closeOpenPage(obj)
        // console.log(res)
      })
      console.log('this.productInfo', this.productInfo)
      console.log('this.baseInfo', this.baseInfo)
    },
    deleteQuoted() {
      deleteQuotedOrderNo(this.quotedOrderNo).then((res) => {
        const obj = { path: '/finance/reportList' }
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
    if (this.type == 'edit') {
      this.quotedOrderNo = this.$route.query.quotedOrderNo
      this.getQuotedPriceByNo()
    }
    this.getCheckList()
  },
}
</script>
<style lang="scss" scoped>
.search-form .el-form-item {
  min-width: 180px;
  width: calc(25% - 40px);
  margin-right: 40px;
}
.app-main {
  background: rgba(245, 247, 250, 1);
  padding-bottom: 80px;
  height: 100%;
  overflow-y: scroll;
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
      .add-btn-dashed {
        background: #ffffff;
        border-radius: 4px;
        border: 1px #266fe8 dashed;
        color: #266fe8;
        padding: 10px 16px;
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
    width: calc(50% - 40px) !important;
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
      // width: calc(25% - 10px);
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
      .el-form-item__content {
        width: calc(100% - 90px);
      }
    }
    .basic-info {
      position: relative;
      margin-bottom: 16px;
      .info {
        font-size: 16px;
        font-weight: bold;
        color: rgba(36, 36, 36, 1);
        padding-left: 40px;
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
  border-right-color: #e7e7e7;
  border-bottom-color: transparent;
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
.el-table--border {
  border: 1px solid #f3f3f3;
}
::v-deep .el-table--border .el-table__cell {
  border-right: 1px solid #f3f3f3;
}
::v-deep.el-form-item {
  // width: calc(25% - 10px);
  .el-form-item__label {
    font-weight: normal !important;
    color: rgba(36, 36, 36, 1);
  }
}
::v-deep .el-textarea__inner {
  font-family: auto;
  padding: 6px 15px;
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
// .auto-prop {
//   ::v-deep .el-input {
//     .el-input__inner {
//       width: 250px;
//     }
//   }
// }
// .auto-prop {
//   ::v-deep .el-input__inner {
//     width: 250px;
//   }
// }
</style>
<style>
.popper-class {
  background-color: rgba(48, 49, 51, 0.95);
  color: #fff;
}
.flex .hide .el-upload--picture-card {
  display: none !important;
}
</style>
