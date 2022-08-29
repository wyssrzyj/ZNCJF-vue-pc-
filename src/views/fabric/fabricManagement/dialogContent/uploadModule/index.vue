<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-08-29 11:18:35
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <Picture v-if="state.type === 'img'" :git-img="gitImg" :value="value" :disabled="disabled" />
  <File v-if="state.type === 'file'" :picture-type="state.pictureType" :git-file="gitFile" :value="value" :disabled="disabled" />
</template>
<script lang="ts" setup>
  import { reactive } from 'vue'

  import File from '@/components/file/index.vue'
  import Picture from '@/components/picture/index.vue'
  const props = defineProps<{
    type: string
    getData: any
    value: []
    disabled: boolean
  }>()

  // type 类型
  // getData 传递出去
  // value 数据
  // disabled 是否可用

  const state = reactive({
    disabled: props.disabled,
    value: props.value,
    type: props.type,
    //文件上传类型
    pictureType: { accept: '.cut, .dat, .gbr, .ggt,.grb,.ict,.iso,.nc,.tac,.txt', availableSuffix: 'cut dat gbr ggt grb ict iso nc tac txt' }
  })

  const gitImg = (e: any) => {
    // console.log(e)
    props.getData(e)
  }
  const gitFile = (e: any) => {
    // console.log('文件上传gitFile', e)
    props.getData(e)
  }
</script>

<style></style>
