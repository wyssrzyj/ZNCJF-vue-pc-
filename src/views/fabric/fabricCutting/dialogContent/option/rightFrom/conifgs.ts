/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-27 13:36:14
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
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
}

export const formMiddleData = [
  { name: '最小层数', model: 'minLevel', prop: 'minLevel', type: 'minLevel', disabled: false, max: 'maxLevel', append: null },
  { name: '最小刀频', model: 'forwardSpeed', prop: 'forwardSpeed', type: null, disabled: false, append: 'U/min' },
  { name: '刀速', model: 'uniformTightness', prop: 'uniformTightness', type: null, disabled: false, append: 'U/min' },
  { name: '最小磨刀距离', model: 'reduceTightness', prop: 'reduceTightness', type: null, disabled: false, append: 'mm' }
  // { name: '爬行速度', model: 'crawlSpeed', prop: 'crawlSpeed', type: null, disabled: false },
  // { name: '布斗目标角度', model: 'angle', prop: 'angle', type: null, disabled: false }
]
export const formRightData = [
  { name: '最大层数', model: 'maxLevel', prop: 'maxLevel', type: 'maxLevel', min: 'minLevel', append: null },
  { name: '最大刀频', model: 'backSpeed', prop: 'backSpeed', type: null, disabled: false, append: 'U/min' },
  { name: '提刀角度', model: 'crawlTightness', prop: 'crawlTightness', type: null, disabled: false, append: '°' },
  { name: '真空率', model: 'crawlDistance', prop: 'crawlDistance', type: null, disabled: false, append: '%' }
]
export const dataRule = {
  equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
