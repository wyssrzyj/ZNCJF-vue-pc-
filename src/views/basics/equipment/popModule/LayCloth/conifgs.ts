/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-30 15:06:27
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
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
}

export const formMiddleData = [
  { name: '前进速度', model: formData.forwardSpeed, prop: 'forwardSpeed', type: 'forwardSpeed', disabled: false },
  { name: '匀速松紧值', model: formData.uniformTightness, prop: 'uniformTightness', type: 'uniformTightness', disabled: false },
  { name: '减速松紧值', model: formData.reduceTightness, prop: 'reduceTightness', type: 'reduceTightness', disabled: false },
  { name: '爬行速度', model: formData.crawlSpeed, prop: 'crawlSpeed', type: 'crawlSpeed', disabled: false },
  { name: '布斗目标角度', model: formData.angle, prop: 'angle', type: 'angle', disabled: false },
  { name: '切布段速', model: formData.cutSpeed, prop: 'cutSpeed', type: 'cutSpeed', disabled: false }
]
export const formRightData = [
  { name: '后退速度', model: formData.backSpeed, prop: 'backSpeed', type: 'backSpeed', disabled: false },
  { name: '加速松紧值', model: formData.accelerationTightness, prop: 'accelerationTightness', type: 'accelerationTightness', disabled: false },
  { name: '爬行松紧值', model: formData.crawlTightness, prop: 'crawlTightness', type: 'crawlTightness', disabled: false },
  { name: '爬行距离', model: formData.crawlDistance, prop: 'crawlDistance', type: 'crawlDistance', disabled: false },
  { name: '加速权重', model: formData.accelerationWeight, prop: 'accelerationWeight', type: 'accelerationWeight', disabled: false },
  { name: '切布长度', model: formData.cutLength, prop: 'cutLength', type: 'cutLength', disabled: false }
]

export const dataRule = {
  equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
export const data = [
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
