/*
 * @Author: lyj
 * @Date: 2022-09-05 10:01:25
 * @LastEditTime: 2023-01-30 14:51:39
 * @Description:
 * @LastEditors: lyj
 */

//---------------content-----------------
export const content = {
  formData: {
    sn: '',
  },
  formMiddleData: [
    { name: '班组名称', model: 'sn', prop: 'sn', type: 'input', disabled: false },
  ],
  formRightData: [
    { name: '班次周期', model: 'type', prop: 'type', type: 'type', disabled: false },
  
  ],
  dataRule: {
    sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    }
}


