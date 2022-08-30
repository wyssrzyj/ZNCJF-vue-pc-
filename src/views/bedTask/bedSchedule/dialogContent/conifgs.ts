/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-29 13:19:20
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
  proportions: '', //拍卖比例
  file: ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'],
  bedNumber: '888',
  fabricColor: '',
  marker: '',
  layingNumber: '',
  name: '',
  username: '',
  srcList: ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'],
  url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  bedSchedule: '',
  equipment: '',
  bedSchedule1: '床次计划1',
  bedSchedule2: '床次计划2',
  bedSchedule3: '床次计划3',
  bedSchedule4: '床次计划4',
  bedSchedule5: '床次计划5',
  bedSchedule6: '床次计划6',
  bedSchedule7: '床次计划7',
  bedSchedule8: '床次计划8',
  lossRate: '损耗率',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
}

export const formMiddleData = [
  { name: '生产订单', model: formData.bedSchedule, prop: 'bedSchedule', type: 'bedSchedule', disabled: false },
  { name: '客户名称', model: formData.bedSchedule1, prop: null, type: null, disabled: false },
  { name: '面料编号', model: formData.bedSchedule2, prop: null, type: null, disabled: false },
  { name: '面料颜色', model: formData.bedSchedule3, prop: 'fabricColor', type: 'fabricColor', disabled: false },
  { name: '唛架门幅', model: formData.bedSchedule4, prop: 'marker', type: 'marker', disabled: false },
  { name: '铺布层数', model: formData.bedSchedule5, prop: 'layingNumber', type: 'layingNumber', disabled: false },
  { name: '单层件数', model: formData.bedSchedule6, prop: null, type: null, disabled: true },
  { name: '床次总件数', model: formData.bedSchedule8, prop: null, type: null, disabled: true }
]
export const formRightData = [
  { name: '床次计划号', model: formData.bedSchedule1, prop: null, type: null, disabled: true },
  { name: '款式床次号', model: formData.bedSchedule1, prop: 'bedNumber', type: 'bedNumber', disabled: true },
  { name: '面料名称', model: formData.bedSchedule2, prop: 'equipment', type: 'equipment', disabled: false },
  { name: '唛架长度', model: formData.equipment, prop: 'markerLength', type: 'markerLength', disabled: false },
  { name: '铺布长度', model: formData.bedSchedule4, prop: 'layCloth', type: 'layCloth', disabled: false },
  { name: '排唛比例', model: formData.bedSchedule5, prop: 'proportions', type: 'proportions', disabled: false },
  { name: '损耗率(%)', model: formData.lossRate, prop: null, type: null, disabled: true },
  { name: '备注', model: formData.bedSchedule8, prop: null, type: null }
]
export const dataRule = {
  file: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  equipment: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  bedSchedule: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  img: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricColor: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  marker: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  layingNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  bedNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  markerLength: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  layCloth: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  proportions: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}
