<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-09-04 15:21:14
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 图片 -->
  <Picture v-if="state.type === 'img'" :git-img="gitImg" :value="props.value" :disabled="disabled" />
  <!-- 唛架图 -->
  <File v-if="state.type === 'shelfFile'" :upload="props.upload" :picture-type="state.pictureType" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 其他上传 -->
  <File v-if="state.type === 'file'" :upload="props.upload" :picture-type="state.pictureTypeNow" :git-file="gitFile" :value="props.value" :disabled="disabled" />
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
    upload: any
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
    pictureType: { accept: ' .cut, .dat, .gbr, .ggt,.grb,.ict,.iso,.nc,.tac,.txt', availableSuffix: '  cut dat gbr ggt grb ict iso nc tac txt' },
    pictureTypeNow: { accept: '', availableSuffix: '' }
  })

  const gitImg = (e: any) => {
    props.getData(e)
  }
  const gitFile = (e: any) => {
    //添加状态
    e.type = state.type
    props.getData(e)
  }
</script>

<style></style>
