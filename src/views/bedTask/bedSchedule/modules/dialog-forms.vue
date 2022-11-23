<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-11-23 08:52:04
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <NewTable :type="props.type" :data="props.form" :getData="getData" />
  <div class="bedTask-footer">
    <div class="footer-right">
      <el-button type="primary" @click="preservation">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import NewTable from "./dialog-forms-table-new.vue"
  const props = defineProps<{
    operation: any
    form: any
    type: any
  }>()

  const state = reactive({
    list: []
  })
  const preservation = (e: any) => {
      props.operation({ type: 'confirm', data: state.list })

    // let type = state.list.every((item: any) => {
    //   return item.size !== ''&& item.color !== ''
    // })

    // if (type) {
    // } else {
    //   ElMessage({
    //     message: '颜色和尺码不可为空',
    //     type: 'warning'
    //   })
    // }
  }

  //子组件数据
  const getData = (val: any) => {
    state.list = val
  }
</script>

<style>
  .bedTask-footer {
    width: 100%;
    margin-top: 20px;
    height: 30px;
  }
  .footer-right {
    width: 80px;
    height: 30px;
    float: right;
  }
</style>
