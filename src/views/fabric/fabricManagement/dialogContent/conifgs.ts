/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-24 15:48:52
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

  fabricNo: '1',
  fabricType: '2',
  antipattern: '1',
  looseCloth: '2',
  preshrink: '1',
  fabricColor: '6',
  layingParameters: '7',
  fabricName: '11',
  fabricWeight: '22',
  preshrinkTime: '33',
  shrinkCloth: '44',
  cuttingMachine: '1'
}

export const formMiddleData = [
  { name: '面料编号', model: formData.fabricNo, prop: 'fabricNo', type: 'fabricNo', disabled: false },
  { name: '面料类型', model: formData.fabricType, prop: 'fabricType', type: 'fabricType', disabled: false },
  { name: '需要对纹', model: formData.antipattern, prop: 'antipattern', type: 'antipattern', disabled: false },
  { name: '需要松布', model: formData.looseCloth, prop: 'looseCloth', type: 'looseCloth', disabled: false },
  { name: '需要预缩', model: formData.preshrink, prop: 'preshrink', type: 'preshrink', disabled: false },
  { name: '铺布参数模板', model: formData.layingParameters, prop: null, type: 'layingParameters', disabled: false },
  { name: '面料颜色', model: formData.fabricColor, prop: null, type: 'fabricColor', disabled: false }
]
export const formRightData = [
  { name: '面料名称', model: formData.fabricName, prop: 'fabricName', type: 'fabricName', disabled: true },
  { name: '面料克重', model: formData.fabricWeight, prop: null, type: null, disabled: true, append: 'g/m²' },
  { name: '预缩时间', model: formData.preshrinkTime, prop: null, type: null, disabled: false, append: 'h' },
  { name: '缩布时间', model: formData.shrinkCloth, prop: null, type: null, disabled: false, append: 'h' },
  { name: '裁床参数模板', model: formData.cuttingMachine, prop: null, type: 'cuttingMachine', disabled: false }
]
export const dataRule = {
  fabricNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  antipattern: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  looseCloth: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  preshrink: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
