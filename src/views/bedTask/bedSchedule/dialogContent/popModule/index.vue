<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-08-23 14:30:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <LayclothTbale :data="state.data" @getData="getData" />
  <div class="footer">
    <div class="footer-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="preservation">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import LayclothTbale from './layclothTbale/index.vue'

  const props = defineProps<{
    operation: any
    form: any
  }>()

  const state = reactive({
    data: props.form,
    list: []
  })

  const cancel = e => {
    props.operation({ type: 'cancel', data: {} })
  }
  const preservation = e => {
    props.operation({ type: 'confirm', data: state.list })
  }

  //子组件数据
  const getData = (val: any) => {
    state.list = val
  }
</script>

<style>
  .footer {
    width: 100%;
    margin-top: 20px;
    height: 30px;
  }
  .footer-right {
    width: 150px;
    height: 30px;
    float: right;
  }
</style>
