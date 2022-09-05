//---------------content-----------------
export const content: any = {
  formData: {
    img: '',
    sn: '',
    name: '',
    relationDevice: '',
    spec: '',
    type: '',
    remark: '',
    defaultParam: ''
  },
  formMiddleData: [
    { name: '设备编号', model: 'sn', prop: 'sn', type: 'sn', disabled: false },
    { name: '设备名称', model: 'name', prop: 'name', type: 'name', disabled: false },
    { name: '关联设备', model: 'relationDevice', prop: null, type: 'relationDevice', disabled: false }
  ],
  formRightData: [
    { name: '设备型号', model: 'spec', prop: 'spec', type: 'spec', disabled: false },
    { name: '设备类型', model: 'type', prop: 'type', type: 'type', disabled: false },
    { name: '备注', model: 'remark', prop: null, type: 'remark', disabled: false }
  ],
  dataRule: {
    sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    spec: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
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
//-----------------------layCloth---------------------
export const layCloth = {
  formData: {
    forwardSpeed: '',
    uniformTightness: '',
    reduceTightness: '',
    crawlSpeed: '',
    angle: '',
    cutSpeed: '',
    backSpeed: '',
    accelerationTightness: '',
    crawlTightness: '',
    crawlDistance: '',
    accelerationWeight: '',
    cutLength: ''
  },
  formMiddleData: [
    { name: '前进速度', model: 'forwardSpeed', prop: 'forwardSpeed', type: 'forwardSpeed', disabled: false },
    { name: '匀速松紧值', model: 'uniformTightness', prop: 'uniformTightness', type: 'uniformTightness', disabled: false },
    { name: '减速松紧值', model: 'reduceTightness', prop: 'reduceTightness', type: 'reduceTightness', disabled: false },
    { name: '爬行速度', model: 'crawlSpeed', prop: 'crawlSpeed', type: 'crawlSpeed', disabled: false },
    { name: '布斗目标角度', model: 'angle', prop: 'angle', type: 'angle', disabled: false },
    { name: '切布段速', model: 'cutSpeed', prop: 'cutSpeed', type: 'cutSpeed', disabled: false }
  ],
  formRightData: [
    { name: '后退速度', model: 'backSpeed', prop: 'backSpeed', type: 'backSpeed', disabled: false },
    { name: '加速松紧值', model: 'accelerationTightness', prop: 'accelerationTightness', type: 'accelerationTightness', disabled: false },
    { name: '爬行松紧值', model: 'crawlTightness', prop: 'crawlTightness', type: 'crawlTightness', disabled: false },
    { name: '爬行距离', model: 'crawlDistance', prop: 'crawlDistance', type: 'crawlDistance', disabled: false },
    { name: '加速权重', model: 'accelerationWeight', prop: 'accelerationWeight', type: 'accelerationWeight', disabled: false },
    { name: '切布长度', model: 'cutLength', prop: 'cutLength', type: 'cutLength', disabled: false }
  ],
  dataRule: {
    equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  },
  data: [
    { name: '前进速度', value: 'forwardSpeed' },
    { name: '匀速松紧值', value: 'uniformTightness' },
    { name: '减速松紧值', value: 'reduceTightness' },
    { name: '爬行速度', value: 'crawlSpeed' },
    { name: '布斗目标角度', value: 'angle' },
    { name: '切布段速', value: 'cutSpeed' },
    { name: '后退速度', value: 'backSpeed' },
    { name: '加速松紧值', value: 'accelerationTightness' },
    { name: '爬行松紧值', value: 'crawlTightness' },
    { name: '爬行距离', value: 'crawlDistance' },
    { name: '加速权重', value: 'accelerationWeight' },
    { name: '切布长度', value: 'cutLength' }
  ]
}
