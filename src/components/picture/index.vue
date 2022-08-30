<!--
 * @Author: lyj
 * @Date: 2022-08-17 15:35:46
 * @LastEditTime: 2022-08-24 16:26:24
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div v-if="disabled === true" class="disabledContainer">
    9999
    <!-- <img class="disabledImg" :src="state.fileList[0].url" alt="" /> -->
  </div>
  <div v-if="disabled === false">
    <njp-upload-images-v1 v-model="state.fileList" :limit="state.limit" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  const props = defineProps<{
    gitImg: any
    value: []
    disabled: boolean
  }>()

  const state = reactive({
    fileList: props.value || [],
    limit: 1
  })

  watch(
    () => state.fileList,
    (item: any) => {
      props.gitImg({ type: 'img', data: state.fileList })
    }
  )
</script>
<style>
  .disabledContainer {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    background: #bdcfbd;
  }
  .disabledImg {
    width: 100px;
    height: 100px;
    padding: 10px;
    /* vertical-align: middle; */
  }
</style>
