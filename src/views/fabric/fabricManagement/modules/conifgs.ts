/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-10-13 14:17:14
 * @Description:
 * @LastEditors: lyj
 */
// 导出

export const exportData = [
  {
    prop: 'image',
    label: '面料图片',
    type: 'img',
    required: false
  },
  {
    prop: 'sn',
    label: '面料编号',
    type: null,
    required: true
  },
  {
    prop: 'name',
    label: '面料名称',
    type: null,
    required: true
  },
  {
    prop: 'type',
    label: '面料类型',
    type: 'type',
    required: true
  },
    {
    prop: 'primaryFlag',
    label: '主/辅料',
    type: 'primaryFlag',
    required: true
  },
  {
    prop: 'weight',
    label: '面料克重',
    type: null,
    required: false
  },
  {
    prop: 'color',
    label: '面料颜色',
    type: null,
    required: false
  }
]

export const formData = {
  img: '',
  attachmentList: [],
  sn: '',
  type: '',
  alignLineFlag: '',
  looseClothFlag: 1,
  shrinkFlag: 1,
  color: '',
  spreadTemplateId: '',
  name: '',
  weight: '',
  shrinkHours: '',
  looseClothHours: '',
  cutTemplateId: '',
  primaryFlag:1,
}

export const formMiddleData = [
  { name: '面料编号', model: 'sn', prop: 'sn', type: 'sn', disabled: false },
  { name: '面料类型', model: 'type', prop: 'type', type: 'type', disabled: false },
  // { name: '需要对纹', model: 'alignLineFlag', prop: 'alignLineFlag', type: 'alignLineFlag', disabled: false },
  // { name: '需要松布', model: 'looseClothFlag', prop: 'looseClothFlag', type: 'looseClothFlag', disabled: false },
  // { name: '需要预缩', model: 'shrinkFlag', prop: 'shrinkFlag', type: 'shrinkFlag', disabled: false },
  { name: '铺布参数模板', model: 'spreadTemplateId', prop: "spreadTemplateId", type: 'spreadTemplateId', disabled: false },
  { name: '主/辅料', model: 'primaryFlag', prop: 'primaryFlag', type: 'primaryFlag', disabled: false },

]
export const formRightData = [
  { name: '面料名称', model: 'name', prop: 'name', type: 'name', disabled: false },
  { name: '面料克重', model: 'weight', prop: 'weight', type: null, disabled: false, append: 'g/m²' },
  // { name: '预缩时间', model: 'shrinkHours', prop: 'shrinkHours', type: null, disabled: false, append: 'h' },
  // { name: '松布时间', model: 'looseClothHours', prop: 'looseClothHours', type: null, disabled: false, append: 'h' },
  { name: '裁床参数模板', model: 'cutTemplateId', prop: 'cutTemplateId', type: 'cutTemplateId', disabled: false },
  { name: '面料颜色', model: 'color', prop: null, type: 'color', disabled: false }

]
export const dataRule = {
  sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  alignLineFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  looseClothFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shrinkFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  primaryFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
