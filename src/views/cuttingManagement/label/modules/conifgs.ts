/*
 * @Author: lyj
 * @Date: 2022-09-03 14:07:30
 * @LastEditTime: 2022-10-26 13:49:23
 * @Description:
 * @LastEditors: lyj
 */
//---------------content-----------------
export const content: any = {
  formData: {
    styleImage: [],
    styleCode: '',
    styleName: '',
    shelfFile: [],
    attachmentList: [],

    produceOrderCode: '',
    customName: '',
    fabricCode: '',
    fabricColor: '',
    shelfWidth: 0,
    deviceSn: '',
    planStartTime: '',
    bedSum: 0,

    styleBedNo: null,
    taskCode: null,
    fabricName: '',
    shelfLength: 0,
    spreadClothLength: 0,
    deviceName: '',
    planEndTime: 0,
    remark: ''
  },
  formMiddleData: [
    { name: '生产订单', model: 'produceOrderCode', prop: null, type: null, disabled: true },
    { name: '床次', model: 'bedPlanNo', prop: null, type: null, disabled: true },
    { name: '面料编号', model: 'fabricCode', prop: null, type: null, disabled: true },
    { name: '面料颜色', model: 'fabricColor', prop: null, type: null, disabled: true },
    { name: '唛架门幅', model: 'shelfWidth', prop: null, type: 'shelfWidth', disabled: true },
    { name: '设备编号', model: 'deviceSn', prop: 'deviceSn', type: 'deviceSn', disabled: true },
    { name: '计划开始', model: 'planStartTime', prop: null, type: 'time', disabled: true }
  ],
  formRightData: [
    { name: '款式床次号', model: 'styleBedNo', prop: null, type: null, disabled: true },
    { name: '贴标任务号', model: 'taskCode', prop: null, type: null, disabled: true },
    { name: '面料名称', model: 'fabricName', prop: null, type: null, disabled: true },
    { name: '唛架长度', model: 'shelfLength', prop: null, type: 'number', disabled: true },
    { name: '铺布长度', model: 'spreadClothLength', prop: null, type: 'number', disabled: true },
    { name: '设备名称', model: 'deviceName', prop: null, type: null, disabled: true },
    { name: '计划结束', model: 'planEndTime', prop: null, type: 'time', disabled: true }
  ],
  dataRule: {
    deviceSn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }
}
