<!--  -->
<template>
  <div>
    123
    <!-- <el-autocomplete
      v-model="modelVal"
      :fetch-suggestions="queryNme"
      placeholder="请输入参考布号"
      @select="handleSelect"
      style="width: 100%"
    >
      <template slot-scope="{ item }">
        <div>{{ item.clothNo }}</div>
      </template> </el-autocomplete
    >> -->
  </div>
</template>

<script>
import {
  buildProduct,
  getDictList,
  getFabricQuotationByBh,
  getTableDataInfoToAble,
  getFunctionalCommitmentByName,
  getRawYarnInfoList,
} from '@/api/finance/report'
export default {
  props: {
    type: String,
    modelVal: String,
    keyItem: String,
    placeholderText: String,
  },
  data() {
    return {}
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    queryNme() {
      console.log(queryString, cb)
      if (queryString === '') {
        cb([])
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getFabricQuotationByBh(queryString).then((res) => {
          cb(res.data)
        })
      }, 700)
    },
    //选择参考布号
    handleSelectReferenceClothNo(item) {
      modelVal = item.clothNo
    },
  },
}
</script>
<style lang="scss" scoped></style>
