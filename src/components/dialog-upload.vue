<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-09-14 13:53:33
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 图片 -->
  <Picture v-if="props.type === 'img'" :git-img="gitImg" :value="props.value" :disabled="disabled" />
  <!-- 唛架图 -->
  <MarkerFile v-if="props.type === 'shelfFile'" :upload="props.upload" :picture-type="state.pictureType" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 其他上传 -->
  <File v-if="props.type === 'file'" :upload="props.upload" :picture-type="state.pictureTypeNow" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 导入模块 -->
  <ImportTable :interface="props.interface" v-if="props.type === 'import'" :upload="props.upload" :picture-type="state.importNow" :git-file="gitFile" :value="props.value" :disabled="disabled" />

</template>
<script lang="ts" setup>
  import { reactive } from 'vue'

  import File from '@/components/file/index.vue'
  import ImportTable from '@/components/Import/index.vue'
  import MarkerFile from '@/components/markerFile/index.vue'
  import Picture from '@/components/picture/index.vue'
  const props = defineProps<{
    type: string
    getData: any
    value: []
    disabled: boolean
    upload: any
    interface:any
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
    pictureTypeNow: { accept: '', availableSuffix: '' },
    importNow: { accept: '.xlsx,', availableSuffix: 'xlsx' }
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
