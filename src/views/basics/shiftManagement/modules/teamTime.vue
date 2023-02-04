<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2023-01-30 14:08:26
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="teamTime">
      <div v-for="(item, index) in state.list" :key="index" class="teamTime-container">
        <div class="teamTime-time">
          <el-date-picker v-model="item.time" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm" />
        </div>
        <div>
          <el-button v-if="index !== 0"  type="danger" @click=setDelete(index)>删除</el-button>
          <el-button v-if="index === 0" type="primary" @click="newData">新增</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {  reactive } from 'vue'
  // const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    setData: any //取消
  }>()

  const state: any = reactive({
    list: [{ setTime: '', endTime: '', time: '' }]
  })
  const  init= ()=>{
    // only
    // let arr= [
    // { setTime: '', endTime: '', time: '' }]
    // state.list=arr
  }
  init()

  const newData=()=>{
    state.list.push({ setTime: '', endTime: '', time: '' })
  props.setData( state.list)
  }
  const setDelete=(e:any)=>{
  state.list.splice(e, 1)
  props.setData( state.list)
  }

</script>

<style lang="less" scoped>
  .teamTime {
    margin-top: 15px;
    margin-bottom: 15px;
    height: 150px;
     overflow: auto;
  }
  .teamTime-container {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
  }
  .teamTime-time {
    width: 410px;
  }
</style>
