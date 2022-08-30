/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-24 10:46:56
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
  proportions: {},
  equipmentNumber: '1',
  equipmentName: '2',
  associatedEquipment: '3',
  equipmentModel: '4',
  equipmentType: '3',
  remarks: '6'
}

export const formMiddleData = [
  { name: '设备编号', model: formData.equipmentNumber, prop: 'equipmentNumber', type: 'equipmentNumber', disabled: false },
  { name: '设备名称', model: formData.equipmentName, prop: 'equipmentName', type: 'equipmentName', disabled: false },
  { name: '关联设备', model: formData.associatedEquipment, prop: null, type: 'associatedEquipment', disabled: false }
]
export const formRightData = [
  { name: '设备型号', model: formData.equipmentModel, prop: 'equipmentModel', type: 'equipmentModel', disabled: false },
  { name: '设备类型', model: formData.equipmentType, prop: 'equipmentType', type: 'equipmentType', disabled: false },
  { name: '备注', model: formData.remarks, prop: null, type: 'remarks', disabled: false }
]
export const dataRule = {
  equipmentNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentModel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
