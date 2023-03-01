/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2023-03-01 09:46:17
 * @Description:
 * @LastEditors: lyj
 */




//state数据
export const content = {
    choice: {
      data: [
        { name: '全部', type: true },
        { name: '未分派', type: false },
        { name: '已分派', type: false }
      ], //状态渲染根据type状态
      type: '全部', //选中那个【此状态不负责渲染】
      notDataCheckbox: [] //未分派选中集合
    },
    typeList: {
      wholeData: [], //全部
      notData: [], //未分派
      alreadyData: [] //已分派
    },
}


//排唛比例的表格
export const formsTable = {
  tableColumns: [
    {
      title: '颜色',
      align: 'center',
      dataIndex: 'color',
      width: 200
    },
    {
      title: '尺码',
      align: 'center',
      dataIndex: 'size',
      width: 200
    },
    {
      title: '单层件数',
      align: 'center',
      dataIndex: 'levelClothSum',
      width: 200
    },
    {
      title: '铺布层数',
      align: 'center',
      dataIndex: 'spreadClothLevel',
      width: 200
    },
    {
      title: '床次总件数',
      align: 'center',
      dataIndex: 'total',
      width: 250
    }
  ]
}
