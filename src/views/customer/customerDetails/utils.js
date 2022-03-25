/**
 * 客户信息表单验证规则
 */
export const formRules = {
  //客户名称
  customerName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "change" },
  ],
  //客户区域
  customerArea: {
    required: true,
    message: "请输入客户区域",
    trigger: "change",
  },
  //品牌名称
  brandName: [
    {
      required: true,
      message: "请输入品牌名称",
      trigger: "blur",
    },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "change" },
  ],
  //营收规模
  revenueScale: [
    {
      required: true,
      message: "请输入营收规模",
      trigger: "blur",
    },
  ],
  //品牌分层
  brandGrade: {
    required: true,
    message: "品牌分层必选",
    trigger: "change",
  },
  //联系人
  contacts: {
    required: true,
    message: "联系人必填",
    trigger: "blur",
  },
  //职位
  position: {
    required: true,
    message: "联系人职位必填",
    trigger: "blur",
  },
  //联系方式
  contactInformation: [
    {
      required: true,
      message: "联系方式必填",
      trigger: "blur",
    },
  ],
  //运营模式和能力
  operationModeAbility: {
    required: true,
    message: "运营模式和能力必选",
    trigger: "change",
  },
  decisionLink: [{ min: 1, max: 20, message: "最多20字", trigger: "change" }],
  //合作模式
  cooperationMode: {
    required: true,
    message: "合作模式必选",
    trigger: "change",
  },
  //生意目标
  businessTarget: {
    required: true,
    message: "生意目标必选",
    trigger: "change",
  },
  //品牌占比
  brandProportion: [],
  //合作意向
  cooperationIntention: {
    required: true,
    message: "合作意向必选",
    trigger: "change",
  },
  //销售渠道
  distributionChannelList: {
    type: "array",
    required: true,
    message: "请至少选择一个销售渠道",
    trigger: "change",
  },
};

/**
 * 客户信息字段模板
 */
export const brandInfoTemp = {
  // id: "", //主键id

  brandName: "", //品牌名称
  revenueScale: "", //营收规模，单位：万元
  brandGrade: "", //品牌分层

  contacts: "", //联系人
  position: "", //职位
  contactInformation: "", //联系方式

  crowdCircle: [], //人群圈层
  operationModeAbility: "", //运营模式和能力
  timeRhythm: "", //时间节奏（取数据字典label）

  decisionLink: "", //决策链路
  cooperationMode: [], //合作模式
  businessTarget: "", //生意目标

  brandProportion: "", //品牌占比
  cooperationIntention: "", //合作意向
  distributionChannelList: [], //销售渠道

  categoryList: [], //覆盖品类及价格带
  supplierList: [], //供应商结构，id集合，逗号（英文）分割
};

/**
 * 映射字典类型
 */
export const dictMap = [
  "customer_area", //客户区域
  "customer_brand_stratification", //品牌分层
  "customer_crowd_circle", //人群圈层
  "customer_operation_mna", //运营模式和能力
  "customer_time_rhythm", //时间节奏
  "customer_cooperate_model", //合作模式
  "customer_business_goals", //生意目标
  "customer_category_coverage", //覆盖品类
  "customer_cooperation_intention", //合作意向
  "customer_sales_channel", //销售渠道
];
