/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-30 19:29:31
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
