/*
 * @Author: lyj
 * @Date: 2022-09-05 10:01:25
 * @LastEditTime: 2023-02-15 14:47:49
 * @Description:
 * @LastEditors: lyj
 */

//---------------content-----------------
export const content = {
  formData: {
    name: '',
    workDay: [], //班次周期
    workTime: [], //班组时间
    workTeamIdList: []
  },
  formMiddleData: [{ name: '班组名称', model: 'name', prop: 'name', type: 'input', disabled: false }],
  formRightData: [{ name: '班次周期', model: 'type', prop: 'type', type: 'type', disabled: false }],
  dataRule: {
    name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}
