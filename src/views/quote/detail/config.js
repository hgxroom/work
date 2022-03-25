/**
 * 业务-表单值
 */
export const salesmanFormInfo = {
  id: null,
  status: null, //申请单状态

  applyNo: '', //申请单号
  salesman: '', //业务员
  deptId: '', //部门id
  deptName: '', //部门名称
  createTime: '', //创建时间
  customerName: '', //客户名称
  quotedType: '', //报价类型

  clothNo: '', //布号

  clothCategory: '', //面料类型
  loomSpecifications: '', //织机规格
  testLoss: [], //测损
  widthCloth: '', //幅宽
  gramWeight: '', //克重
  specialProcedure: '', //特殊工序整理
  component: '', //纤维成分占比

  productPurpose: '', //成品用途
  ecologyCapacity: '', //建议生态产能
  yarnSpecifications: '', //已知纱线规格、纱线品名、纱线占比
  recommendSupplierQuoted: '', //推荐纱线供应商及大致报价
  specialQualityRequirements: '', //特殊品质要求
  remark: '', //备注

  enclosureAddr: '', //附件地址,
  reiterateReason: '', //重申理由
  rejectReason: '', //驳回理由
}
/**
 * 业务-表单配置
 */
export const salesmanFieldList = [
  // 基础共用
  { label: '申请单号', value: 'applyNo', type: 'input', disabled: true },
  { label: '业务员', value: 'salesman', type: 'input', disabled: true },
  { label: '部门', value: 'deptName', type: 'input', disabled: true },
  {
    label: '创建时间',
    value: 'createTime',
    type: 'input',
    disabled: true,
  },
  {
    label: '客户名称',
    value: 'customerName',
    type: 'input',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '报价类型',
    value: 'quotedType',
    type: 'select',
    list: 'quote_quote_type',
    disabled: (form) => {
      return ![null, 0].includes(form.status)
    },
  },
  // 有布号
  {
    label: '布号',
    value: 'clothNo',
    type: 'input',
    show: (form) => {
      return form.quotedType == '0'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  // 有来样/啥都没
  {
    label: '面料类别',
    value: 'clothCategory',
    type: 'select',
    list: 'fabric_type',
    filterable: true,
    show: (form) => {
      // 两种写法都可以，但是运行逻辑不同
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '织机规格',
    value: 'loomSpecifications',
    type: 'select',
    list: 'loom_specifications',
    filterable: true,
    show: (form) => {
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  // {
  //   label: '测损',
  //   value: 'testLoss',
  //   type: 'select',
  //   multiple: true,
  //   list: 'quote_loss_measurement',
  //   show: (form) => {
  //     return form.quotedType === '1' || form.quotedType === '2'
  //   },
  //   disabled: (form) => {
  //     const canEdit = [null, 0, 3, 5].includes(form.status)
  //     return !canEdit
  //   },
  // },
  {
    label: '幅宽',
    value: 'widthCloth',
    type: 'input',
    show: (form) => {
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '克重',
    value: 'gramWeight',
    type: 'input',
    show: (form) => {
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '特殊工序整理',
    value: 'specialProcedure',
    type: 'input',
    show: (form) => {
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '纤维成分占比',
    value: 'component',
    type: 'slot',
    show: (form) => {
      return form.quotedType === '1' || form.quotedType === '2'
    },
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },

  //基础共用
  {
    label: '成品用途',
    value: 'productPurpose',
    type: 'input',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '建议生态产能',
    value: 'ecologyCapacity',
    type: 'input',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '已知纱线规格，纱线品名，纱线占比',
    value: 'yarnSpecifications',
    type: 'textarea',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '推荐纱线供应商及大致报价',
    value: 'recommendSupplierQuoted',
    type: 'input',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '特殊品质要求',
    value: 'specialQualityRequirements',
    type: 'input',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '备注',
    value: 'remark',
    type: 'textarea',
    disabled: (form) => {
      const canEdit = [null, 0, 3, 5].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '重申理由',
    value: 'reiterateReason',
    type: 'textarea',

    placeholder: '重申理由，由业务员重申时填写',
    show: (form) => {
      //重申时可见
      const canRead = [6].includes(form.status)
      return canRead
    },
    disabled: true,
  },
  {
    label: '驳回理由',
    value: 'rejectReason',
    type: 'textarea',
    placeholder: '驳回理由，由驳回时填写',
    show: (form) => {
      //被驳回时可见
      const canRead = [3, 5].includes(form.status)
      return canRead
    },
    disabled: true,
  },

  //其他
  {
    label: '附件地址',
    value: 'enclosureAddr',
    type: 'slot',
    className: 'upload-row',
  },
]

/**
 * 开发-表单值
 */
export const developerFormInfo = {
  yarnCountNum: '', //纱支
  gramWeight: '', //克重
  doorWidth: '', //门幅
  loom: '', //织机
  mixtureRatio: '', //配比
  accuracy: '', //准确度
  referenceOpinions: '', //参考意见
}
/**
 * 开发-表单配置
 */
export const developerFieldList = [
  {
    label: '纱支',
    value: 'yarnCountNum',
    type: 'textarea',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '克重',
    value: 'gramWeight',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '门幅',
    value: 'doorWidth',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '织机',
    value: 'loom',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '配比',
    value: 'mixtureRatio',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '准确度',
    value: 'accuracy',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '参考意见',
    value: 'referenceOpinions',
    type: 'textarea',
    disabled: (form) => {
      const canEdit = [1].includes(form.status)
      return !canEdit
    },
  },
]

/**
 * 报价-表单值
 */
export const quoteFormInfo = {
  whitePrice: '', //白色价格
  lightColourPrice: '', //浅色价格
  mediumColorPrice: '', //中色价格
  darkPrice: '', //深色价格
  extraDarkPrice: '', //特深价格
  colorSpinningPrice: '', //色纺纱价格
  printingPrice: '', //印花价格
  referenceClothNo: '', //参考布号
  grossProfitMargin: '', //毛利率,单位：%
  fabricInfo: '', //面料基本信息
  remark: '', //备注
}
/**
 * 报价-表单配置
 */
export const quoteFieldList = [
  {
    label: '白色价格',
    value: 'whitePrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '浅色价格',
    value: 'lightColourPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '中色价格',
    value: 'mediumColorPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '深色价格',
    value: 'darkPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '特深价格',
    value: 'extraDarkPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '色纺纱价格',
    value: 'colorSpinningPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '印花价格',
    value: 'printingPrice',
    type: 'input',
    append: '元 / kg',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '参考布号',
    value: 'referenceClothNo',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '毛利率',
    value: 'grossProfitMargin',
    type: 'input',
    append: '%',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '面料基本信息',
    value: 'fabricInfo',
    type: 'input',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
  {
    label: '备注',
    value: 'remark',
    type: 'textarea',
    disabled: (form) => {
      const canEdit = [1, 2, 6].includes(form.status)
      return !canEdit
    },
  },
]

/**
 * 表单校验规则配置
 */
export const formRules = {
  customerName: [
    {
      required: true,
      message: '客户名称必填',
      trigger: 'change',
    },
  ],
  quotedType: [
    {
      required: true,
      message: '报价类型必填',
      trigger: 'change',
    },
  ],
  clothCategory: [
    {
      required: true,
      message: '面料类别必填',
      trigger: 'change',
    },
  ],
  clothNo: [
    {
      required: true,
      message: '布号必填',
      trigger: 'change',
    },
  ],
  loomSpecifications: [
    {
      required: true,
      message: '织机规格必填',
      trigger: 'change',
    },
  ],
  widthCloth: [
    {
      required: true,
      message: '幅宽必填',
      trigger: 'change',
    },
  ],
  gramWeight: [
    {
      required: true,
      message: '克重必填',
      trigger: 'change',
    },
  ],
  component: [
    {
      required: true,
      message: '纤维成分占比必填',
      trigger: 'change',
    },
  ],
  yarnSpecifications: [
    {
      required: true,
      message: '已知纱线规格、纱线品名、纱线占比必填',
      trigger: 'change',
    },
  ],
  grossProfitMargin: [
    {
      required: true,
      message: '毛利率必填',
      trigger: 'change',
    },
    {},
  ],
  whitePrice: [
    {
      tarigger: 'change',
      message: '请输入数字',
      validator: validatorNumber,
    },
  ],
  lightColourPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  mediumColorPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  darkPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  extraDarkPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  colorSpinningPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  printingPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
}

function validatorNumber(rule, value, callback) {
  if (value && !/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}

export const componentList = [
  {
    label: '棉',
    value: '1',
    input: '',
  },
  {
    label: '竹纤维',
    value: '2',
    input: '',
  },
  {
    label: '莫代尔',
    value: '3',
    input: '',
  },
  {
    label: '聚烯烃',
    value: '4',
    input: '',
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
]
