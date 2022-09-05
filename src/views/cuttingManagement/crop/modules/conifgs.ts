/*
 * @Author: lyj
 * @Date: 2022-09-03 14:07:30
 * @LastEditTime: 2022-09-04 17:55:50
 * @Description:
 * @LastEditors: lyj
 */
//---------------content-----------------
export const content: any = {
  formData: {
    styleImage: '',
    styleCode: '',
    styleName: '',
    shelfFile: '',
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
    { name: '生产订单', model: 'produceOrderCode', prop: 'produceOrderCode', type: null, disabled: false },
    { name: '床次计划号', model: 'customName', prop: null, type: null, disabled: false },
    { name: '面料编号', model: 'fabricCode', prop: null, type: null, disabled: false },
    { name: '面料颜色', model: 'fabricColor', prop: 'fabricColor', type: null, disabled: false },
    { name: '唛架门幅', model: 'shelfWidth', prop: 'shelfWidth', type: null, disabled: false },
    { name: '设备编号', model: 'spreadClothLevel', prop: 'spreadClothLevel', type: 'spreadClothLevel', disabled: false },
    { name: '计划开始', model: 'levelClothSum', prop: null, type: null, disabled: true }
  ],
  formRightData: [
    { name: '款式床次号', model: 'bedPlanNo', prop: null, type: null, disabled: true },
    { name: '贴标任务号', model: 'styleBedNo', prop: 'styleBedNo', type: null, disabled: true },
    { name: '面料名称', model: 'fabricName', prop: 'fabricName', type: null, disabled: false },
    { name: '唛架长度', model: 'shelfLength', prop: 'shelfLength', type: null, disabled: false },
    { name: '铺布长度', model: 'spreadClothLength', prop: null, type: null, disabled: false },
    { name: '设备名称', model: 'shelfList', prop: 'shelfList', type: null, disabled: false },
    { name: '计划结束', model: 'attritionRate', prop: 'attritionRate', type: null, disabled: true }
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

export const tableColumns = [
  {
    title: '铺布设备编号',
    align: 'center',
    dataIndex: 'externalProduceOrderNum',
    width: 200
  },
  {
    title: '铺布设备名称',
    align: 'center',
    dataIndex: 'factoryName',
    width: 200
  },
  {
    title: '贴标设备编号',
    align: 'center',
    dataIndex: 'shopName',
    width: 200
  },
  {
    title: '贴标设备名称',
    align: 'center',
    dataIndex: 'teamName',
    width: 200
  },
  {
    title: '裁床设备编号',
    align: 'center',
    dataIndex: 'productName',
    width: 250
  },
  {
    title: '裁床设备名称',
    align: 'center',
    dataIndex: 'productNum',
    width: 200
  }
]
