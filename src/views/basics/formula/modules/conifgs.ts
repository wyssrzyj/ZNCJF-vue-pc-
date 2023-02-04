/*
 * @Author: lyj
 * @Date: 2022-09-05 10:01:25
 * @LastEditTime: 2023-02-01 08:45:37
 * @Description:
 * @LastEditors: lyj
 */
// 导出
export const exportData = [
  {
    prop: 'image',
    label: '设备图片',
    type: 'img',
    required: false
  },
  {
    prop: 'sn',
    label: '设备编号',
    type: null,
    required: true
  },
  {
    prop: 'spec',
    label: '设备型号',
    type: null,
    required: true
  },
  {
    prop: 'name',
    label: '设备名称',
    type: null,
    required: true
  },
  {
    prop: 'type',
    label: '设备类型',
    type: 'type',
    required: true
  }
]
//---------------content-----------------
export const content = {
  formData: {
    img: '',
    sn: '',
    name: '',
    relationDevice: '',
    spec: '',
    type: '',
    remark: '',
    defaultParam: '',
    ip: '',
    port: '',
    relationOperaterList: ''
  },
  formMiddleData: [
    { name: '公式名称', model: 'sn', prop: 'sn', type: 'input', disabled: false },
    { name: '计算类型', model: 'relationDevice', prop: null, type: 'relationDevice', disabled: false },
  ],
  formRightData: [
    { name: '公式编码', model: 'spec', prop: 'spec', type: 'input', disabled: true },
    { name: '适用设备', model: 'type', prop: 'type', type: 'type', disabled: false },
  ],
  dataRule: {
    sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    relationDevice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }

}
//公式参数
export const parameters = [
      {
      name:'e',value:"",
    },
      {
      name:'A',value:"",
    },
      {
      name:'h',value:"",
    },
      {
      name:'g',value:"",
    },
      {
      name:'f',value:"",
    },
      {
      name:'k',value:"",
    },
    {
      name:'s',value:"",
    },
  ]
