<!--
 * @Author: lyj
 * @Date: 2022-08-25 10:25:16
 * @LastEditTime: 2022-10-09 12:48:42
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="option">
    <div>
      <el-tabs v-model="state.tabPosition" editable tab-position="left" @edit="handleTabsEdit" @tab-click="handleClick">
        <div class="handleTabsEdit">
          <el-tab-pane v-for="item in state.list" :key="item.title" :lazy="true" :label="item.title" :name="item.title" />
        </div>
      </el-tabs>
    </div>
    <RightFrom v-if="state.current"  :type="props.type" :current="state.current" :update="update" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import RightFrom from './dialog-content-form.vue'
  import './index.less'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'
  const props = defineProps<{
    data: any
    type: any
    getList: any
    initForm: any
  }>()

  const state: any = reactive({
    list: [], //总数据
    current: {}, //显示第几项数据
    tabPosition: '', //tabs-选中第几个

    data: {
      forwardSpeed: 0,
      backSpeed: 0,
      uniformTightness: '',
      accelerationTightness: 0,
      reduceTightness: '',
      crawlTightness: '',
      crawlSpeed: '',
      crawlDistance: '',
      angle: '',
      accelerationWeight: '',
      bottomTable: [
        {
          date: '布斗匀速',
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0,
          seven: 0,
          eight: 0,
          nine: 0,
          ten: 0
        },
        {
          date: '布斗加速',
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0,
          seven: 0,
          eight: 0,
          nine: 0,
          ten: 0
        },
        {
          date: '布斗减速',
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0,
          seven: 0,
          eight: 0,
          nine: 0,
          ten: 0
        }
      ]
    }
  })

  //标题
  const getTitle = (small: any, large: any) => {
    return `${small}-${large}层`
  }
  //点击
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    let title = tab.props.label
    state.tabPosition = title

    let arr = state.list.filter((item: any) => item.title === title)
    state.current = arr[0]
  }

  // 初始格式处理

  //初始设置数据
  const init = (data: any, type: any) => {
    let cloneData = cloneDeep(data)

    if (!isEmpty(data)) {
      //添加标题
      cloneData.map((item: any) => {
        item.title = getTitle(item.spreadTemplateParam.minLevel, item.spreadTemplateParam.maxLevel)
      })

      if (type === 'init') {
        state.current = cloneData[0]
        state.tabPosition = cloneData[0].title //选中第几个
      }
      //初始不是 1-10层默认展示第一个
      if (type === 'initForm') {
        state.tabPosition = cloneData[0].title
        state.current = cloneData[0]
      }

      state.list = cloneData
    }
  }

  init(props.data.levelParamVOList, 'init')

  // 初始展示第一条
  watch(
    () => props.initForm,
    item => {
      init(item.levelParamVOList, 'initForm')
    }
  )
  // 监听数据变化
  watch(
    () => props.data,
    item => {
      init(item.levelParamVOList, 'watch')
    }
  )

  //添加
  const increase = () => {
    let cloneData = cloneDeep(state.data) //防止污染原始数据
    if (!isEmpty(state.list)) {
      let lastItem = state.list[state.list.length - 1]
      let min = Number(lastItem.spreadTemplateParam.maxLevel) + 1
      let max = Number(min) + 1
      let title = `${min}-${max}层`
      let newlyAdded = {
        title: title,
        spreadTemplateParam: {
          minLevel: min,
          maxLevel: max,
          ...cloneData
        }
      }
      state.list.push(newlyAdded)
      state.current = newlyAdded

      state.tabPosition = title

      //传递给父级
      props.getList(state.list)
    } else {
      let min = 1
      let max = 10
      let title = `${min}-${max}层`
      let newlyAdded = {
        title: title,
        spreadTemplateParam: {
          minLevel: min,
          maxLevel: max,
          ...cloneData
        }
      }
      state.list.push(newlyAdded)
      state.current = newlyAdded
      state.tabPosition = title

      //传递给父级
      props.getList(state.list)
    }
  }

  const handleTabsEdit = (e: any, type: any) => {
    if (!props.type) {
      if (type === 'add') {
        increase()
      }
      if (type === 'remove') {
        if (state.list.length > 1) {
          let arr = state.list.filter((item: any) => item.title !== e)
          if (!isEmpty(arr)) {
            state.tabPosition = arr[0].title
            state.current = arr[0]
          } else {
            let newlyAdded = {
              title: '',
              spreadTemplateParam: {
                minLevel: 0,
                maxLevel: 0,
                ...state.data
              }
            }
            state.current = newlyAdded
          }
          state.list = arr
          props.getList(state.list)
        } else {
          ElMessage({
            message: '至少保留一项',
            type: 'warning'
          })
        }
      }
    }
  }

  // 处理数据更新操作
  const updateOperation = (subscript: any, data: any, arr: any) => {
    state.list.splice(subscript, 1, data)
    //更改头部
    arr.map((item: any) => {
      item.title = getTitle(item.spreadTemplateParam.minLevel, item.spreadTemplateParam.maxLevel)
      return item
    })
    //选中值
    //排序
    arr.sort((a: any, b: any) => {
      return a.spreadTemplateParam.minLevel - b.spreadTemplateParam.minLevel
    })
    state.list = arr
    state.tabPosition = getTitle(data.spreadTemplateParam.minLevel, data.spreadTemplateParam.maxLevel)
    console.log("当前最新的1",data);
    
    state.current=cloneDeep(data)//当前最新的数据
    props.getList(state.list)
  }

  //最大层数判断逻辑
  const setMaxLevel = (data: any, subscript: any) => {
    //data 当前项
    //subscript 下标
    let arr = state.list //总数据
    let maxLevel = data.spreadTemplateParam.maxLevel //当前输入的值
    let maxList = arr[arr.length - 1] //最大
    data.spreadTemplateParam.MaxLevelType = false //不满足就添加状态-用于判断

    // 先判断当前是否是最大的
    if (data.title !== maxList.title) {
      //现在点击的不是最大的那个
      //当前项大一层的最小值
      let min = arr[subscript + 1].spreadTemplateParam.minLevel
      if (maxLevel >= min) {
        ElMessage({
          message: '不能大于上一项的最小值',
          type: 'warning'
        })
        data.spreadTemplateParam.MaxLevelType = true//不满足就添加状态-用于判断
        data.spreadTemplateParam.max = min
        data.spreadTemplateParam.maxLevel = min-1 //数据超出 使用下一层的最小值-1
        updateOperation(subscript, data, arr)
        //得刷新数据
      }else{
        updateOperation(subscript, data, arr)
      }
    } else {
      updateOperation(subscript, data, arr)
    }
  }

  //数据更新
  const update = (data: any) => {
    const subscript = state.list.findIndex((item: any) => item.title === data.title)
    if (subscript !== -1) {
      setMaxLevel(data, subscript) //最大层数的数据判断处理
    }
  }
</script>

<style></style>
