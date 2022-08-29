/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-29 13:08:48
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
  file: [
    {
      name: 'file'
    }
  ],
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
  { name: '床次计划号', model: formData.bedSchedule, prop: 'bedSchedule', type: 'bedSchedule' },
  { name: '面料编号', model: formData.bedSchedule1, prop: null, type: null, disable: true },
  { name: '成衣颜色', model: formData.bedSchedule2, prop: null, type: null, disable: true },
  { name: '布封', model: formData.bedSchedule3, prop: null, type: null, disable: true },
  { name: '设备型号', model: formData.bedSchedule4, prop: null, type: null, disable: true },
  { name: '计划开始', model: formData.bedSchedule5, prop: null, type: null },
  { name: '铺布层数', model: formData.bedSchedule6, prop: null, type: null, disable: true },
  { name: '单层件数', model: formData.bedSchedule8, prop: null, type: null, disable: true }
]
export const formRightData = [
  { name: '铺布任务号', model: formData.bedSchedule1, prop: null, type: null },
  { name: '面料名称', model: formData.bedSchedule1, prop: null, type: null },
  { name: '段长', model: formData.bedSchedule2, prop: null, type: null },
  { name: '设备编号', model: formData.equipment, prop: 'equipment', type: 'equipment' },
  { name: '设备名称', model: formData.bedSchedule4, prop: null, type: null },
  { name: '计划结束', model: formData.bedSchedule5, prop: null, type: null },
  { name: '损耗率(%)', model: formData.lossRate, prop: null, type: 'lossRate' },
  { name: '床次总件数', model: formData.bedSchedule8, prop: null, type: null }
]
