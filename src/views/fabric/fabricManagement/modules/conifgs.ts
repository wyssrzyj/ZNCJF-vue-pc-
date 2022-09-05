/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-09-04 14:27:28
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
  img: [
    {
      fileName: 'file.name',
      doc: 'data.src',
      url: 'http://localhost:9000/assets/dsrlogonav.20af6bbe.png',
      name: 'file.name'
    }
  ],
  attachmentList: [],

  sn: '',
  type: '',
  alignLineFlag: '',
  looseClothFlag: '1',
  shrinkFlag: '1',
  color: '',
  spreadTemplateId: '',
  name: '',
  weight: '',
  shrinkHours: '',
  looseClothHours: '',
  cutTemplateId: ''
}

export const formMiddleData = [
  { name: '面料编号', model: 'sn', prop: 'sn', type: 'sn', disabled: false },
  { name: '面料类型', model: 'type', prop: 'type', type: 'type', disabled: false },
  // { name: '需要对纹', model: 'alignLineFlag', prop: 'alignLineFlag', type: 'alignLineFlag', disabled: false },
  { name: '需要松布', model: 'looseClothFlag', prop: 'looseClothFlag', type: 'looseClothFlag', disabled: false },
  { name: '需要预缩', model: 'shrinkFlag', prop: 'shrinkFlag', type: 'shrinkFlag', disabled: false },
  { name: '铺布参数模板', model: 'spreadTemplateId', prop: null, type: 'spreadTemplateId', disabled: false },
  { name: '面料颜色', model: 'color', prop: null, type: 'color', disabled: false }
]
export const formRightData = [
  { name: '面料名称', model: 'name', prop: 'name', type: 'name', disabled: false },
  { name: '面料克重', model: 'weight', prop: null, type: null, disabled: true, append: 'g/m²' },
  { name: '预缩时间', model: 'shrinkHours', prop: null, type: null, disabled: false, append: 'h' },
  { name: '松布时间', model: 'looseClothHours', prop: null, type: null, disabled: false, append: 'h' },
  { name: '裁床参数模板', model: 'cutTemplateId', prop: null, type: 'cutTemplateId', disabled: false }
]
export const dataRule = {
  sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  alignLineFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  looseClothFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  shrinkFlag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
