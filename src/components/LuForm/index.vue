<template>
  <div>
    <el-form
      ref="form"
      class="lu-form"
      :class="className"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-form-item
        v-for="(item, index) in getShowList()"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        :class="item.className"
        :rules="item.rules"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <!-- slot -->
        <template v-if="item.type === 'slot'">
          <slot :name="'form-' + item.value" />
        </template>

        <!-- 普通输入框 -->
        <el-input
          v-else-if="item.type === 'input' || item.type === 'password'"
          v-model="formData[item.value]"
          :type="item.type"
          :disabled="item.disabled"
          :clearable="item.clearable"
          :placeholder="getPlaceholder(item)"
          :size="item.size"
          @change="handleEvent(item.event)"
        >
          <!-- 前置文本 -->
          <template #prepend v-if="item.prepend">{{ item.prepend }}</template>
          <!-- 后置文本 -->
          <template #append v-if="item.append">{{ item.append }}</template>
        </el-input>

        <!-- 文本输入框 -->
        <el-input
          v-else-if="item.type === 'textarea'"
          v-model="formData[item.value]"
          :type="item.type"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          :size="item.size"
          autosize
          @focus="handleEvent(item.event)"
        >
        </el-input>

        <!-- 计数器 -->
        <el-input-number
          v-else-if="item.type === 'inputNumber'"
          v-model="formData[item.value]"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          :size="item.size"
          @change="handleEvent(item.event)"
        ></el-input-number>

        <!-- 选择框 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.value]"
          :disabled="item.disabled"
          :multiple="item.multiple"
          :filterable="item.filterable"
          :placeholder="getPlaceholder(item)"
          :size="item.size"
          @change="handleEvent(item.event, formData[item.value])"
        >
          <el-option
            v-for="(optionItem, optionIndex) in listTypeInfo[item.list]"
            :key="optionIndex"
            :label="optionItem.label"
            :value="optionItem.value"
          >
          </el-option>
        </el-select>

        <!-- 日期选择框 -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.value]"
          :type="item.dateType"
          :picker-options="item.TimePickerOptions"
          :value-format="item.format || 'yyyy-MM-dd'"
          :clearable="item.clearable"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          :size="item.size"
          @focus="handleEvent(item.event)"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'LuForm',
  props: {
    //类名
    className: {
      type: String,
      default: '',
    },
    // 表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 相关字段
    fieldList: {
      type: Array,
      default: () => {
        return []
      },
    },
    //验证规则
    rules: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 下拉选项数据
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '90px',
    },
    // ref
    refObj: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    formData: {
      handler() {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true, // 深度监听
    },
  },
  methods: {
    // 获取显示的字段
    getShowList() {
      let showList = []
      showList = this.fieldList
        .map((item) => {
          return this.computeFormItem(item, this.formData)
        })
        .filter((item) => {
          const isShow = !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)
          return isShow
        })

      return showList
    },
    /**
     * 返回空值提示
     * @param {object} row 当前项数据
     */
    getPlaceholder(row) {
      const inputMap = ['input', 'password', 'inputNumber', 'textarea']
      const selectMap = ['select', 'time', 'date']

      if (row.placeholder) {
        return row.placeholder
      }
      let placeholder = ''
      if (inputMap.includes(row.type)) {
        placeholder = `请输入${row.label}`
      } else if (selectMap.includes(row.type)) {
        placeholder = `请选择${row.label}`
      } else {
        placeholder = `${row.label}`
      }
      return placeholder
    },
    /**
     * 计算配置
     * @param {object} config fieldList的子项
     * @param {object} form formData
     */
    computeFormItem(config, form) {
      // 返回结构体
      const item = { ...config }
      // 条件渲染
      if (typeof item.show === 'function') {
        item.show = item.show(form)
      }
      // 如果disabled函数计算
      if (typeof item.disabled === 'function') {
        item.disabled = item.disabled(form)
      }

      // 处理后的 form-item 配置
      return item
    },
    /**
     * 绑定的相关事件
     */
    handleEvent(event) {
      this.$emit('handleEvent', event)
    },
    /**
     * 派发按钮点击事件
     */
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    },
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
}
</script>
<style lang="scss" scoped></style>
