/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-30 15:51:00
 * @Description:
 * @LastEditors: lyj
 */

// img格式
//  img: [
//     {
//       fileName: 'file.name',
//       doc: 'data.src',
//       url: 'http://localhost:9000/assets/dsrlogonav.20af6bbe.png',
//       name: 'file.name'
//     }
//   ],

export const formData: any = {
  img: [
    {
      fileName: 'file.name',
      doc: 'data.src',
      url: 'http://localhost:9000/assets/dsrlogonav.20af6bbe.png',
      name: 'file.name'
    }
  ],
  sn: '',
  name: '',
  relationDevice: '',
  spec: '',
  type: '',
  remark: '',
  defaultParam: ''
}

export const formMiddleData = [
  { name: '设备编号', model: 'sn', prop: 'sn', type: 'sn', disabled: false },
  { name: '设备名称', model: 'name', prop: 'name', type: 'name', disabled: false },
  { name: '关联设备', model: 'relationDevice', prop: null, type: 'relationDevice', disabled: false }
]
export const formRightData = [
  { name: '设备型号', model: 'spec', prop: 'spec', type: 'spec', disabled: false },
  { name: '设备类型', model: 'type', prop: 'type', type: 'type', disabled: false },
  { name: '备注', model: 'remark', prop: null, type: 'remarks', disabled: false }
]
export const dataRule = {
  sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  spec: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
