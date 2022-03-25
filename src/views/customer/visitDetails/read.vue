<template>
  <div class="app-container">
    <el-form
      class="visitForm"
      :model="formInline"
      :inline="true"
      :label-position="'top'"
    >
      <el-form-item label="客户名称">
        <el-input v-model="formInline.customerName" readonly></el-input>
      </el-form-item>
      <el-form-item label="客户区域">
        <el-input v-model="formInline.customerArea" readonly></el-input>
      </el-form-item>
      <el-form-item label="品牌名称">
        <el-input v-model="formInline.brandName" readonly></el-input>
      </el-form-item>
      <el-form-item label="业务员">
        <el-input v-model="formInline.salesman" readonly></el-input>
      </el-form-item>
      <el-form-item label="拜访对象">
        <el-input v-model="formInline.visitPeople" readonly></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="formInline.post" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="formInline.contactInfo" readonly></el-input>
      </el-form-item>
      <el-form-item label="拜访目的">
        <el-input v-model="formInline.visitPurpose" readonly></el-input>
      </el-form-item>
      <el-form-item label="拜访时间">
        <el-input v-model="formInline.visitTime" readonly></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="拓客策略">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.expansionStrategy"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="推进计划">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.advancePlan"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="需求资源和支持">
        <el-input
          type="textarea"
          autosize
          v-model="formInline.needSupport"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item class="fullWidth" label="拜访内容">
        <el-input
          type="textarea"
          v-model="formInline.visitContent"
          readonly
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getVisitById } from "@/api/customer/visit";
export default {
  data() {
    return {
      //表单信息
      formInline: {
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
    id: function () {
      const id = this.$route.params.id;
      return id ? id : "";
    },
  },
  created() {
    this.getData();
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
