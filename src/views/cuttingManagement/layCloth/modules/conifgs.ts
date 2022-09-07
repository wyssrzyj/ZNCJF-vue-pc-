/*
 * @Author: lyj
 * @Date: 2022-09-04 16:20:33
 * @LastEditTime: 2022-09-04 16:37:08
 * @Description:
 * @LastEditors: lyj
 */
export const content: any = {
  formData: {
    img: [{}],
    templateNumber: '',
    templateName: '',
    fabricType: '',
    fabricWeight: '',
    relatedFabric: '',
    fabric: '',
    right: []
  },
  dataRule: {
    templateNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    templateName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    fabricWeight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}
export const customFormData = {
  formData: {
    forwardSpeed: '1',
    uniformTension: '',
    slowDown: '',
    creepSpeed: '',
    targetAngle: '',
    reverseSpeed: '',
    acceleration: '',
    creeping: '',
    distance: '',
    accelerationWeight: '',
    bottomTable: [
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
    ]
  },
  formMiddleData: [
    { name: '最小层数', model: 'minLevel', prop: 'minLevel', type: 'minLevel', disabled: false, max: 'maxLevel' },
    { name: '前进速度', model: 'forwardSpeed', prop: 'forwardSpeed', type: null, disabled: false },
    { name: '匀速松紧值', model: 'uniformTightness', prop: 'uniformTightness', type: null, disabled: false },
    { name: '减速松紧值', model: 'reduceTightness', prop: 'reduceTightness', type: null, disabled: false },
    { name: '爬行速度', model: 'crawlSpeed', prop: 'crawlSpeed', type: null, disabled: false },
    { name: '布斗目标角度', model: 'angle', prop: 'angle', type: null, disabled: false }
  ],
  formRightData: [
    { name: '最大层数', model: 'maxLevel', prop: 'maxLevel', type: 'maxLevel', min: 'minLevel' },
    { name: '后退速度', model: 'backSpeed', prop: 'backSpeed', type: null, disabled: false },
    { name: '加速松紧值', model: 'accelerationTightness', prop: 'accelerationTightness', type: null, disabled: false },
    { name: '爬行松紧值', model: 'crawlTightness', prop: 'crawlTightness', type: null, disabled: false },
    { name: '爬行距离', model: 'crawlDistance', prop: 'crawlDistance', type: null, disabled: false },
    { name: '加速权重', model: 'accelerationWeight', prop: 'accelerationWeight', type: null, disabled: false }
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
      one: '0',
      two: '0',
      three: '0',
      four: '0',
      five: '0',
      six: '0',
      seven: '0',
      eight: '0',
      nine: '0',
      ten: '10'
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
