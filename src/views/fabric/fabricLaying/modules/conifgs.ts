/*
 * @Author: lyj
 * @Date: 2022-09-04 16:20:33
 * @LastEditTime: 2022-11-03 11:19:09
 * @Description:
 * @LastEditors: lyj
 */
export const content: any = {
  formData: {
    img: '',
    sn: '',
    name: '',
    fabricType: '',
    templateNumber: '',
    templateName: '',
    type: '',
    fabricWeight: {
      left: 0,
      right: 0
    },
    relatedFabric: '',
    fabric: '',
    right: [],

    levelParamVOList: [
      {
        spreadTemplateParam: {
          minLevel: 1,
          maxLevel: 10,
          forwardSpeed: 0,
          backSpeed: 0,
          uniformTightness: '',
          accelerationTightness: '',
          reduceTightness: '',
          crawlTightness: '',
          crawlSpeed: '',
          crawlDistance: '',
          angle: '',
          accelerationWeight: '',
          uniform: '0,0,0,0,0,0,0,0,0,0',
          acceleration: '0,0,0,0,0,0,0,0,0,0',
          reduce: '0,0,0,0,0,0,0,0,0,0',
          cutSpeed: 0,
          cutLength: 0,
          remark: '',
          bottomTable: [
            {
              date: '布斗匀速',
              one: 0,
              two: 0,
              three: 0,
              four: 0,
              five: 0,
              six: 0,
              seven: 0,
              eight: 0,
              nine: 0,
              ten: 0
            },
            {
              date: '布斗加速',
              one: 0,
              two: 0,
              three: 0,
              four: 0,
              five: 0,
              six: 0,
              seven: 0,
              eight: 0,
              nine: 0,
              ten: 0
            },
            {
              date: '布斗减速',
              one: 0,
              two: 0,
              three: 0,
              four: 0,
              five: 0,
              six: 0,
              seven: 0,
              eight: 0,
              nine: 0,
              ten: 0
            }
          ]
        },
        lyjyyds: 'init', //用于判断
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
    forwardSpeed: '1',
    uniformTension: '',
    relationFabricList: null,
    slowDown: '',
    creepSpeed: '',
    targetAngle: '',
    reverseSpeed: '',
    acceleration: '',
    creeping: '',
    distance: '',
    accelerationWeight: '',
    file: [],
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
    { name: '最小层数', model: 'minLevel', prop: 'minLevel', type: 'minLevel', disabled: false, max: 'maxLevel', company: '' },
    { name: '参数文件', model: 'file', prop: 'file', type: 'file', disabled: false },
    { name: '前进速度', model: 'forwardSpeed', prop: 'forwardSpeed', type: null, disabled: false, company: '(段)' },
    { name: '匀速松紧值', model: 'uniformTightness', prop: 'uniformTightness', type: null, disabled: false, company: '' },
    { name: '减速松紧值', model: 'reduceTightness', prop: 'reduceTightness', type: null, disabled: false, company: '' },
    { name: '爬行速度', model: 'crawlSpeed', prop: 'crawlSpeed', type: null, disabled: false, company: '(mm/s)' }
    // { name: '布斗目标角度', model: 'angle', prop: 'angle', type: "angle", disabled: false }//暂时隐藏 2022-10-13 10.20
  ],
  formRightData: [
    { name: '最大层数', model: 'maxLevel', prop: 'maxLevel', type: 'maxLevel', min: 'minLevel', company: '' },
    { name: '后退速度', model: 'backSpeed', prop: 'backSpeed', type: null, disabled: false, company: '(段)' },
    { name: '加速松紧值', model: 'accelerationTightness', prop: 'accelerationTightness', type: null, disabled: false, company: '' },
    { name: '爬行松紧值', model: 'crawlTightness', prop: 'crawlTightness', type: null, disabled: false, company: '' },
    { name: '爬行距离', model: 'crawlDistance', prop: 'crawlDistance', type: null, disabled: false, company: '(mm)' }
    // { name: '加速权重', model: 'accelerationWeight', prop: 'accelerationWeight', type: null, disabled: false }//暂时隐藏 2022-10-13 10.20
  ],
  dataRule: {
    file: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
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
