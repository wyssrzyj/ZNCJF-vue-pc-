/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2023-02-28 08:36:22
 * @Description:
 * @LastEditors: lyj
 */

//设备类型
export const equipmentType = [
  { name: '铺布', id: '1' },
  { name: '贴标', id: '2' },
  { name: '裁剪', id: '3' }
]

export const equipment = new Map()
equipment.set('1', '铺布')
equipment.set('2', '贴标')
equipment.set('3', '裁剪')

// 面料类型
export const fabricType = [
  { label: '针织', value: "1" },
  { label: '梭织', value: "2" }
]
export const fabric = new Map()
fabric.set("1", '针织')
fabric.set("2", '梭织')

//床次任务状态
export  const bedScheduleType = new Map()
  bedScheduleType.set(1, '未审核')
  bedScheduleType.set(2, '已审核')
  bedScheduleType.set(3, '进行中')
  bedScheduleType.set(4, '已完成')
  
// 裁铺任务状态
export  const mapType = new Map()
  mapType.set(2, '待执行')
  mapType.set(3, '进行中')
  mapType.set(4, '已完成')
// 状态样式
export  const tagType = new Map()
  // tagType.set(1, 'danger')
  tagType.set(2, 'success')
  tagType.set(4, '')
  tagType.set(3, 'warning')