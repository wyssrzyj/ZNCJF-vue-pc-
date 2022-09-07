<!--
 * @Author: lyj
 * @Date: 2022-08-25 10:25:16
 * @LastEditTime: 2022-09-07 11:09:16
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="option">
    <div>
      <el-tabs v-model="state.tabPosition" class="handleTabsEditTabs" editable tab-position="left" @edit="handleTabsEdit" @tab-click="handleClick">
        <div class="handleTabsEdit">
          <el-tab-pane v-for="item in state.list" :key="item.title" :label="item.title" :name="item.title" />
        </div>
      </el-tabs>
    </div>
    <RightFrom :type="props.type" :current="state.current" :update="update" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import RightFrom from './dialog-content-form.vue'
  import './index.less'
  import { isEmpty } from 'lodash'

  const props = defineProps<{
    data: any[]
    type: any
    getList: any
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
      accelerationWeight: ''
    }
  })

  //标题
  const getTitle = (small: any, large: any) => {
    return `${small}-${large}层`
  }

  // 初始格式处理

  //初始设置数据
  const init = (data: any) => {
    let cloneData = data

    if (!isEmpty(cloneData)) {
      //添加标题
      cloneData.map((item: any) => {
        item.title = getTitle(item.cutTemplateParam.minLevel, item.cutTemplateParam.maxLevel)
      })
    }

    state.current = cloneData[0]
    state.tabPosition = cloneData[0].title //选中第几个

    state.list = cloneData
  }

  init(props.data)

  //监听父级数据变化
  watch(
    () => props.data,
    item => {
      init(item)
    }
  )

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    let title = tab.props.label
    state.tabPosition = title

    let arr = state.list.filter((item: any) => item.title === title)
    state.current = arr[0]
  }
  //添加
  const increase = () => {
    if (!props.type) {
      if (!isEmpty(state.list)) {
        let lastItem = state.list[state.list.length - 1]
        let min = Number(lastItem.cutTemplateParam.maxLevel) + 1
        let max = Number(min) + 1
        let title = `${min}-${max}层`
        let newlyAdded = {
          title: title,
          cutTemplateParam: {
            minLevel: min,
            maxLevel: max,
            ...state.data
          }
        }
        state.list.push(newlyAdded)
        state.current = newlyAdded

        state.tabPosition = title
      } else {
        let title = `1-10层`
        let newlyAdded = {
          title: title,
          cutTemplateParam: {
            minLevel: 1,
            maxLevel: 10,
            ...state.data
          }
        }

        state.list.push(newlyAdded)
        state.current = newlyAdded

        state.tabPosition = title
      }
    }
    //传递给父级
    props.getList(state.list)
  }

  const handleTabsEdit = (e: any, type: any) => {
    if (!props.type) {
      if (type === 'add') {
        increase()
      }
      if (type === 'remove') {
        let arr = state.list.filter((item: any) => item.title !== e)
        if (!isEmpty(arr)) {
          state.tabPosition = arr[0].title
          state.current = arr[0]
        } else {
          let newlyAdded = {
            title: '',
            cutTemplateParam: {
              minLevel: 0,
              maxLevel: 0,
              ...state.data
            }
          }
          state.current = newlyAdded
        }

        state.list = arr
        props.getList(state.list)
      }
    }
  }

  //数据更新
  const update = (data: any) => {
    const subscript = state.list.findIndex((item: any) => item.title === data.title)
    if (subscript !== -1) {
      state.list.splice(subscript, 1, data)
      let arr = state.list
      //更改头部
      arr.map((item: any) => {
        item.title = getTitle(item.cutTemplateParam.minLevel, item.cutTemplateParam.maxLevel)
        return item
      })

      //选中值
      state.tabPosition = getTitle(data.cutTemplateParam.minLevel, data.cutTemplateParam.maxLevel)
      state.list = arr

      props.getList(state.list)
    }
  }
</script>

<style></style>
