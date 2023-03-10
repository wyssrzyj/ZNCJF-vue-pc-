/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2023-03-10 11:21:40
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
      notDataCheckbox: [], //未分派选中集合
      assignmentType:true,//手动分派按钮状态
      assignList:[]//手动分派需要的数据
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

//右侧表格数据
export const rightTable={
  tableData :[
      {
        title: '铺布',
        style: 'cloth',
        time: '', //组件需要的格式
        cropping: '',
        croppingData: [],
        clickType:"",//选中的哪一项【用于和甘特图显示例子】
        color:"#566ed6",
        type: true, //是否可用
        initType: true, //接口是否允 true 禁用
        clothType:true//铺布是否选择 true禁用
      },
      {
        title: '贴标',
        style: 'labelling',
        time: '',
        cropping: '',
        croppingData: [],
        color:"#56aed6",
        clickType:"",//选中的哪一项【用于和甘特图显示例子】
        initType: true,
        type: true,
        clothType:true//铺布是否选择 true禁用
      },
      {
        title: '裁剪',
        time: '',
        style: 'cropping',
        color:"#56d6be",
        cropping: '',
        croppingData: [],
        clickType:"",//选中的哪一项【用于和甘特图显示例子】
        initType: true, 
        type: true,
        clothType:true//铺布是否选择 true禁用
      }
    ],
     initTableData :[
      {
        title: '铺布',
        style: 'cloth',
        time: '', //组件需要的格式
        cropping: '',
        croppingData: [],
        type: true, //是否可用
        initType: true, //接口是否允 true 禁用
        clothType:true//铺布是否选择 true禁用
      },
      {
        title: '贴标',
        style: 'labelling',
        time: '',
        cropping: '',
        croppingData: [],
        initType: true,
        type: true,
        clothType:true//铺布是否选择 true禁用
      },
      {
        title: '裁剪',
        time: '',
        style: 'cropping',
        cropping: '',
        croppingData: [],
        initType: true, 
        type: true,
        clothType:true//铺布是否选择 true禁用
      }
    ],
  
  


}