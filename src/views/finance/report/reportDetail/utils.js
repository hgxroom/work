/**
 * 客户信息表单验证规则
 */
export const formRules = {
  //客户名称
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
  ],
  //客户区域
  referenceClothNo: {
    required: true,
    message: '请输入布号',
    trigger: 'change',
  },
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
  'customer_state', // 状态
]
