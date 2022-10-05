<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-10-03 17:48:17
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div id="print">
    <div>
      <div class="topContainer">
        <div class="topRight">
          <div class="title">裁剪拉布单</div>
        </div>
      </div>
    </div>
    <Information :data="state.data" />
    <Ready :data="state.data" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive,  watch } from 'vue'
  import Information from './dialog-print-information.vue'
  import Ready from './dialog-print-ready.vue'

  const props = defineProps<{
    data: any
  }>()

  const state = reactive({
    data: {}
  })

  watch(
    () => props.data,
    data => {
      state.data=data

     }
  )
</script>

<style>
  .topContainer {
    display: flex;
    width: 100%;
    height: 80px;
  }
  .topLeft {
    width: 15%;
  }
  .topRight {
    font-size: 20px;
    font-weight: 20px;
    width: 85%;
    text-align: center;
  }
  .title {
    font-size: 15px;
  }
  .information {
    margin-left: 40px;
  }
</style>
