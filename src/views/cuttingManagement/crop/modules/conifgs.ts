/*
 * @Author: lyj
 * @Date: 2022-09-03 14:07:30
 * @LastEditTime: 2023-02-27 16:13:04
 * @Description:
 * @LastEditors: lyj
 */
//---------------content-----------------
export const content: any = {
  formData: {
    styleImage: [],
    styleCode: '',
    styleName: '',
    shelfFile: [],
    attachmentList: [],

    produceOrderCode: '',
    customName: '',
    fabricCode: '',
    fabricColor: '',
    shelfWidth: 0,
    spreadClothLevel: '',
    levelClothSum: 0,
    planStartTime: '',

    bedSum: 0,

    bedPlanNo: null,
    styleBedNo: null,
    fabricName: '',
    shelfLength: 0,
    spreadClothLength: 0,
    shelfList: '',
    attritionRate: 0,
    planEndTime: 0,

    remark: ''
  },
  formLeftData: [
    { name: '生产订单', model: 'produceOrderCode', prop: null, type: null, disabled: true },
    { name: '床次计划号', model: 'bedPlanNo', prop: null, type: null, disabled: true },
    { name: '床次', model: 'styleBedNo', prop: null, type: null, disabled: true },
    { name: '裁剪任务号', model: 'styleBedNo', prop: null, type: null, disabled: true },
    { name: '计划开始', model: 'planStartTime', prop: null, type: 'time', disabled: false }

  ],

  formMiddleData: [
    { name: '面料编号', model: 'fabricCode', prop: null, type: null, disabled: true },
    { name: '面料颜色', model: 'fabricColor', prop: null, type: null, disabled: true },
    { name: '唛架门幅', model: 'shelfWidth', prop: null, type: 'number', disabled: true },
    { name: '资源编号', model: 'resourceSn', prop: 'resourceSn', type: 'resourceSn', disabled: true, append: '设置' },
    { name: '计划结束', model: 'planEndTime', prop: null, type: 'time', disabled: false }

  ],
  formRightData: [
    { name: '面料名称', model: 'fabricName', prop: null, type: null, disabled: true },
    { name: '唛架长度', model: 'shelfLength', prop: null, type: 'number', disabled: true },
    { name: '铺布长度', model: 'spreadClothLength', prop: null, type: 'number', disabled: true },
    { name: '资源名称', model: 'resourceName', prop: null, type: null, disabled: true },
  ],
  dataRule: {
    resourceSn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}

//-----------------------formsTable---------------------
export const formsTable = {
  tableColumns: [
    {
      title: '颜色',
      align: 'center',
      dataIndex: 'color',
      width: 200
    },
    {
      title: '尺码',
      align: 'center',
      dataIndex: 'size',
      width: 200
    },
    {
      title: '单间层数',
      align: 'center',
      dataIndex: 'levelClothSum',
      width: 200
    },
    {
      title: '铺布层数',
      align: 'center',
      dataIndex: 'spreadClothLevel',
      width: 200
    },
    {
      title: '床次总件数',
      align: 'center',
      dataIndex: 'total',
      width: 250
    }
  ]
}

//-----------------------crop---------------------
export const crop = [
  { name: '最小磨刀频率', value: 'minKnifeFrequency' },
  { name: '刀速', value: 'knifeSpeed' },
  { name: '最小磨刀距离', value: 'minKnifeDistance' },

  { name: '刀频', value: 'maxKnifeFrequency' },
  { name: '提刀角度', value: 'knifeAngle' },
  { name: '真空率', value: 'emptyRatio' }
]
