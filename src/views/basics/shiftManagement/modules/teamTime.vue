<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2023-02-21 08:41:33
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="teamTime">
      <div v-for="(item, index) in state.list" :key="index" class="teamTime-container">
        <div class="teamTime-time">
          <el-time-picker v-model="item.time" is-range range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" format=" HH:mm" @change="(e: any)=>{setBlur(e,index)}" />
        </div>
        <div>
          <el-button v-if="index !== 0" type="danger" @click="setDelete(index)">删除</el-button>
          <el-button v-if="index === 0" type="primary" @click="newData">新增</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { isEmpty } from 'lodash'
  import moment from 'moment'

  // const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    setData: any //取消
    data: any
  }>()

  const state: any = reactive({
    list: [{ startTime: '', endTime: '', time: '' }]
  })

  watch(
    () => props.data,
    item => {
      if (!isEmpty(item.workTime)) {
        init(item.workTime)
      }
    }
  )

  const init = (e: any) => {
    let setTime: any = []
    e.forEach((item: any) => {
      setTime.push({ startTime: item.startTime, endTime: item.endTime, time: [moment(item.startTime), moment(item.endTime)] })
    })
    state.list = setTime
  }

  const newData = () => {
    state.list.push({ startTime: '', endTime: '', time: '' })
  }
  const setDelete = (e: any) => {
    state.list.splice(e, 1)
    props.setData(state.list)
  }
  const setBlur = (e: any, index: any) => {
    state.list[index].startTime = moment(e[0]).valueOf()
    state.list[index].endTime = moment(e[1]).valueOf()
    props.setData(state.list)
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
