<!-- 新增自建产品 -->
<template>
  <div class="app-container">
    <el-form
      class="base-form"
      :model="baseInfo"
      :rules="rules"
      ref="baseInfoForm"
      :inline="true"
      label-width="90px"
      :label-position="labelPosition"
    >
      <el-form-item label="参考布号" prop="cankaobuhao">
        <el-input
          style="width: 210px"
          v-model="baseInfo.cankaobuhao"
          placeholder="请输入参考布号"
        ></el-input>
      </el-form-item>

      <el-form-item label="布类" prop="bulei" required>
        <el-select v-model="baseInfo.bulei" placeholder="请选择" style="width: 210px">
          <!-- <el-option
            v-for="(dict, index) in dict.type.customer_area"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="织机规模" prop="zhijiguimo" required>
        <el-select v-model="baseInfo.zhijiguimo" placeholder="请选择" style="width: 210px">
          <!-- <el-option
            v-for="(dict, index) in dict.type.customer_area"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option> -->
        </el-select>
      </el-form-item>
      <template>
        <el-form-item label="克重" prop="kezhong" required>
          <template>
            <el-input
              v-model.number="baseInfo.kezhong"
              placeholder="请输入克重"
              style="width: 210px"
            >
              <template slot="append">g</template>
            </el-input>
          </template>
        </el-form-item>
      </template>
      <template>
        <el-form-item label="幅宽" prop="fukuan" required>
          <template>
            <el-input
              v-model.number="baseInfo.fukuan"
              placeholder="请输入幅宽"
              style="width: 210px"
            >
              <template slot="append">g/m<sup>2</sup></template>
            </el-input>
          </template>
        </el-form-item>
      </template>
      <el-form-item label="成分" prop="chengfen" required>
        <div @click="componentDialogVisible = true">
          <el-input
            readonly
            v-model="baseInfo.chengfen"
            placeholder="请输入成分"
            style="width: 210px"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="特殊工艺" prop="teshugongyi">
        <el-input
          v-model="baseInfo.teshugongyi"
          placeholder="请输入特殊工艺"
          style="width: 210px"
        ></el-input>
      </el-form-item>
      <el-form-item label="功能性承诺" prop="function">
        <el-input
          v-model="baseInfo.function"
          placeholder="请输入功能性承诺"
          style="width: 210px"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹窗 -->
    <el-dialog
      title="成分比例选择（%）"
      :visible.sync="componentDialogVisible"
      width="904px"
      :before-close="handleClose"
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
      <el-form
        class="dialog-form"
        :model="baseInfo"
        :rules="rules"
        ref="baseInfoForm"
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
                  {{ item.label }}
                </div>
                <div class="check-title" :style="item.input ? 'color:#0052D9' : ''">
                  ({{ item.english }})
                </div>
              </div>
              <el-input v-model="item.input" class="check-input" size="mini"></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <!-- <div style="margin-bottom: 50px">
        <div class="check-item" v-for="(item, index) in componentList" :key="index">
          <div style="display: flex; margin-left: 12px">
            <div
              class="check-title"
              :style="item.input ? 'color:#0052D9' : ''"
              style="margin-right: 10px"
            >
              {{ item.label }}
            </div>
            <div class="check-title" :style="item.input ? 'color:#0052D9' : ''">
              ({{ item.english }})
            </div>
          </div>
          <el-input v-model="item.input" class="check-input" size="mini"></el-input>
        </div>
      </div> -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div> -->
      <div class="bottom_btn">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="resetQuery">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      componentList: [
        {
          label: '棉',
          value: '1',
          input: '',
          english: 'mulberry silk',
        },
        {
          label: '竹纤维',
          value: '2',
          input: '',
          english: 'mulberry silk',
        },
        {
          label: '莫代尔',
          value: '3',
          input: '',
          english: 'mulberry silk',
        },
        {
          label: '聚烯烃',
          value: '4',
          input: '',
          english: 'mulberry silk',
        },
        {
          label: ' EKS',
          value: '5',
          input: '',
        },
        {
          label: '涤纶',
          value: '6',
          input: '',
        },
        {
          label: '麻',
          value: '7',
          input: '',
        },
        {
          label: '羊绒',
          value: '8',
          input: '',
        },
        {
          label: '竹代尔',
          value: '9',
          input: '',
        },
        {
          label: '铜氨',
          value: '10',
          input: '',
        },
        {
          label: '聚乳酸',
          value: '11',
          input: '',
        },
        {
          label: '大豆纤维',
          value: '12',
          input: '',
        },
        {
          label: '尼龙',
          value: '13',
          input: '',
        },
        {
          label: '醋酸',
          value: '14',
          input: '',
        },
        {
          label: '氨纶',
          value: '15',
          input: '',
        },
        {
          label: '腈纶',
          value: '16',
          input: '',
        },
        {
          label: '野蚕丝',
          value: '17',
          input: '',
        },
        {
          label: '乙纶',
          value: '18',
          input: '',
        },
        {
          label: '天丝',
          value: '19',
          input: '',
        },
        {
          label: '桑蚕丝',
          value: '20',
          input: '',
        },
        {
          label: '丙纶',
          value: '21',
          input: '',
        },
        {
          label: '羊毛',
          value: '22',
          input: '',
        },
        {
          label: '粘胶',
          value: '23',
          input: '',
        },
        {
          label: '桑巴拿',
          value: '24',
          input: '',
        },
      ],
      componentDialogVisible: false,
      labelPosition: 'right',
      baseInfo: {
        buhao: '', //参考布号
        bulei: '', //布类
        zhijiguimo: '', //织机规模
        kezhong: '', //克重
        fukuan: '', //幅宽
        chengfen: '', //成分
        teshugongyi: '', // 特殊工艺
        function: '', // 功能性承诺
      },
    }
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {
    // 确定
    resetQuery(done) {
      this.componentList.forEach((i) => {
        const item = i
        if (item.input) {
          text += `${item.label}(${item.input}%);`
        }
      })
      this.salesmanFormInfo.component = text
      done()
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
::v-deep .dialog-form .el-form--inline .el-form-item {
  margin-right: 0px;
}
::v-deep .dialog-form .el-form-item {
  margin-bottom: 0px;
}
</style>
