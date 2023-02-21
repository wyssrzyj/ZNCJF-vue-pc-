/*
 * @Author: lyj
 * @Date: 2022-09-05 10:01:25
 * @LastEditTime: 2023-02-21 08:58:52
 * @Description:
 * @LastEditors: lyj
 */

//---------------content-----------------
export const content = {
  formData: {
    img: '',
    sn: '',
    name: '',
    relationDevice: '',
    spec: '',
    type: '',
    remark: '',
    defaultParam: '',
    ip: '',
    port: '',
    relationOperaterList: '',
    defaultFlag:false//默认公式
  },
  formMiddleData: [
    { name: '公式名称', model: 'name', prop: 'name', type: 'input', disabled: false },
    { name: '计算类型', model: 'type', prop: "type", type: 'type', disabled: false },
  ],
  formRightData: [
    { name: '公式编码', model: 'code', prop: 'code', type: 'input', disabled: true },
    { name: '适用资源', model: 'resourceFormulaList', prop: 'resourceFormulaList', type: 'resourceFormulaList', disabled: false },
  ],
  dataRule: {
    name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    resourceFormulaList: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  }

}
//公式参数
export const parameters = [
      {
      name:'e',value:"",type:true,
    },
      {
      name:'A',value:"",type:true,
    },
      {
      name:'h',value:"",type:true,
    },
      {
      name:'g',value:"",type:true,
    },
      {
      name:'f',value:"",type:true,
    },
      {
      name:'k',value:"",type:true,
    },
    {
      name:'s',value:"",type:true,
    },
  ]
