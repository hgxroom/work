<!-- 拜访计划新增、编辑页面 -->
<template>
  <div class="app-container">
    <div class="card-box item-mb-16">
      <el-form
        class="visitForm"
        :model="formInline"
        :inline="true"
        ref="visitForm"
        :rules="rules"
        label-width="90px"
        :label-position="labelPosition"
      >
        <el-form-item label="客户名称" prop="customerName">
          <!-- 搜索框 -->
          <el-autocomplete
            v-model="formInline.customerName"
            :fetch-suggestions="queryName"
            placeholder="请输入内容"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div>{{ item.customerName }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!-- <el-form-item label="客户区域" prop="customerArea">
        <el-input
          v-model="formInline.customerArea"
          disabled
          :clearable="type == 'detail' ? false : true"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item> -->
        <el-form-item label="品牌名称" prop="brandName">
          <el-select
            v-model="formInline.brandName"
            placeholder="请选择"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'select-detail' : '']"
          >
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.brandName"
              :value="item.brandName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="业务员" prop="salesman">
        <el-input
          v-model="formInline.salesman"
          :disabled="true"
          :clearable="type == 'detail' ? false : true"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item> -->
        <el-form-item label="拜访对象" prop="visitObject">
          <el-input
            v-model="formInline.visitObject"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
            placeholder="请输入对象"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input
            v-model="formInline.position"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
            placeholder="请输入职位"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="拜访目的" prop="visitPurpose">
        <el-select
          v-model="formInline.visitPurpose"
          placeholder="请选择"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'select-detail' : '']"
        >
          <el-option
            v-for="(dict, index) in dict.type.customer_visit_purpose"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item> -->
        <el-form-item label="标题" prop="titleName">
          <el-input
            v-model="formInline.titleName"
            placeholder="请输入标题"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail input-customer-name' : '']"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="拜访时间" prop="planStartTime">
          <span v-if="type == 'detail'" style="color: #666; padding-left: 15px">
            {{ formInline.planStartTime }} - {{ formInline.planEndTime }}
          </span>
          <el-date-picker
            v-if="type !== 'detail'"
            v-model="datePickerTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            @change="pickTime"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="联系方式" prop="contactInfo">
        <el-input
          v-model="formInline.contactInfo"
          maxlength="11"
          :clearable="type == 'detail' ? false : true"
          :disabled="type == 'detail' ? true : false"
          :class="[type == 'detail' ? 'input-detail' : '']"
        ></el-input>
      </el-form-item> -->
      </el-form>
      <el-form
        class="visitForm"
        ref="baseInfoForm"
        :model="formInline"
        :inline="true"
        :rules="rules"
        :label-position="'right'"
        label-width="90px"
      >
        <el-form-item class="fullWidth" label="计划目标" prop="objectivePlan">
          <p v-if="type == 'detail'" class="unit-detail">{{ formInline.objectivePlan }}</p>
          <el-input
            placeholder="请输入计划目标"
            v-if="type !== 'detail'"
            type="textarea"
            v-model="formInline.objectivePlan"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-textarea-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-group" v-if="type !== 'detail'">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit" v-hasPermi="['customer:visit:edit']"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getcustomerVisitPlan,
  getcustomerVisitPlanDetailsById,
  editCustomerVisitPlan,
} from '@/api/customer/visitPlanList'
import {
  getCustomerInfoByName,
  createCustomerVisit,
  editCustomerVisit,
  getVisitById,
} from '@/api/customer/visit'
import { formRules } from './utils'
export default {
  dicts: ['customer_visit_purpose'],
  data() {
    return {
      labelPosition: 'right',
      type: '', // 表单类型
      rules: Object.freeze(formRules),
      brandList: [],
      queryTimeout: null,
      datePickerTime: [],
      //表单信息
      formInline: {
        titleName: '',
        objectivePlan: '',
        customerId: '',
        brandName: '', //品牌名称
        customerArea: '', //客户区域
        customerName: '', //客户名称
        position: '', //职位
        salesman: '',
        visitState: '', //拜访状态
        planEndTime: '',
        visitObject: '', //拜访对象
        visitDesc: '', //
        planStartTime: '', //拜访时间
        visitPlanData: '', //改期时拜访记录编辑数据
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
      },
    }
  },
  computed: {
    ...mapGetters(['name']),
    editState: function () {
      const id = this.$route.params.id
      return id ? '编辑' : '新增'
    },
    id: function () {
      const id = this.$route.params.id
      return id ? id : ''
    },
  },

  created() {
    debugger
    this.type = this.$route.query.type
    if (this.$route.query.data) {
      this.visitPlanData = JSON.parse(this.$route.query.data)
    }

    if (this.id) {
      this.getData()
    } else {
      this.formInline.salesman = this.name
    }

    const obj = Object.assign({}, this.$route, {
      title: `计划(${this.editState})`,
    })
    if (this.type == 'detail') {
      obj.title = '计划(详情)'
    }
    this.$tab.updatePage(obj)
  },
  methods: {
    getData() {
      if (!this.id) {
        this.$message({
          message: '当前的拜访ID不存在，退回列表页',
          type: 'error',
        })
        const obj = { path: '/customer/visitPlanList' }
        this.$tab.closeOpenPage(obj)
        return
      }

      getcustomerVisitPlanDetailsById(this.id).then((res) => {
        const {
          titleName,
          objectivePlan,
          customerId,
          brandName, //品牌名称
          customerArea, //客户区域
          customerName, //客户名称
          position, //职位
          salesman,
          visitState, //拜访状态
          planEndTime,
          visitObject, //拜访对象
          visitDesc, //
          planStartTime, //拜访时间
        } = res.data

        this.formInline = {
          titleName,
          objectivePlan,
          customerId,
          brandName, //品牌名称
          customerArea, //客户区域
          customerName, //客户名称
          position, //职位
          salesman,
          visitState, //拜访状态
          planEndTime,
          visitObject, //拜访对象
          visitDesc, //
          planStartTime, //拜访时间
        }
        this.datePickerTime[0] = this.formInline.planStartTime
        this.datePickerTime[1] = this.formInline.planEndTime
        this.$set(this.datePickerTime)
        if (this.type == 'detail') {
          for (let item in this.formInline) {
            let type = typeof this.formInline[item]
            if (type == 'string' && this.formInline[item] == '') {
              this.formInline[item] = '-'
            } else if (type == 'object' && this.formInline[item] == null) {
              this.formInline[item] = '无'
            } else if (
              type == 'object' &&
              Array.isArray(this.formInline[item]) &&
              this.formInline[item].length == 0
            ) {
              this.formInline[item] = ['-']
            }
          }
          console.log('this.formInline', this.formInline)
        }
      })
    },
    /**
     * 输入客户名搜索
     * @param {string} queryString
     * @param {*} cb
     */
    queryName(queryString, cb) {
      console.log(queryString === '')
      if (queryString === '') {
        cb([])
        return
      }

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getCustomerInfoByName(queryString).then((res) => {
          cb(res.data)
        })
      }, 700)
    },
    /**
     * 点选客户名称事件
     * @param {*} item 选择的客户名称
     */
    handleSelect(item) {
      console.log(item)
      this.formInline.customerId = item.id
      this.formInline.customerName = item.customerName
      this.formInline.customerArea = item.customerArea
      this.brandList = item.brandList
    },

    pickTime(picker) {
      this.formInline.planStartTime = picker[0]
      this.formInline.planEndTime = picker[1]
    },

    submit() {
      const {
        customerId,
        customerName,
        customerArea,
        brandName,
        salesman,
        objectivePlan,
        planEndTime,
        planStartTime,
        position,
        titleName,
        visitDesc,
        visitObject,
        visitState,
      } = this.formInline
      const data = {
        customerId,
        customerName,
        customerArea,
        brandName,
        salesman,
        objectivePlan,
        planEndTime,
        planStartTime,
        position,
        titleName,
        visitDesc,
        visitObject,
        visitState,
      }
      let flag = this.validateForm('visitForm') && this.validateForm('baseInfoForm')
      if (flag) {
        getcustomerVisitPlan(data).then((res) => {
          if (this.type == 'edit') {
            editCustomerVisitPlan(this.visitPlanData).then((val) => {
              this.$message({
                message: '提交成功',
                type: 'success',
              })
              this.cancel()
            })
          } else {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.cancel()
          }
        })
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
    cancel() {
      const obj = { path: '/customer/visitPlanList' }
      this.$tab.closeOpenPage(obj)
    },
  },
}
</script>
<style lang="scss" scoped>
.visitForm {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .el-form-item {
    width: calc(33.33% - 10px);
  }
  .el-textarea {
    width: 53%;
  }
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
  .fullWidth {
    width: 100%;
    ::v-deep .el-form-item__label {
      width: 90px;
      text-align: right;
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
  width: 53%;
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
</style>
