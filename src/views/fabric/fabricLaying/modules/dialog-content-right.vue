<!--
 * @Author: lyj
 * @Date: 2022-08-25 10:25:16
 * @LastEditTime: 2022-10-12 08:36:37
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="option">
    <div>
      <div class="cloth-increase" @click="handleTabsEdit(null, 'add')">+</div>
      <div v-for="item in state.list" :key="item.title" class="cloth-for">
        <div :class="state.tabPosition === item.title ? 'cloth-layer-choice' : 'cloth-layer'">
          <span @click="handleClick(item.title)">{{ item.title }}</span>
          <el-icon class="cloth-icon" @click="handleTabsEdit(item.title, 'remove')"><Close /></el-icon>
        </div>
      </div>
    </div>
    <div class="rightFrom">
      <RightFrom v-if="state.current" :type="props.type" :current="state.current" :update="update" />
    </div>
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

  //添加需要的最大值-maxLevelMax
  const setMaxLevelMax = (title: any, list: any) => {
    //title 当前的标题
    //list 总数据
    // "获取当前需要的最大值
    const subscript = list.findIndex((item: any) => item.title === title)
    let arr = list[subscript]
    //必须数据长度大于1 -> 且还不能是最后一个
    if (list.length > 1) {
      if (arr !== list[list.length - 1]) {
        //才获取当前项的后一个的最小值
        let min = list[subscript + 1].spreadTemplateParam.minLevel
        arr.spreadTemplateParam.maxLevelMax = min - 1
        return arr
      } else {
        return arr
      }
    } else {
      return arr
    }
  }

  //点击
  const handleClick = (title: TabsPaneContext) => {
    state.tabPosition = title
    state.current = setMaxLevelMax(title, state.list)
  }

  //初始设置数据
  const init = (data: any, type: any) => {
    let cloneData = cloneDeep(data)
    let list = cloneDeep(state.list)

    if (!isEmpty(cloneData)) {
      //添加标题-和最大层数最大值
      cloneData.map((item: any, index: any) => {
        item.title = getTitle(item.spreadTemplateParam.minLevel, item.spreadTemplateParam.maxLevel)

        return item
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
      //初始添加需要的最大值-maxLevelMax
      if (cloneData.length > 1) {
        cloneData[0].spreadTemplateParam.maxLevelMax = cloneData[1].spreadTemplateParam.minLevel
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
            // 最后一项 最大值重新赋值~
          arr[arr.length-1].spreadTemplateParam.maxLevelMax="999999999999999999999999999"
          state.list = cloneDeep(arr)
          state.current = arr[0]
          state.tabPosition = arr[0].title
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
    state.current = cloneDeep(data) //当前最新的数据
    props.getList(state.list)
  }

  //最大层数判断逻辑
  const setMaxLevel = (data: any, subscript: any) => {
    //data 当前项
    //subscript 下标
    let arr = state.list //总数据
    let maxLevel = data.spreadTemplateParam.maxLevel //当前输入的值
    let maxList = arr[arr.length - 1] //最大

    // 先判断当前是否是最大的
    if (data.title !== maxList.title) {
    
      let min = arr[subscript + 1].spreadTemplateParam.minLevel
      if (maxLevel >= min) {
        ElMessage({
          message: '不能大于上一项的最小值',
          type: 'warning'
        })
        //最大值数据更新根据 下一项的最小值来做
        //点击方法 handleClick
        //点击的是否给数据添加 maxLevelMax 用于最大值得范围 2022-10-9 16.17

        updateOperation(subscript, data, arr)
        //得刷新数据
      } else {
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

<style lang="less" scoped>
  .cloth-for {
    transform: translateX(-20px);
    margin-right: 20px;
  }
  .cloth-layer {
    cursor: pointer;
    width: 100px;
    height: 40px;
    line-height: 45px;
    text-align: center;
    //  color: #a1a3a5;
    border-right: 2px solid #d9d9da;
  }

  .cloth-layer:hover {
    cursor: pointer;
    width: 100px;
    height: 40px;
    line-height: 45px;
    text-align: center;
    color: #409eff;
    border-right: 2px solid #409eff;
  }

  .cloth-layer-choice {
    cursor: pointer;
    width: 100px;
    height: 40px;
    line-height: 45px;
    text-align: center;
    color: #409eff;
    border-right: 2px solid #409eff;
  }

  .cloth-icon {
    margin-left: 5px;
  }
  .cloth-icon:hover {
    margin-left: 5px;
    background: rgb(197, 193, 193);
    border-radius: 100%;
  }
  .cloth-increase {
    cursor: pointer;
    width: 20px;
    height: 20px;
    line-height: 18px;
    color: rgb(197, 193, 193);
    text-align: center;
    border: 1px solid rgb(197, 193, 193);
    border-radius: 1px;
    // transform: translateX(82px);
    // transform: translateY(10px);
    transform: translate(90px, 30px);
  }
  .cloth-increase:hover {
    color: #409eff;
  }
  .rightFrom {
    height: 600px;
    overflow-y: scroll;
  }
</style>
