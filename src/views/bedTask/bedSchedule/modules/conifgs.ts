/*
 * @Author: lyj
 * @Date: 2022-09-03 14:07:30
 * @LastEditTime: 2022-09-03 14:18:46
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
    bedSum: 0,

    bedPlanNo: null,
    styleBedNo: null,
    fabricName: '',
    shelfLength: 0,
    spreadClothLength: 0,
    shelfList: '',
    attritionRate: 0,
    remark: ''
  },
  formMiddleData: [
    { name: '生产订单', model: 'produceOrderCode', prop: 'produceOrderCode', type: 'produceOrderCode', disabled: false },
    { name: '客户名称', model: 'customName', prop: null, type: null, disabled: false },
    { name: '面料编号', model: 'fabricCode', prop: null, type: null, disabled: false },
    { name: '面料颜色', model: 'fabricColor', prop: 'fabricColor', type: 'fabricColor', disabled: false },
    { name: '唛架门幅', model: 'shelfWidth', prop: 'shelfWidth', type: 'shelfWidth', disabled: false },
    { name: '铺布层数', model: 'spreadClothLevel', prop: 'spreadClothLevel', type: 'spreadClothLevel', disabled: false },
    { name: '单层件数', model: 'levelClothSum', prop: null, type: null, disabled: true },
    { name: '床次总件数', model: 'bedSum', prop: null, type: null, disabled: true }
  ],
  formRightData: [
    { name: '床次计划号', model: 'bedPlanNo', prop: null, type: null, disabled: true },
    { name: '款式床次号', model: 'styleBedNo', prop: 'styleBedNo', type: 'styleBedNo', disabled: true },
    { name: '面料名称', model: 'fabricName', prop: 'fabricName', type: 'fabricName', disabled: false },
    { name: '唛架长度', model: 'shelfLength', prop: 'shelfLength', type: 'shelfLength', disabled: false },
    { name: '铺布长度', model: 'spreadClothLength', prop: 'spreadClothLength', type: 'spreadClothLength', disabled: false },
    { name: '排唛比例', model: 'shelfList', prop: 'shelfList', type: 'shelfList', disabled: false },
    { name: '利用率(%)', model: 'attritionRate', prop: 'attritionRate', type: 'attritionRate', disabled: true },
    { name: '备注', model: 'remark', prop: null, type: null }
  ],
  dataRule: {
    produceOrderCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricColor: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    shelfWidth: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    spreadClothLevel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    shelfLength: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    spreadClothLength: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    shelfList: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    styleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    shelfFile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
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
