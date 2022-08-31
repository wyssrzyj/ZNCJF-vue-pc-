/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-31 12:50:30
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
  styleImage: [
    {
      fileName: 'file.name',
      doc: 'data.src',
      url: 'http://localhost:9000/assets/dsrlogonav.20af6bbe.png',
      name: 'file.name'
    }
  ],
  styleCode: '款式编号',
  styleName: '款式名称',
  shelfFile: [],
  attachmentList: [],

  produceOrderCode: '生产订单',
  customName: '客户名称',
  fabricCode: '面料编号',
  fabricColor: '面料颜色',
  shelfWidth: '唛架门幅',
  spreadClothLevel: '铺布层数',
  levelClothSum: '单层件数',
  bedSum: '床次总件数',

  bedPlanNo: '床次计划号',
  styleBedNo: '款式床次号',
  fabricName: '面料名称',
  shelfLength: '唛架长度',
  spreadClothLength: '铺布长度',
  shelfIdList: '排唛比例',
  attritionRate: '损耗率',
  remark: '备注'
}

export const formMiddleData = [
  { name: '生产订单', model: formData.produceOrderCode, prop: 'produceOrderCode', type: 'produceOrderCode', disabled: false },
  { name: '客户名称', model: formData.customName, prop: null, type: null, disabled: false },
  { name: '面料编号', model: formData.fabricCode, prop: null, type: null, disabled: false },
  { name: '面料颜色', model: formData.fabricColor, prop: 'fabricColor', type: 'fabricColor', disabled: false },
  { name: '唛架门幅', model: formData.shelfWidth, prop: 'shelfWidth', type: 'shelfWidth', disabled: false },
  { name: '铺布层数', model: formData.spreadClothLevel, prop: 'spreadClothLevel', type: 'spreadClothLevel', disabled: false },
  { name: '单层件数', model: formData.levelClothSum, prop: null, type: null, disabled: true },
  { name: '床次总件数', model: formData.bedSum, prop: null, type: null, disabled: true }
]
export const formRightData = [
  { name: '床次计划号', model: formData.bedPlanNo, prop: null, type: null, disabled: true },
  { name: '款式床次号', model: formData.styleBedNo, prop: 'styleBedNo', type: 'styleBedNo', disabled: true },
  { name: '面料名称', model: formData.fabricName, prop: 'fabricName', type: 'fabricName', disabled: false },
  { name: '唛架长度', model: formData.shelfLength, prop: 'shelfLength', type: 'shelfLength', disabled: false },
  { name: '铺布长度', model: formData.spreadClothLength, prop: 'spreadClothLength', type: 'spreadClothLength', disabled: false },
  { name: '排唛比例', model: formData.shelfIdList, prop: 'shelfIdList', type: 'shelfIdList', disabled: false },
  { name: '损耗率(%)', model: formData.attritionRate, prop: null, type: null, disabled: true },
  { name: '备注', model: formData.remark, prop: null, type: null }
]
export const dataRule = {
  produceOrderCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricColor: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shelfWidth: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  spreadClothLevel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  styleBedNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shelfLength: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  spreadClothLength: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shelfIdList: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  styleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shelfFile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
