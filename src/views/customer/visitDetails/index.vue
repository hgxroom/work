<template>
  <div class="app-container">
    <el-form
      class="visitForm"
      :model="formInline"
      :inline="true"
      :label-position="'top'"
      :rules="rules"
    >
      <el-form-item label="客户名称" prop="customerName">
        <!-- 搜索框 -->
        <el-autocomplete
          v-model="formInline.customerName"
          :fetch-suggestions="queryName"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div>{{ item.customerName }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="客户区域" prop="customerArea">
        <el-input v-model="formInline.customerArea" disabled></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="brandName">
        <el-select v-model="formInline.brandName" placeholder="请选择">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.brandName"
            :value="item.brandName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-input v-model="formInline.salesman" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="拜访对象" prop="visitPeople">
        <el-input v-model="formInline.visitPeople"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="post">
        <el-input v-model="formInline.post"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInfo">
        <el-input v-model="formInline.contactInfo"></el-input>
      </el-form-item>
      <el-form-item label="拜访目的">
        <el-select v-model="formInline.visitPurpose" placeholder="请选择">
          <el-option
            v-for="(dict, index) in dict.type.customer_visit_purpose"
            :key="index"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拜访时间" prop="visitTime">
        <el-date-picker
          v-model="formInline.visitTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
          @change="pickTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fullWidth" label="拓客策略">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.expansionStrategy"
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="推进计划">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.advancePlan"
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="需求资源和支持">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.needSupport"
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="拜访内容" prop="visitContent">
        <el-input type="textarea" v-model="formInline.visitContent"></el-input>
      </el-form-item>
      <el-form-item class="btn-group">
        <el-button @click="cancel">取消</el-button>
        <el-button
          type="primary"
          @click="submit"
          v-hasPermi="['customer:visit:edit']"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getCustomerInfoByName,
  createCustomerVisit,
  editCustomerVisit,
  getVisitById,
} from "@/api/customer/visit";
import { formRules } from "./utils";
export default {
  dicts: ["customer_visit_purpose"],
  data() {
    return {
      rules: Object.freeze(formRules),
      brandList: [],
      queryTimeout: null,
      //表单信息
      formInline: {
        customerId: "",
        customerName: "",
        customerArea: "",
        brandName: "",
        salesman: "",
        visitPeople: "",
        post: "",
        contactInfo: "",
        visitPurpose: "",
        visitTime: "",
        expansionStrategy: "",
        advancePlan: "",
        needSupport: "",
        visitContent: "",
      },
    };
  },
  computed: {
    ...mapGetters(["name"]),
    editState: function () {
      const id = this.$route.params.id;
      return id ? "编辑" : "新增";
    },
    id: function () {
      const id = this.$route.params.id;
      return id ? id : "";
    },
  },

  created() {
    if (this.id) {
      this.getData();
    } else {
      this.formInline.salesman = this.name;
    }

    const obj = Object.assign({}, this.$route, {
      title: `拜访详情(${this.editState})`,
    });
    this.$tab.updatePage(obj);
  },
  methods: {
    getData() {
      if (!this.id) {
        this.$message({
          message: "当前的拜访ID不存在，退回列表页",
          type: "error",
        });
        const obj = { path: "/customer/visitList" };
        this.$tab.closeOpenPage(obj);
        return;
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
          strategy,
          advancePlan,
          resourceSupport,
          visitContent,
        } = res.data;

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
          expansionStrategy: strategy,
          advancePlan,
          needSupport: resourceSupport,
          visitContent,
        };
      });
    },
    /**
     * 输入客户名搜索
     * @param {string} queryString
     * @param {*} cb
     */
    queryName(queryString, cb) {
      console.log(queryString === "");
      if (queryString === "") {
        cb([]);
        return;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        getCustomerInfoByName(queryString).then((res) => {
          cb(res.data);
        });
      }, 700);
    },
    /**
     * 点选客户名称事件
     * @param {*} item 选择的客户名称
     */
    handleSelect(item) {
      console.log(item);
      this.formInline.customerId = item.id;
      this.formInline.customerName = item.customerName;
      this.formInline.customerArea = item.customerArea;
      this.brandList = item.brandList;
    },

    pickTime(picker) {
      const nowTime = new Date().getTime();
      const pickTime = new Date(picker).getTime();
      if (nowTime < pickTime) {
        this.formInline.visitTime = "";
      }
      console.log("选择时间大于当前时间");
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
        expansionStrategy: strategy,
        advancePlan,
        needSupport: resourceSupport,
        visitContent,
      } = this.formInline;
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
        strategy,
        advancePlan,
        resourceSupport,
        visitContent,
      };
      if (this.id) {
        data.id = Number(this.id);
        editCustomerVisit(data).then((res) => {
          this.$message({
            message: "提交成功",
            type: "success",
          });

          this.cancel();
        });
      } else {
        createCustomerVisit(data).then((res) => {
          this.$message({
            message: "提交成功",
            type: "success",
          });

          this.cancel();
        });
      }
    },
    cancel() {
      const obj = { path: "/customer/visitList" };
      this.$tab.closeOpenPage(obj);
    },
  },
};
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
  }
  .btn-group {
    margin: auto;
    display: flex;
    justify-content: center;
  }
}
</style>
