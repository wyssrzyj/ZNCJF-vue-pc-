<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2023-02-04 14:31:17
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="cycle-container">
    <div v-for="item in state.list" :key="item.name" :class="item.type ? 'cycle-date-true' : 'cycle-date'" @click="setType(item)">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash'
  import {  reactive } from 'vue'
  // const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    setData: any //取消
  }>()

  const state: any = reactive({
    list: [
      { name: '周一', type: false },
      { name: '周二', type: false },
      { name: '周三', type: false },
      { name: '周四', type: false },
      { name: '周五', type: false },
      { name: '周六', type: false },
      { name: '周天', type: false }
    ]
  })

  const setType = (e: any) => {
    const sum = cloneDeep(state.list)
    const subscript = sum.findIndex((item: any) => item.name === e.name)
    if (subscript !== -1) {
      e.type = !e.type
      sum.splice(subscript, 1, e)
      state.list=sum
      props.setData(sum)
    }
    // e.type= !e.type
  }
</script>

<style lang="less" scoped>
  .cycle-container {
    display: flex;
  }
  .cycle-date {
    margin-right: 5px;
    cursor: pointer;
    padding-left: 7px;
    padding-right: 7px;
    padding-top: 2px;
    padding-bottom: 2px;
    border: 1px solid #c0c4cc;
    span {
      color: #c0c4cc;
    }
  }
  .cycle-date-true {
    margin-right: 5px;
    cursor: pointer;
    padding-left: 7px;
    padding-right: 7px;
    padding-top: 2px;
    padding-bottom: 2px;
    border: 1px solid #3e8ff7;
    background: #3e8ff757;
    span {
      color: #3e8ff7;
    }
  }
</style>
