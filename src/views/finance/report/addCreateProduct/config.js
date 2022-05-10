/**
 * 表单校验规则配置
 */
export const formRules = {
  bulei: [
    {
      required: true,
      message: '请输入布类',
      trigger: 'change,blur',
    },
  ],
  zhijiguimo: [
    {
      required: true,
      message: '请输入织机规模',
      trigger: 'change',
    },
  ],
  kezhong: [
    {
      required: true,
      message: '请输入克重',
      trigger: ['change', 'bule'],
      validator: validatorNumber,
    },
  ],
  fukuan: [
    {
      required: true,
      message: '请输入幅宽',
      trigger: 'change',
    },
  ],
  chengfen: [
    {
      required: true,
      message: '请输入成分',
      trigger: 'change',
      validator: validatorNumber,
    },
  ],
  // teshugongyi: [
  //   {
  //     required: true,
  //     message: '幅宽必填',
  //     trigger: 'change',
  //   },
  // ],
  // function: [
  //   {
  //     required: true,
  //     message: '克重必填',
  //     trigger: 'change',
  //   },
  // ],

  // lightColourPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  // mediumColorPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  // darkPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  // extraDarkPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  // colorSpinningPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
  // printingPrice: [{ tarigger: 'change', message: '请输入数字', validator: validatorNumber }],
}
export const formRules2 = {
  szpm: [
    {
      required: true,
      message: '',
      trigger: 'change',
    },
  ],
  szbh: [
    {
      required: true,
      message: '',
      trigger: 'change',
    },
  ],
  bl: [
    {
      required: true,
      message: '请输入成分',
      trigger: 'change',
      validator: validatorNumber,
    },
  ],
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
