<!--
 * @Author: lyj
 * @Date: 2022-08-25 10:25:16
 * @LastEditTime: 2022-08-29 10:58:27
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="option">
    <div>
      <el-tabs v-model="state.tabPosition" tab-position="left" @tab-click="handleClick">
        <el-tab-pane v-for="item in state.list" :key="item.title" :label="item.title" :name="item.title" />
      </el-tabs>
      <el-icon class="circlePlus" :size="25" @click="increase"><CirclePlus /></el-icon>
    </div>
    <!-- form -->
    <RightFrom :type="props.type" :current="state.current" :update="update" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import RightFrom from './rightFrom/index.vue'
  import './index.css'
  import { isEmpty } from 'lodash'

  const props = defineProps<{
    // either: '必传且限定' | '其中一个' | '值' // 利用TS：限定父组件传 either 的值
    data: any[]
    type: any
  }>()

  const state: any = reactive({
    list: [], //总数据
    current: {}, //显示第几项数据
    tabPosition: '' //tabs-选中第几个
  })

  //标题
  const getTitle = (small: any, large: any) => {
    return `${small}-${large}层`
  }

  //初始设置数据
  const init = () => {
    if (!isEmpty(props.data)) {
      //添加标题
      props.data.map(item => {
        item.title = getTitle(item.spreadTemplateParam.minLevel, item.spreadTemplateParam.maxLevel)
      })
    }

    state.current = props.data[0]
    state.list = props.data
    state.tabPosition = props.data[0].title //选中第几个

    // console.log('右边总数据 ', props.data)
  }

  init()

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    // console.log(tab.props)
    let title = tab.props.label
    state.tabPosition = title
    let arr = state.list.filter((item: any) => item.title === title)
    state.current = arr[0]
  }
  //添加
  const increase = () => {
    if (!props.type) {
      let lastItem = state.list[state.list.length - 1]
      let min = Number(lastItem.spreadTemplateParam.maxLevel) + 1
      let max = Number(min) + 1

      let title = `${min}-${max}层`

      state.tabPosition = title
      let newlyAdded = {
        title: title,
        spreadTemplateParam: {
          minLevel: min,
          maxLevel: max,
          forwardSpeed: '前进速度',
          backSpeed: '后退速度',
          uniformTightness: '匀速松紧值',
          accelerationTightness: '加速松紧值',
          reduceTightness: '减速松紧值',
          crawlTightness: '爬行松紧值',
          crawlSpeed: '爬行速度',
          crawlDistance: '爬行距离',
          angle: '布斗目标角度',
          accelerationWeight: '加速权重',
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
      }

      state.list.push(newlyAdded)
      state.current = newlyAdded
    }
  }

  //数据更新
  const update = (type: any, data: any) => {
    let listClone = state.list
    let arr = listClone.map((item: any) => {
      item.title = getTitle(item.spreadTemplateParam.minLevel, item.spreadTemplateParam.maxLevel)
      return item
    })

    state.tabPosition = getTitle(data.minLevel, data.maxLevel)
    // console.log(arr)

    state.list = arr
  }
</script>

<style></style>
