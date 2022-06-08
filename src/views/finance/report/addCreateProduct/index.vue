<!-- 新增自建产品 -->
<template>
  <div class="app-main">
    <div class="head_box">
      <el-row type="flex">
        <el-col :span="4">{{ type == 'edit' ? '新增产品' : '产品详情' }}</el-col>
      </el-row>
    </div>
    <el-row v-if="type == 'detail'" type="flex" class="head_box2">
      <el-col :span="4" :title="baseInfo.newClothNo" class="font"
        >布号：{{ baseInfo.newClothNo }}</el-col
      >
      <el-col v-if="type == 'detail'" class="created-font"
        >提交人：{{ baseInfo.createBy }} 创建时间：{{ baseInfo.createTime }}</el-col
      >
    </el-row>
    <div class="app-container">
      <div class="card-box item-mb-16">
        <el-form
          class="base-form"
          :model="baseInfo"
          :rules="baserules"
          ref="baseInfoForm"
          label-width="90px"
          :label-position="labelPosition"
          :class="[type == 'detail' ? 'prod-detail' : '']"
        >
          <el-form-item label="参考布号" prop="referenceClothNo">
            <!-- 搜索框 -->
            <el-select
              v-model="baseInfo.referenceClothNo"
              filterable
              remote
              :class="[type == 'detail' ? 'input-detail' : '']"
              :disabled="type == 'detail' ? true : false"
              placeholder="请输入关键词"
              :remote-method="queryReferenceClothNo"
              :loading="loading"
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
            <!-- <el-autocomplete
              v-model="baseInfo.referenceClothNo"
              :fetch-suggestions="queryReferenceClothNo"
              :placeholder="type == 'detail' ? '' : '请输入参考布号'"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'input-detail' : '']"
              @select="handleSelectReferenceClothNo"
              style="width: 100%"
            >
              <template slot-scope="{ item }">
                <div>{{ item.clothNo }}</div>
              </template>
            </el-autocomplete> -->
            <!-- <el-input
              style="width: 100%"
              v-model="baseInfo.referenceClothNo"
              placeholder="请输入参考布号"
            ></el-input> -->
          </el-form-item>

          <el-form-item label="布类" prop="clothType" required>
            <!-- 搜索框 -->
            <el-autocomplete
              v-model="baseInfo.clothType"
              :fetch-suggestions="queryClothType"
              placeholder="请输入布类"
              @select="handleSelectClothType"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'input-detail' : '']"
            >
              <template slot-scope="{ item }">
                <div>{{ item.dictLabel }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="织机规格" prop="loomSpecification" required>
            <!-- 搜索框 -->
            <el-autocomplete
              v-model="baseInfo.loomSpecification"
              :fetch-suggestions="queryLoomSpecification"
              placeholder="请输入织机规格"
              @select="handleSelectLoomSpecification"
              style="width: 100%"
              :disabled="type == 'detail' ? true : false"
              :class="[type == 'detail' ? 'input-detail' : '']"
            >
              <template slot-scope="{ item }">
                <div>{{ item.dictLabel }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <template>
            <el-form-item label="克重" prop="gramWeight" required>
              <template v-if="type == 'detail'">
                <div class="unit-detail">{{ baseInfo.gramWeight }} g/m<sup>2</sup></div>
              </template>

              <template v-else>
                <el-input
                  class="numrule"
                  type="number"
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'input-detail' : '']"
                  v-model.number="baseInfo.gramWeight"
                  placeholder="请输入克重"
                  style="width: 100%"
                >
                  <template slot="append">g/m<sup>2</sup></template>
                </el-input>
              </template>
            </el-form-item>
          </template>
          <template>
            <el-form-item label="幅宽" prop="widthCloth" required>
              <template v-if="type == 'detail'">
                <div class="unit-detail2">{{ baseInfo.widthCloth }} cm</div>
              </template>
              <template v-else>
                <el-input
                  class="numrule"
                  type="number"
                  :disabled="type == 'detail' ? true : false"
                  :class="[type == 'detail' ? 'input-detail' : '']"
                  v-model.number="baseInfo.widthCloth"
                  placeholder="请输入幅宽"
                  style="width: 100%"
                >
                  <template slot="append">cm</template>
                </el-input>
              </template>
            </el-form-item>
          </template>
          <el-form-item label="成分" prop="component" required>
            <div v-if="type == 'detail'">
              <div class="unit-detail2">{{ baseInfo.component }}</div>
            </div>
            <div v-else @click="componentDialogVisible = true">
              <el-input
                readonly
                :disabled="type == 'detail' ? true : false"
                :class="[type == 'detail' ? 'input-detail' : '']"
                v-model="baseInfo.component"
                placeholder="请输入成分"
                style="width: 100%"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="特殊工艺" prop="specialProcessName">
            <el-select
              v-model="baseInfo.specialProcessName"
              multiple
              :placeholder="type == 'detail' ? '' : '请选择'"
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
              v-model="baseInfo.functionName"
              multiple
              :placeholder="type == 'detail' ? '' : '请选择'"
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
        </el-form>
      </div>
      <div class="card-box item-mb-16">
        <el-row>
          <p class="font_h1">纱支信息</p>
          <el-form :model="formData" class="shazhi-form" :rules="formData.rules" ref="formRef">
            <el-table
              size="small"
              :data="formData.data"
              style="width: 100%; font-size: 14px; color: #242424; bordercolor: #000"
              highlight-current-row
              header-row-class-name="tableHeader"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="60px"
              ></el-table-column>
              <el-table-column
                v-for="(val, index) in formData.columns"
                :min-width="val.width"
                :key="index"
                :label="val.label"
                :prop="val.prop"
                :align="val.align"
              >
                <template v-slot="scope">
                  <el-form-item
                    v-if="scope.row.editFlag && (val.prop == 'yarnName' || val.prop == 'yarnNo')"
                    :prop="'data.' + scope.$index + '.' + val.prop"
                    :rules="{
                      required: true,
                      message: ' ',
                      trigger: 'blur',
                    }"
                  >
                    <el-select
                      v-model="formData.sel[val.prop]"
                      filterable
                      remote
                      placeholder="请输入关键词"
                      :remote-method="val.prop == 'yarnName' ? yarnNameMethod : yarnNoMethod"
                      :loading="loading"
                      @change="
                        handleSelect(val.prop == 'yarnName' ? 'yarnName' : 'yarnNo', $event, scope)
                      "
                    >
                      <el-option
                        v-for="item in options"
                        :key="val.prop == 'yarnName' ? item.wlmch : item.wlbh"
                        :label="val.prop == 'yarnName' ? item.wlmch : item.wlbh"
                        :value="val.prop == 'yarnName' ? item.wlmch : item.wlbh"
                      >
                      </el-option>
                    </el-select>
                    <!-- 搜索框 -->
                    <!-- <el-autocomplete
                      v-model="formData.sel[val.prop]"
                      :fetch-suggestions="val.prop == 'yarnName' ? queryName : queryName2"
                      placeholder="请输入内容"
                      @select="handleSelect"
                    >
                      <template slot-scope="{ item }">
                        <div>{{ val.prop == 'yarnName' ? item.wlmch : item.wlbh }}</div>
                      </template>
                    </el-autocomplete> -->
                    <!-- <el-input size="small" placeholder="请输入内容" v-model="formData.sel[item.prop]">
                </el-input> -->
                  </el-form-item>
                  <el-form-item
                    v-else-if="scope.row.editFlag && val.prop == 'yarnRatio'"
                    :prop="'data.' + scope.$index + '.' + val.prop"
                    :rules="{
                      required: true,
                      message: ' ',
                      trigger: 'blur',
                    }"
                  >
                    <el-input
                      size="small"
                      class="numrule"
                      @change="RatioChange($event)"
                      placeholder="请输入内容"
                      :type="val.type"
                      v-model="formData.sel[val.prop]"
                    >
                    </el-input>
                  </el-form-item>
                  <div
                    v-else
                    :class="[
                      val.prop == 'status'
                        ? scope.row[val.prop] == 0
                          ? 'launch-status'
                          : 'forbid-status'
                        : '',
                    ]"
                  >
                    {{
                      val.prop == 'status'
                        ? statusFilter(scope.row[val.prop])
                        : scope.row[val.prop] || '--'
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="112px"
                align="center"
                v-if="type == 'detail' ? false : true"
              >
                <template v-slot="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.states === 1"
                    @click.stop="saveRow(scope.row, scope.$index)"
                    size="small"
                  >
                    保存
                  </el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.states === 0"
                    @click="editRow(scope.row, scope.$index)"
                    size="small"
                  >
                    编辑
                  </el-button>
                  <el-button type="text" @click="deleteRow(scope.row, scope.$index)" size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div class="add_info" v-if="this.formData.data.length < 5 && type !== 'detail'">
            <el-button @click="addCraft">添加纱支</el-button>
          </div>
        </el-row>
      </div>
      <div class="footer" v-if="type !== 'detail'">
        <el-button @click="onCancel" class="save-btn">取消</el-button>
        <el-button @click="submit" class="sub-btn">保存</el-button>
      </div>
    </div>

    <!-- <div class="bottom_end_btn">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div> -->

    <!-- 弹窗 -->
    <el-dialog
      title="成分比例选择（%）"
      :visible.sync="componentDialogVisible"
      width="904px"
      :before-close="handleClose"
    >
      <el-form
        class="dialog-form"
        :model="baseInfo"
        :rules="rules"
        ref="Form"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
      >
        <el-form-item v-for="(item, index) in componentList" :key="index">
          <div>
            <div class="check-item">
              <div style="display: flex; margin-left: 12px">
                <div
                  class="check-title"
                  :style="item.input ? 'color:#0052D9' : ''"
                  style="margin-right: 10px"
                >
                  {{ item.component }}
                </div>
                <div class="check-title" :style="item.input ? 'color:#0052D9' : ''">
                  ({{ item.componentEnglish }})
                </div>
              </div>
              <el-input
                v-model="item.input"
                onkeyup="value=value.replace(/\D/g, '').replace(/^0{1,}/g, '')"
                type="number"
                class="check-input numrule"
                size="mini"
              ></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="bottom_btn">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="resetQuery">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formRules, formRules2 } from './config'
import { getCustomerInfoByName } from '@/api/customer/visit'

import {
  buildProduct,
  getDictList,
  getFabricQuotationByBh,
  getTableDataInfoToAble,
  getFunctionalCommitmentByName,
  getRawYarnInfoList,
  getBuildProductById,
} from '@/api/finance/report'
import { findComponentLoss } from '@/api/finance/report'
import _ from 'lodash'
export default {
  data() {
    return {
      type: 'detail',
      baserules: {
        clothType: [{ required: true, message: '请输入布类', trigger: ['blur', 'change'] }],
        loomSpecification: [
          { required: true, message: '请输入织机规格', trigger: ['blur', 'change'] },
        ],
        gramWeight: [{ required: true, message: '请输入克重', trigger: ['blur', 'change'] }],
        widthCloth: [{ required: true, message: '请输入幅宽', trigger: ['blur', 'change'] }],
        component: [{ required: true, message: '请输入成分', trigger: ['blur', 'change'] }],
      },
      //纱支信息
      // yarnInfo: {
      //   yarnName: '',
      //   yarnNo: '',
      //   yarnRatio: '',
      //   editFlag: false,
      //   states: 0,
      // },
      //纱支信息
      yarnInfo: {
        yarnName: '',
        yarnNo: '',
        yarnRatio: '',
        editFlag: true,
        states: 1,
      },
      //特殊工艺
      specialList: [],
      //功能性承诺
      functionList: [],
      // 表格数据
      formData: {
        sel: null, // 选中行
        columns: [
          {
            label: '纱线品名',
            align: 'left',
            type: 'number',
            width: '50%',
            prop: 'yarnName',
          },
          {
            label: '纱线编号',
            align: 'left',
            type: 'number',
            width: '25%',
            prop: 'yarnNo',
          },
          {
            label: '比例(%)',
            align: 'left',
            type: 'number',
            width: '25%',
            prop: 'yarnRatio',
          },
        ],
        data: [],
        rules: formRules2,
      },
      // 表单规则
      rules: _.cloneDeep(formRules),

      componentList: [],
      loading: false,
      options: [],
      clothoptions: [],
      componentDialogVisible: false,
      labelPosition: 'right',
      baseInfo: {
        referenceClothNo: '', //参考布号
        clothType: '', //布类
        loomSpecification: '', //织机规格
        gramWeight: '', //克重
        widthCloth: '', //幅宽
        component: '', //成分
        specialProcessName: '', // 特殊工艺
        functionName: '', // 功能性承诺
      },
    }
  },

  components: {},

  computed: {},
  created() {
    this.getComponentLoss()
    this.getCheckList()
    if (this.$route.query.id) {
      let data = {
        id: this.$route.query.id,
      }
      this.getDetailById(data)
    }
    this.type = this.$route.query.type
    const obj = Object.assign({}, this.$route, {
      title: `新增自建产品`,
    })
    console.log(obj)
    if (this.type == 'detail') {
      obj.meta.title = '产品详情'
    }
    this.$tab.updatePage(obj)
  },

  methods: {
    //比例改变
    RatioChange(evt) {
      if (Number(evt) === 0) {
        this.formData.sel.yarnRatio = ''
      }
    },
    yarnNameMethod(query) {
      if (query !== '') {
        this.loading = true
        let data = {
          wlmch: query,
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getRawYarnInfoList(data).then((res) => {
            // cb(res.data)
            this.options = res.data
            this.loading = false
          })
        }, 700)
      } else {
        this.options = []
      }
    },
    yarnNoMethod(query) {
      if (query !== '') {
        this.loading = true
        let data = {
          wlbh: query,
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getRawYarnInfoList(data).then((res) => {
            // cb(res.data)
            this.options = res.data
            this.loading = false
          })
        }, 700)
      } else {
        this.options = []
      }
    },
    //详情通过id初始化
    getDetailById(data) {
      getBuildProductById(data).then((res) => {
        this.formData.data = res.buildProductYarnList
        delete res.buildProductYarnList
        this.baseInfo = Object.assign(this.baseInfo, res)
        this.baseInfo.specialProcessName = this.baseInfo.specialProcessName
          ? this.baseInfo.specialProcessName.split(',')
          : []
        this.baseInfo.functionName = this.baseInfo.functionName
          ? this.baseInfo.functionName.split(',')
          : []
      })
    },
    getCheckList() {
      getTableDataInfoToAble().then((res) => {
        console.log(res)
        this.specialList = res.data
      })
      getFunctionalCommitmentByName().then((res) => {
        console.log(res)
        this.functionList = res.data
      })
    },
    //选择参考布号
    handleSelectReferenceClothNo(evt) {
      console.log(evt, this.clothoptions)
      let data = this.clothoptions.find((val) => {
        return val.clothNo == evt
      })
      console.log(evt, this.clothoptions, data)
      //基本信息
      this.baseInfo.referenceClothNo = data.clothNo
      this.baseInfo.component = data.cf
      this.baseInfo.clothType = data.productCategory
      this.baseInfo.widthCloth = data.fk
      this.baseInfo.gramWeight = data.kz
      this.baseInfo.loomSpecification = data.loomType
      if (data.functionName) {
        this.baseInfo.functionName = data.functionName
      }
      if (data.specialProcessName) {
        this.baseInfo.specialProcessName = data.specialProcessName
      }

      // //纱支信息
      if (data.quotationYarnVoList) {
        let list = []
        data.quotationYarnVoList.forEach((val) => {
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
        this.formData.data = list
      }
    },
    //模糊参考布号
    queryReferenceClothNo(query) {
      if (query !== '') {
        this.loading = true
        let data = {
          referenceClothNo: query,
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getFabricQuotationByBh(data).then((res) => {
            // cb(res.data)
            this.clothoptions = res.data
            this.loading = false
          })
        }, 700)
      } else {
        this.clothoptions = []
      }
      // if (queryString === '') {
      //   cb([])
      //   return
      // }
      // let data = {
      //   referenceClothNo: queryString,
      // }
      // console.log(queryString.length)

      // clearTimeout(this.timeout)
      // if (queryString.length >= 6) {
      //   this.timeout = setTimeout(() => {
      //     getFabricQuotationByBh(data).then((res) => {
      //       cb(res.data)
      //     })
      //   }, 700)
      // }
    },
    //选择布类
    handleSelectClothType(item) {
      this.baseInfo.clothType = item.dictLabel
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
    //选择织机规格
    handleSelectLoomSpecification(item) {
      this.baseInfo.loomSpecification = item.dictLabel
    },
    //模糊搜索织机规格
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
    //获取成分列表
    getComponentLoss() {
      findComponentLoss().then((res) => {
        console.log(res)
        this.componentList = res.data
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
    //提交
    submit() {
      let flag = this.validateForm('baseInfoForm')
      if (!flag) return
      let ac = 0
      this.formData.data.forEach((item) => {
        if (item.yarnRatio) {
          console.log(Number(item.yarnRatio), 'yarnRatio')
          ac = ac + Number(item.yarnRatio)
          console.log('listac', ac)
        }
      })
      if (ac === 100) {
        console.log('确定', this.baseInfo, this.formData)
        let data = JSON.parse(JSON.stringify(this.baseInfo))
        data.buildProductYarnList = this.formData.data
        data.functionName = String(data.functionName)
        data.specialProcessName = String(data.specialProcessName)
        buildProduct(data).then((res) => {
          // let url = '/finance/createProduct'
          // this.$router.push({ path: url })
          this.onCancel()
        })
      } else if (this.formData.data.length == 0) {
        this.$message.error('请添加纱支信息！')
      } else {
        this.$message.error('请填选正确的纱支信息比例！')
      }
    },
    onCancel() {
      const obj = { path: '/finance/createProduct' }
      this.$tab.closeOpenPage(obj)
      // let url = '/finance/createProduct'
      // this.$router.push({ path: url })
    },
    //删除
    deleteRow(val, index) {
      console.log(val, index)
      this.formData.data.splice(index, 1)
      console.log(this.formData.data)
    },
    //添加纱支
    addCraft() {
      for (const i of this.formData.data) {
        if (i.editFlag) return this.$message.warning('请先保存当前编辑项')
      }
      if (this.formData.data.length < 5) {
        let data = JSON.parse(JSON.stringify(this.yarnInfo))
        this.formData.data.push(data)
        this.formData.sel = data
      } else {
        this.$message.error('纱支信息最多只能新增5条！')
      }
    },
    // validatorNumber(rule, value, callback) {
    //   if (value && !/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
    //     callback(new Error('请输入数字'))
    //   } else {
    //     callback()
    //   }
    // },
    /**
     * 输入客户名搜索
     * @param {string} queryString
     * @param {*} cb
     */
    queryName2(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      let data = {
        wlbh: queryString,
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getRawYarnInfoList(data).then((res) => {
          cb(res.data)
        })
      }, 700)
    },
    queryName(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      let data = {
        wlmch: queryString,
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getRawYarnInfoList(data).then((res) => {
          cb(res.data)
        })
      }, 700)
    },
    /**
     * 点选客户名称事件
     * @param {*} item 选择的客户名称
     */
    handleSelect(type, evt, scope) {
      //去重
      if (type == 'yarnName') {
        let redata = 0
        this.formData.data.forEach((val) => {
          if (val.yarnName === evt) {
            redata = redata + 1
          }
        })
        if (redata > 1) {
          this.formData.data[scope.$index].yarnName = ''
          this.formData.sel.yarnName = ''
          return this.$message.error('不能选择相同数据')
        }
      }
      //去重
      if (type == 'yarnNo') {
        let redata = 0
        this.formData.data.forEach((val) => {
          if (val.yarnNo === evt) {
            redata = redata + 1
          }
        })
        if (redata > 1) {
          this.formData.data[scope.$index].yarnNo = ''
          this.formData.sel.yarnNo = ''
          return this.$message.error('不能选择相同数据')
        }
      }

      this.options.forEach((val) => {
        if (type == 'yarnName' && this.formData.sel.yarnName == val.wlmch) {
          this.formData.sel.yarnNo = val.wlbh
        }
        if (type == 'yarnNo' && this.formData.sel.yarnNo == val.wlbh) {
          this.formData.sel.yarnName = val.wlmch
        }
        this.options = []
      })
    },
    blur(evt) {
      console.log(evt, this.formData.sel)
    },
    saveRow(row, index) {
      // 保存
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          // 保存
          const data = JSON.parse(JSON.stringify(this.formData.sel))
          for (const k in data) {
            row[k] = data[k] // 将sel里面的value赋值给这一行。ps(for....in..)的妙用，细心的同学发现这里我并没有循环对象row
          }
          row.editFlag = false
          row.states = 0
          // editPrice(data).then((data) => {
          //   this.getList()
          // })
        } else {
          this.$message.error('请先完善必要信息')
          return false
        }
      })
    },
    editRow(row) {
      // 编辑
      for (const i of this.formData.data) {
        if (i.editFlag) return this.$message.warning('请先保存当前编辑项')
      }
      this.formData.sel = row
      row.editFlag = true
      row.states = 1
    },
    // 确定
    resetQuery(done) {
      let text = ''
      let ac = 0
      this.componentList.forEach((i) => {
        const item = i
        if (item.input == '0') {
          item.input = ''
        }
        if (item.input) {
          text += `${item.componentEnglish}${item.input}% `
          console.log(Number(item.input), 'input')
          ac = ac + Number(item.input)
        }
      })
      if (ac === 100) {
        this.baseInfo.component = text
        this.componentDialogVisible = false
      } else {
        this.$message.error('请填选正确的成分比例')
      }
    },
    //取消
    handleClose(done) {
      this.componentDialogVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import './index';
.check-item {
  display: inline-block;
  width: 196px;
  margin: 10px;
}
.check-title {
  margin-bottom: 6px;
  color: #000;
  font-size: 14px;
}
.check-input {
  color: #000;
}
.bottom_btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
// .app-container {
//   background-color: #fff;
//   border-radius: 8px;
//   padding-top: 20px;
//   margin: 20px;
//   padding: 0px;
// }
// ::v-deep .app-main {
//   background-color: aliceblue !important;
// }
::v-deep .dialog-form .el-form-item--medium .el-form-item__content {
  line-height: 20px !important;
}

::v-deep .dialog-form .el-form-item {
  margin-bottom: 0px;
}
::v-deep .dialog-form.el-form--inline .el-form-item {
  margin-right: 0px;
}
::v-deep .shazhi-form .el-form-item {
  margin-bottom: 0px;
}
.bottom_end_btn {
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 40px);
}
.font_h1 {
  width: 64px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 20px;
}
.add_info {
  text-align: center;
  margin-top: 20px;
  .el-button {
    border: 1px dashed #dcdfe6;
    color: #266fe8;
  }
}
.container {
  margin: 24px;

  .upload-img {
    display: flex;
    font-size: 14px;
    .flex {
      flex: 1;
    }
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
.app-main {
  background: rgba(245, 247, 250, 1);
  margin-bottom: 80px;
}
.head_box {
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  color: #242424;
  padding-left: 24px;
  font-weight: 600;
  border-bottom: 1px solid #f3f3f3;
}
.head_box2 {
  background-color: #fff;
  height: 64px;
  line-height: 64px;
  color: #242424;
  padding-left: 24px;
  border-bottom: 1px solid #f3f3f3;
  .font {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}
// 消除输入框右边上下箭头
::v-deep.numrule input::-webkit-outer-spin-button,
::v-deep.numrule input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep.numrule input[type='number'] {
  -moz-appearance: textfield;
}
.created-font {
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  text-align: right;
  margin-right: 24px;
}
.prod-detail {
  ::v-deep .el-form-item {
    .el-form-item__label {
      color: #8b8b8b;
    }
  }
}
.input-detail {
  ::v-deep .el-input__inner {
    border: 1px solid transparent;
    background: transparent;
    cursor: auto;
    color: #242424;
  }
  ::v-deep .el-input-group__append {
    margin: 0;
    padding: 0;
    border-color: transparent;
    background: transparent;
  }
}
.unit-detail {
  color: #242424;
  padding-left: 15px;
  line-height: 29px;
}
.unit-detail2 {
  color: #242424;
  padding-left: 15px;
}
.el-table td.el-table__cell div {
  width: 100%;
}
::v-deep .el-select .el-input.is-disabled .el-input__inner:hover {
  border-color: transparent;
}
</style>
