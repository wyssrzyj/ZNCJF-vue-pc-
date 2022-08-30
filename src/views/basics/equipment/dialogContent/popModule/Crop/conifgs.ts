/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-23 18:27:16
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
  forwardSpeed: '',
  uniformTension: '',
  slowDown: '',
  creepSpeed: '',
  targetAngle: '',
  reverseSpeed: '',
  acceleration: '',
  creeping: '',
  distance: '',
  accelerationWeight: ''
}

export const formMiddleData = [
  { name: '前进速度', model: formData.forwardSpeed, prop: 'forwardSpeed', type: 'forwardSpeed', disabled: false },
  { name: '匀速松紧值', model: formData.uniformTension, prop: 'uniformTension', type: 'uniformTension', disabled: false },
  { name: '减速松紧值', model: formData.slowDown, prop: 'slowDown', type: 'slowDown', disabled: false },
  { name: '爬行速度', model: formData.creepSpeed, prop: 'creepSpeed', type: 'creepSpeed', disabled: false },
  { name: '布斗目标角度', model: formData.targetAngle, prop: 'targetAngle', type: 'targetAngle', disabled: false }
]
export const formRightData = [
  { name: '后退速度', model: formData.reverseSpeed, prop: 'reverseSpeed', type: 'reverseSpeed', disabled: false },
  { name: '加速松紧值', model: formData.acceleration, prop: 'acceleration', type: 'acceleration', disabled: false },
  { name: '爬行松紧值', model: formData.creeping, prop: 'creeping', type: 'creeping', disabled: false },
  { name: '爬行距离', model: formData.distance, prop: 'distance', type: 'distance', disabled: false },
  { name: '加速权重', model: formData.accelerationWeight, prop: 'accelerationWeight', type: 'accelerationWeight', disabled: false }
]
export const dataRule = {
  equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
