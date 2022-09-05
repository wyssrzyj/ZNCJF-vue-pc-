<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-04 17:30:14
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <LayclothForm :set-value="setValue" />
  <LayclothTbale :form="state.formList" :select="select" />
  <div class="footer">
    <div class="footer-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="preservation">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import LayclothForm from './dialog-content-dialog-form.vue'
  import LayclothTbale from './dialog-content-dialog-table.vue'

  const props = defineProps<{
    operation: any
  }>()

  const state: any = reactive({
    formList: {},
    tableSelect: {}
  })

  const setValue = (e: any) => {
    state.formList = e
  }
  //选中
  const select = (e: any) => {
    // console.log('选中项', e)
    state.tableSelect = e
  }
  const cancel = (e: any) => {
    props.operation({ type: 'cancel', data: {} })
  }
  const preservation = (e: any) => {
    props.operation({ type: 'confirm', data: state.tableSelect })
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
