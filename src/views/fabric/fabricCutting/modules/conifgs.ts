/*
 * @Author: lyj
 * @Date: 2022-09-04 16:20:33
 * @LastEditTime: 2022-09-21 08:54:17
 * @Description:
 * @LastEditors: lyj
 */
export const content: any = {
  formData: {
    img: '',
    templateNumber: '',
    templateName: '',
    type: '',
    fabricWeight: {
      left: '',
      right: ''
    },
    relatedFabric: '',
    fabric: '',
    right: [],
    levelParamVOList: [
      {
        cutTemplateParam: {
          minLevel: 1,
          maxLevel: 10,
          minKnifeFrequency: 0,
          maxKnifeFrequency: 0,
          knifeSpeed: '',
          knifeAngle: '',
          minKnifeDistance: '',
          emptyRatio: '',
          crawlSpeed: '',
          crawlDistance: '',
          angle: '',
          accelerationWeight: '',

          cutSpeed: 0,
          cutLength: 0,
          remark: ''
        },
        title: '1-10层'
      }
    ]
  },
  dataRule: {
    sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    templateNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    templateName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricWeight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}
export const customFormData = {
  formData: {
    minKnifeFrequency: '1',
    uniformTension: '',
    slowDown: '',
    creepSpeed: '',
    targetAngle: '',
    reverseSpeed: '',
    acceleration: '',
    creeping: '',
    distance: '',
    accelerationWeight: ''
  },
  formMiddleData: [
    { name: '最小层数', model: 'minLevel', prop: 'minLevel', type: 'minLevel', disabled: false, max: 'maxLevel' },
    { name: '最小刀频', model: 'minKnifeFrequency', prop: 'minKnifeFrequency', type: null, disabled: false, title: 'U/min' },
    { name: '刀速', model: 'knifeSpeed', prop: 'knifeSpeed', type: null, disabled: false, title: 'm/min' },
    { name: '最小磨刀距离', model: 'minKnifeDistance', prop: 'minKnifeDistance', type: null, disabled: false, title: 'mm' }
  ],
  formRightData: [
    { name: '最大层数', model: 'maxLevel', prop: 'maxLevel', type: 'maxLevel', min: 'minLevel' },
    { name: '最大刀频', model: 'maxKnifeFrequency', prop: 'maxKnifeFrequency', type: null, disabled: false, title: 'U/min' },
    { name: '提刀角度', model: 'knifeAngle', prop: 'knifeAngle', type: null, disabled: false, title: '°' },
    { name: '真空率', model: 'emptyRatio', prop: 'emptyRatio', type: null, disabled: false, title: '%' }
  ],
  dataRule: {
    equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}

export const customTableData = {
  tableData: [
    {
      date: '布斗匀速',
      one: '',
      two: '',
      three: '',
      four: '',
      five: '',
      six: '',
      seven: '',
      eight: '',
      nine: '',
      ten: ''
    },
    {
      date: '布斗加速',
      one: '',
      two: '',
      three: '',
      four: '',
      five: '',
      six: '',
      seven: '',
      eight: '',
      nine: '',
      ten: ''
    },
    {
      date: '布斗减速',
      one: '',
      two: '',
      three: '',
      four: '',
      five: '',
      six: '',
      seven: '',
      eight: '',
      nine: '',
      ten: ''
    }
  ],
  tableMiddleData: [
    { name: '1', model: 'one' },
    { name: '2', model: 'two' },
    { name: '3', model: 'three' },
    { name: '4', model: 'four' },
    { name: '5', model: 'five' },
    { name: '6', model: 'six' },
    { name: '7', model: 'seven' },
    { name: '8', model: 'eight' },
    { name: '9', model: 'nine' },
    { name: '10', model: 'ten' }
  ]
}
