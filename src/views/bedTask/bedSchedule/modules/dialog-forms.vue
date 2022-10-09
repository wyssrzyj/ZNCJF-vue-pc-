<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-28 11:01:11
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <LayclothTbale :type="props.type" :data="props.form" @getData="getData" />
  <div class="bedTask-footer">
    <div class="footer-right">
      <!-- <el-button @click="cancel">取消</el-button> -->
      <el-button type="primary" @click="preservation">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import LayclothTbale from './dialog-forms-table.vue'
  import { ElMessage } from 'element-plus'
  const props = defineProps<{
    operation: any
    form: any
    type: any
  }>()

  const state = reactive({
    list: []
  })

  // const cancel = (e: any) => {
  //   props.operation({ type: 'cancel', data: {} })
  // }
  const preservation = (e: any) => {
    let type = state.list.every((item: any) => {
      return item.size !== ''&& item.color !== ''
    })

    if (type) {
      props.operation({ type: 'confirm', data: state.list })
    } else {
      ElMessage({
        message: '颜色和尺码不可为空',
        type: 'warning'
      })
    }
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
