<template>
  <div class="app-container">
    <div class="card-box">
      <el-form
        class="visitForm"
        :model="formInline"
        :inline="true"
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
        <el-form-item label="客户区域" prop="customerArea">
          <el-input
            v-model="formInline.customerArea"
            disabled
            :clearable="type == 'detail' ? false : true"
            :class="[type == 'detail' ? 'input-detail' : '']"
          ></el-input>
        </el-form-item>
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
        <el-form-item label="业务员" prop="salesman">
          <el-input
            v-model="formInline.salesman"
            :disabled="true"
            :clearable="type == 'detail' ? false : true"
            :class="[type == 'detail' ? 'input-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item label="拜访对象" prop="visitPeople">
          <el-input
            v-model="formInline.visitPeople"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="post">
          <el-input
            v-model="formInline.post"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item label="拜访目的" prop="visitPurpose">
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
        </el-form-item>
        <el-form-item label="拜访时间" prop="visitTime">
          <span v-if="type == 'detail'" style="color: #666; padding-left: 15px">
            {{ formInline.visitTime }} - {{ formInline.visitEndTime }}
          </span>
          <el-date-picker
            v-if="type !== 'detail'"
            v-model="datePickerTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="pickTime"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input
            v-model="formInline.contactInfo"
            maxlength="11"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-detail' : '']"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        class="visitForm"
        :model="formInline"
        :inline="true"
        :rules="rules"
        :label-position="'top'"
      >
        <el-form-item class="fullWidth" label="拓客策略">
          <p v-if="type == 'detail'" class="unit-detail">{{ formInline.expansionStrategy }}</p>
          <el-input
            v-if="type !== 'detail'"
            type="textarea"
            autosize
            v-model="formInline.expansionStrategy"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-textarea-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item class="fullWidth" label="推进计划">
          <p v-if="type == 'detail'" class="unit-detail">{{ formInline.advancePlan }}</p>
          <el-input
            v-if="type !== 'detail'"
            type="textarea"
            autosize
            v-model="formInline.advancePlan"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-textarea-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item class="fullWidth" label="需求资源和支持">
          <p v-if="type == 'detail'" class="unit-detail">{{ formInline.needSupport }}</p>
          <el-input
            v-if="type !== 'detail'"
            type="textarea"
            autosize
            v-model="formInline.needSupport"
            :clearable="type == 'detail' ? false : true"
            :disabled="type == 'detail' ? true : false"
            :class="[type == 'detail' ? 'input-textarea-detail' : '']"
          ></el-input>
        </el-form-item>
        <el-form-item class="fullWidth" label="拜访内容" prop="visitContent">
          <p v-if="type == 'detail'" class="unit-detail">{{ formInline.visitContent }}</p>
          <el-input
            v-if="type !== 'detail'"
            type="textarea"
            v-model="formInline.visitContent"
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
  getCustomerInfoByName,
  createCustomerVisit,
  editCustomerVisit,
  getVisitById,
} from '@/api/customer/visit'
import { editCustomerVisitPlan } from '@/api/customer/visitPlanList'

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
        customerId: '',
        customerName: '',
        customerArea: '',
        brandName: '',
        salesman: '',
        visitPeople: '',
        post: '',
        contactInfo: '',
        visitPurpose: '',
        visitTime: '',
        visitEndTime: '',
        expansionStrategy: '',
        advancePlan: '',
        needSupport: '',
        visitContent: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
      },
      planVisit: {}, //计划列表跳转数据
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
    /**
     * type==addPlanVisit时，是从计划列表确认拜访跳转过来的
     */
    this.type = this.$route.query.type
    if (this.$route.query.planVisit) {
      this.planVisit = JSON.parse(this.$route.query.planVisit)
      this.formInline = Object.assign(this.formInline, this.planVisit)
      this.formInline.visitPeople = this.planVisit.visitObject
      this.formInline.post = this.planVisit.position
    }
    if (this.id) {
      this.getData()
    } else {
      this.formInline.salesman = this.name
    }

    const obj = Object.assign({}, this.$route, {
      title: `拜访记录(${this.editState})`,
    })
    if (this.type == 'detail') {
      obj.title = '拜访记录(详情)'
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
        const obj = { path: '/customer/visitList' }
        this.$tab.closeOpenPage(obj)
        return
      }
      getVisitById(this.id).then((res) => {
        const {
          customerId,
          customerName,
          customerArea,
          brandName,
          salesman,
          visitObject,
          position,
          contactInformation,
          visitTarget,
          visitTime,
          visitEndTime,
          strategy,
          advancePlan,
          resourceSupport,
          visitContent,
        } = res.data

        this.formInline = {
          customerId,
          customerName,
          customerArea,
          brandName,
          salesman,
          visitPeople: visitObject,
          post: position,
          contactInfo: contactInformation,
          visitPurpose: visitTarget,
          visitTime,
          visitEndTime,
          expansionStrategy: strategy,
          advancePlan,
          needSupport: resourceSupport,
          visitContent,
        }
        this.datePickerTime[0] = this.formInline.visitTime
        this.datePickerTime[1] = this.formInline.visitEndTime
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
      console.log(picker)
      if (picker) {
        let startDay = picker[0].slice(0, 10)
        let endDay = picker[1].slice(0, 10)
        if (startDay !== endDay) {
          this.$message.error('拜访时间必须是同一天哦')
          this.datePickerTime = ''
        } else {
          this.formInline.visitTime = picker[0]
          this.formInline.visitEndTime = picker[1]
          if (picker[1].slice(11, 19) == '00:00:00') {
            this.formInline.visitEndTime = endDay + ' 23:59:59'
            this.datePickerTime[1] = this.formInline.visitEndTime
            this.$set(this.datePickerTime)
          }
        }
      }
    },
    submit() {
      const {
        customerId,
        customerName,
        customerArea,
        brandName,
        salesman,
        visitPeople: visitObject,
        post: position,
        contactInfo: contactInformation,
        visitPurpose: visitTarget,
        visitTime,
        visitEndTime,
        expansionStrategy: strategy,
        advancePlan,
        needSupport: resourceSupport,
        visitContent,
      } = this.formInline
      const data = {
        customerId,
        customerName,
        customerArea,
        brandName,
        salesman,
        visitObject,
        position,
        contactInformation,
        visitTarget,
        visitTime,
        visitEndTime,
        strategy,
        advancePlan,
        resourceSupport,
        visitContent,
      }
      if (this.id) {
        data.id = Number(this.id)
        editCustomerVisit(data).then((res) => {
          this.$message({
            message: '提交成功',
            type: 'success',
          })

          this.cancel()
        })
      } else {
        createCustomerVisit(data).then((res) => {
          if (this.type == 'addPlanVisit') {
            editCustomerVisitPlan(this.planVisit).then((res) => {
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
          }

          this.cancel()
        })
      }
    },
    cancel() {
      const obj = { path: '/customer/visitList' }
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
</style>
