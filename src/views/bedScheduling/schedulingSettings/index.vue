<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2023-03-10 15:05:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="settings">
    <div class="settings-left">
      <div class="settings-left-top">
        <el-input v-model="state.name" :placeholder="`请输入款号`" type="text" clearable @blur="setBlur" />
        <div class="settings-type">
          <div v-for="item in state.choice.data" :key="item.name" :class="item.type ? 'settings-type-data1' : 'settings-type-data2'" @click="setType(item)">{{ item.name }}</div>
        </div>
        <div class="division"></div>
      </div>

      <div class="settings-list">
        <div class="settings-list-overflow">
          <!-- 全部 -->
          <div v-if="state.choice.type === '全部'">
            <div>
               <div v-for="(item, index) in state.typeList.wholeData" :key="index" :class="item.style.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item)">
              <div class="settings-list-title">款号 : {{ item.style.name }}</div>
            </div>
            </div>
            <div v-if="state.typeList.wholeData.length===0">
                <img class="schedulingSettings-zw" :src="jackZw" alt="">
              </div>
           
          </div>

          <!-- 未分派 -->
          <div v-if="state.choice.type === '未分派'">
              <div v-if="state.typeList.notData.length>0">
                   <div v-for="(item, index) in state.typeList.notData" :key="index">
              <div :class="item.style.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item)">
                <div class="settings-list-title">
                  <span><img :src="top" alt="" :class="item.style.type ? 'settings-img' : 'settings-img-bottom'" /></span>
                  款号: {{ item.style.name }}
                </div>
              </div>
              <!-- 子项 -->
              <div :class="item.style.type ? 'demo-dh1' : 'demo-dh2'">
                <div v-for="(v, index) in item.style.children" :key="index">
                  <div class="settings-checkbox">
                    <el-checkbox :label="v.name" size="large" @change="(e:any)=>{setCheckbox(e,v)}" />
                  </div>
                </div>
              </div>
            </div>

              </div>
              <div v-if="state.typeList.notData.length===0">
                <img class="schedulingSettings-zw" :src="jackZw" alt="">

              </div>
          </div>
          <!-- 已分派 -->
          <div v-if="state.choice.type === '已分派'">
            <div v-if="state.typeList.alreadyData.length>0">
               <div v-for="(item, index) in state.typeList.alreadyData" :key="index" :class="item.style.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item)">
              <div class="settings-list-title">款号 : {{ item.style.name }}</div>
            </div>
            </div>
            <div v-if="state.typeList.alreadyData.length===0">
               <img class="schedulingSettings-zw" :src="jackZw" alt="">
            </div>
           
          </div>
        </div>

        <!-- 操作 -->
        <div v-show="state.choice.type === '未分派'" class="settings-list-bottom">
          <el-button type="primary" @click="close('preservation')">智能分派</el-button>
          <el-button type="primary" :disabled="state.choice.assignmentType" @click="preserveAssignment">保存分派</el-button>
        </div>
      </div>
    </div>
    <div class="settings-right">
      <div>
        <Gannt :data="state.dhtml" :on-chang="ganntClick" />
      </div>

      <div class="settings-right-table">
        <!-- 全部 -->
        <div v-if="state.choice.type === '全部'">
          <HomeTable :row="state.selectData" />
        </div>
        <!-- 未分派已分派 -->
        <div v-if="state.choice.type !== '全部'" class="bottomTable-schedulingSettings">
          <leftTable :title="state.choice.type" :data="state.leftTable" />
          <rightTable :operation="rightOperation" :title="state.choice.type" :data="state.rightTableData" />
        </div>
      </div>
    </div>
  </div>
  <!-- 弹窗 -->
  <el-dialog v-if="state.assignmentType" v-model="state.assignmentType" :draggable="false" :close-on-click-modal="false" title="智能分派" width="850px">
    <Assignment :close="close" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  // import { ElMessage } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { cloneDeep, isEmpty } from 'lodash'
  import moment from 'moment'

  import top from '@/components/icon/top.png'
  import { bedScheduleType } from '@/components/conifgs'
  import jackZw from '@/components/img/zw.jpg'

  import Gannt from './modules/gannt.vue'
  import HomeTable from './modules/table.vue'
  import Assignment from './modules/dialog-assignment.vue'
  import leftTable from './modules/leftTable.vue'
  import rightTable from './modules/rightTable.vue'
  import './index.less'

  import { content } from './modules/conifgs'

  const { choice, typeList } = content
  const { proxy }: any = getCurrentInstance()

  const state: any = reactive({
    name: '', //款号查询条件
    choice: choice,
    typeList: typeList, //状态数据
    assignmentType: false, //分派弹窗
    selectData: {}, //选中项【左侧、甘特图】
    dhtml: {
      data: [],
      x: 35,
      y: 35,
      id: '',
      title: '设备' //表头名字
    },

    leftTable: {},
    rightTableData: {
      gannt: {}, //甘特图选中项
      init: '', //清空
      bedPlanId: '', //右表格数据
      type: false,
      id: '' //公式
    }
  })

  //清空底部表格
  let emptyBottomTable = () => {
    state.leftTable = { init: 'init' } // 左表格
    //右表格
    state.rightTableData = {
      //右表格
      init: 'init',
      bedPlanId: '',
      type: true,
      id: ''
    }
  }

  //未分派 数据结构处理
  const setNotData = (data: any) => {
    //添加子项
    data.map((item: any) => {
      if (!isEmpty(item.styleBedList)) {
        item.styleBedList.map((v: any) => {
          v.name = v.styleCode
        })
        item.style.children = item.styleBedList
      }
    })

    state.typeList.notData = data
  }

  //甘特图时间处理【传递给子级】
  const getGanntTime = (data: any) => {
    data.map((item: any) => {
      item.type = bedScheduleType.get(item.statu)
      if (item.startDate) {
        item.start_date = moment(item.startDate).format('YYYY-MM-DD-HH')
      }
      if (item.endDate) {
        item.end_date = moment(item.endDate).format('YYYY-MM-DD-HH')
      }
    })
    state.dhtml.data = data
  }

  //获取甘特图数据
  const setGanntData = (type: any, value?: any) => {
    if (type === '') {
      proxy.$baseService.get('/jack-ics-api/productionScheduling/styleGantt').then((res: any) => {
        if (res.code === 0) {
          getGanntTime(res.data)
        }
      })
    }
    if (type === 1) {
      proxy.$baseService.get('/jack-ics-api/productionScheduling/deviceGantt').then((res: any) => {
        if (res.code === 0) {
          getGanntTime(res.data)
        }
      })
    }
    if (type === 2) {
      proxy.$baseService.get('/jack-ics-api/productionScheduling/bedGantt', { ...value }).then((res: any) => {
        if (res.code === 0) {
          getGanntTime(res.data)
          //右侧表格需要的id【3】
          let one = res.data[0] //甘特图第一条数据
          // 默认显示第一项数据
          state.dhtml.id = one.id //甘特图选中 【选中会触发点击事件-ganntClick】
        }
      })
    }
  }

  // 处理左侧数据
  const setLeftData = (e: any, type: any) => {
    if (!isEmpty(e)) {
      e.map((item: any) => {
        item.style.name = item.style.styleCode //款号
        item.style.type = false
      })
      if (type === '') {
        state.typeList.wholeData = e
        //子项处理暂时测试
      }
      if (type === 1) {
        setNotData(e)
      }
      if (type === 2) {
        e[0].style.type = true //默认选中
        state.typeList.alreadyData = e
        //甘特图数据、右
        let item = e[0].style
        setGanntData(2, { styleCode: item.styleCode })
        //左表格
        state.leftTable = e[0].style
      }
    } else {
      //左侧
      state.typeList.wholeData = []
      state.typeList.notData = []
      state.typeList.alreadyData = []
      
      //甘特图
      state.dhtml.data = []
      emptyBottomTable()
    }
  }
  //获取左侧列表数据【树 图 底部表格 置空逻辑ok】
  const setList = (type: any) => {
    let data = { distributeStatu: type, styleCode: state.name }
    // 空是全部
    // 1 未分派
    // 2 已分派
    proxy.$baseService.get('/jack-ics-api/productionScheduling/listStyleAndBed', { ...data }).then((res: any) => {
      if (res.code === 0) {
        setLeftData(res.data, type)
      }
    })
  }
  //款号查询
  const setBlur = () => {
    if (state.choice.type === '全部') {
      setList('')
    }
    if (state.choice.type === '未分派') {
      setList(1)
    }
    if (state.choice.type === '已分派') {
      setList(2)
    }
  }

  const init = () => {
    setList('')
    setGanntData('')
  }
  init()

  //未分派数据刷新
  let setAlreadyData = () => {
    setList(1)
    setGanntData(1)
  }

  //状态选择
  const setType = (e: any) => {
    state.choice.type = e.name

    let data = cloneDeep(state.choice.data)
    data.map((item: any) => {
      if (item.name === e.name) {
        item.type = true
        state.choice.type = e.name
      } else {
        item.type = false
      }
    })

    state.choice.data = data

    if (e.name === '全部') {
      setList('')
      setGanntData('')
      state.dhtml.title = '设备'
    }
    if (e.name === '未分派') {
      setAlreadyData()
      emptyBottomTable()
      state.dhtml.title = '设备'
    }
    if (e.name === '已分派') {
      setList(2)
      state.dhtml.title = '床次'
    }
  }

  //当前甘特图选中
  const getGanntSelect = (e: any) => {
    //当前
    let styleCode = e.style.styleCode
    let data = state.dhtml.data.filter((item: any) => {
      return item.styleCode === styleCode
    })
    if (!isEmpty(data)) {
      let getId = data.filter((item: any) => item.isHead === 1)
      //选中id
      state.dhtml.id = getId[0].id
      //展开当前
      let list = cloneDeep(state.dhtml.data)
      list.map((item: any) => {
        if (item.id === state.dhtml.id) {
          item.open = true
        }
      })
      state.dhtml.data = list
    }
  }

  //左侧数据点击事件
  const setLeftOperation = (e: any) => {
    let type = state.choice.type
    state.selectData = e //选中项
    if (type === '全部') {
      //选中项处理
      let data = cloneDeep(state.typeList.wholeData)
      data.map((item: any) => {
        if (item.style.id === e.style.id) {
          item.style.type = true
        } else {
          item.style.type = false
        }
      })
      state.typeList.wholeData = data //数据处理

      //甘特图
      getGanntSelect(e)
    }
    //未分派
    if (type === '未分派') {
      //选中项处理
      let data = cloneDeep(state.typeList.notData)
      data.map((item: any) => {
        if (item.style.id === e.style.id) {
          item.style.type = !item.style.type
        }
        //是否收齐其他
        else {
          // item.style.type = false
        }
      })

      state.choice.notDataCheckbox=[]
      state.typeList.notData = data
      getGanntSelect(e)
    }
    // 已分派
    if (type === '已分派') {
      //选中项处理
      let data = cloneDeep(state.typeList.alreadyData)
      data.map((item: any) => {
        if (item.style.id === e.style.id) {
          item.style.type = true
        } else {
          item.style.type = false
        }
      })
      state.typeList.alreadyData = data

      //甘特图数据获取
      setGanntData(2, { styleCode: e.style.styleCode })
      //左表格
      state.leftTable = e.style
    }
  }

  //子项选中
  const setCheckbox = (type: any, e: any) => {
    //左表格
    e.init = ''
    state.leftTable = e

    let list = state.choice.notDataCheckbox

    let checkbox: any = [] //选中的数据

    if (e.id) {
      if (type === true) {
        list.push(e)
        checkbox = list
      } else {
        if (!isEmpty(list)) {
          let arr = cloneDeep(list)
          let subscript = arr.findIndex((item: any) => item.id === e.id)
          arr.splice(subscript, 1)
          checkbox = arr
          state.choice.notDataCheckbox = checkbox
        }
      }
    }

    let arr = {
      init: 'init',
      bedPlanId: '',
      type: false,
      id: e.id
    }

    //子项多选后右表格不可操作
    let length = checkbox.length
    if (length === 1) {
      arr.type = false
    } else {
      arr.type = true
    }

    state.rightTableData = arr

    //保存分派按钮状态
    if (length === 1) {
      state.choice.assignmentType = false
    } else {
      state.choice.assignmentType = true
    }
  }
  //智能分派弹窗
  const close = (type: string) => {
    if (type == 'preservation') {
      // preservation

      state.assignmentType = false
    } else {
      // cancel
      state.assignmentType = false
    }
  }
  // 甘特图添加删除逻辑
  const deleteGannData = (e: any, data: any) => {
    let list = data.filter((item: any) => item.newTitle === e.title)
    if (!isEmpty(list)) {
      //上一次的在最前面
      if (list.length === 2) {
        let mov: any = {}
        if (list[0].id < list[1].id) {
          mov = list[0]
        } else {
          mov = list[1]
        }
        //删除旧值
        const arr = data.filter((v: any) => v.id !== mov.id)
        return arr
      } else {
        return data
      }
    } else {
      return data
    }
  }
  //动态给甘特图添加数据
  const setGannData = (e: any) => {
    if (!isEmpty(e)) {
      let data = cloneDeep(e)
      //设备时间都选中
      let arr = data.filter((item: any) => {
        if (item.cropping && item.time) {
          return item
        }
      })

      if (!isEmpty(arr)) {
        arr.forEach((item: any) => {
          //只处理当前操作的** 2023-3-10
          if (item.title === item.clickType) {

            let ganntList = cloneDeep(state.dhtml.data)
            if (!isEmpty(ganntList)) {
              //删除【同设备 时间不同去重】
              const list = ganntList.filter((v: any) => v.newId !== item.cropping)

              const subscript = list.findIndex((v: any) => v.id === item.cropping)
              let index = subscript + 1

              let data = {
                text: '',
                newId: item.cropping, //删除判断【删除重复的】
                newTitle: item.title, //删除判断【删除重复的】
                id: new Date().valueOf(),
                start_date: moment(item.time[0]).format('YYYY-MM-DD-HH'), //开始时间
                end_date: moment(item.time[1]).format('YYYY-MM-DD-HH'), //结束时间
                parent: item.cropping,
                color: item.color //控制颜色
              }

              //添加数据
              list.splice(index, 0, data)
              //删除【同设备 设备值不同去重】
              ganntList = deleteGannData(item, list)
              state.dhtml.data = ganntList
            }
          }
        })
      }
    }
  }

  //右侧表格回调
  const rightOperation = (type: any, e: any) => {
    // 数据赋值
    if (type === 'assignment') {
      if(state.choice.type==="未分派"){
      setGannData(e)
      state.choice.assignList = e
      }
    }
    // 取消
    if (type === 'cancel') {
      //数据刷新
      setList(2)
      // 树 图 ok
      // emptyBottomTable()
    }
    //修改
    if (type === 'revise') {
      setList(2)
    }
  }
  //保存分派
  const preserveAssignment = () => {
    //1必填项不可为空【initType,type】
    if (!isEmpty(state.choice.assignList)) {
      let data = cloneDeep(state.choice.assignList)
      //去除不可用
      let arr = data.filter((item: any) => {
        return item.type !== true && item.initType !== true
      })
      //判断是否全部满足必填
      let type = arr.every((item: any) => {
        return item.cropping && item.time
      })
      if (type) {
        //铺布
        let spreadTaskSta = moment(data[0].time[0]).valueOf()
        let spreadTaskEnd = moment(data[0].time[1]).valueOf()
        let spreadTaskId = data[0].cropping
        //贴标
        let pasteTaskId = data[1].cropping
        let pasteTaskSta: any = ''
        let pasteTaskEnd: any = ''
        if (pasteTaskId !== '') {
          pasteTaskSta = moment(data[1].time[0]).valueOf()
          pasteTaskEnd = moment(data[1].time[1]).valueOf()
        }

        //裁剪
        let cutTaskStar = moment(data[2].time[0]).valueOf()
        let cutTaskEnd = moment(data[2].time[1]).valueOf()
        let cutTaskId = data[2].cropping

        let bedPlanId = state.leftTable.id //选中的id

        let form: any = {
          bedPalnTaskTimeDTO: {
            //铺布
            spreadTaskTime: {
              planEndTime: spreadTaskEnd,
              planStartTime: spreadTaskSta,
              resourceId: spreadTaskId
            },
            //贴标
            pasteTaskTime: {
              planEndTime: pasteTaskEnd,
              planStartTime: pasteTaskSta,
              resourceId: pasteTaskId
            },
            //裁剪
            cutTaskTime: {
              planEndTime: cutTaskEnd,
              planStartTime: cutTaskStar,
              resourceId: cutTaskId
            }
          },
          bedPlanId: bedPlanId
        }

        proxy.$baseService.post('/jack-ics-api/spreadTask/save', { ...form }).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })

            //刷新未分派数据
            setAlreadyData()
            state.choice.notDataCheckbox = [] //选中
            state.choice.assignmentType = true //保存分派不可用
            emptyBottomTable()
            state.choice.assignList = []
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        ElMessage({
          message: '设备或时间不可为空',
          type: 'warning'
        })
      }
    } else {
      ElMessage({
        message: '请设置工序',
        type: 'warning'
      })
    }
  }

  //甘特图点击
  const ganntClick = (id: any, data: any) => {
    if (!isEmpty(data)) {
      let arr = data.data.filter((item: any) => item.id === id)

      //处理右边
      if (state.choice.type === '已分派') {
        if (!isEmpty(arr)) {
          // 待审核可以操作表格
          let type = arr[0].statu === 2 ? false : true
          let data = {
            gannt: arr[0],
            init: '',
            bedPlanId: arr[0].id,
            type: type,
            id: ''
          }
          state.rightTableData = cloneDeep(data) //右表格
        }
      }
    }
  }
</script>
