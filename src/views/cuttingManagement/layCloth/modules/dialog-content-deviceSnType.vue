<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-23 14:39:26
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <LayclothForm :set-value="setValue" />
  <LayclothTbale :type="props.type" :form="state.formList" :select="select" />
  <div class="footer">
    <div class="footer-right">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
   import { cloneDeep,  } from 'lodash'

  import LayclothForm from './dialog-content-deviceSnType-form.vue'
  import LayclothTbale from './dialog-content-deviceSnType-table.vue'
  const props = defineProps<{
    type:any
    operation: any
  }>()

  const state = reactive({
    formList: {},
    tableSelect: {}
  })

  const setValue = (e:any) => {
   const data  =cloneDeep  (e)
    state.formList = data
  }
  //选中
  const select = (e:any) => {
    props.operation({ type: 'confirm', data: e })
  }

  const cancel = (e:any) => {
    props.operation({ type: 'cancel', data: {} })
  }
</script>

<style>
  .footer {
    width: 65px;
    margin-top: 20px;
    height: 30px;
  }
  .footer-right {
    float: right;
  }
</style>
