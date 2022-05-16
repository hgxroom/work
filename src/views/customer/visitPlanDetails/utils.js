/**
 * 客户信息表单验证规则
 */
export const formRules = {
  //业务员
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  //客户区域
  customerArea: {
    required: true,
    message: '请输入客户区域',
    trigger: 'blur',
  },
  //品牌名称
  brandName: [
    {
      required: true,
      message: '请输入品牌名称',
      trigger: 'change',
    },
  ],
  //拜访对象
  visitObject: [
    {
      required: true,
      message: '请输入拜访对象',
      trigger: 'blur',
    },
  ],
  // 拜访目的
  titleName: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
  //职位
  position: {
    required: true,
    message: '职位必填',
    trigger: 'blur',
  },
  //联系方式
  contactInfo: {
    required: true,
    message: '联系方式必填',
    trigger: 'blur',
  },
  //拜访时间
  planStartTime: {
    required: true,
    message: '拜访时间必填',
    trigger: 'blur',
  },
  //拜访内容
  objectivePlan: [
    {
      required: true,
      message: '拜访内容必填',
      trigger: 'blur',
    },
    {
      min: 20,
      message: '最少20字',
      trigger: 'change',
    },
  ],
}

/**
 * 映射字典类型
 */
export const dictMap = [
  'customer_area', //客户区域
  'customer_brand_stratification', //品牌分层
  'customer_crowd_circle', //人群圈层
  'customer_operation_mna', //运营模式和能力
  'customer_time_rhythm', //时间节奏
  'customer_cooperate_model', //合作模式
  'customer_business_goals', //生意目标
  'customer_category_coverage', //覆盖品类
  'customer_cooperation_intention', //合作意向
  'customer_sales_channel', //销售渠道
]
