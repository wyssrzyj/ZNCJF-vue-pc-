<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-10-28 14:00:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 图片 -->
  <Picture v-if="state.type === 'img'" :git-img="gitImg" :value="props.value" :disabled="disabled" />
  <!-- 唛架图 -->
  <MarkerFile v-if="state.type === 'shelfFile'" :upload="props.upload" :picture-type="state.pictureType" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 其他附件 -->
  <File v-if="state.type === 'file'" :upload="props.upload" :picture-type="state.pictureTypeNow" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 导入模块 -->
  <ImportTable v-if="props.type === 'import'" :interface="props.interface" :upload="props.upload" :picture-type="state.importNow" :git-file="gitFile" :value="props.value" :disabled="disabled" />
  <!-- 通用上传 -->
  <CurrencyFile v-if="state.type === 'currencyFile'" :upload="props.upload" :git-file="gitFile" :value="props.value" :disabled="disabled" />
</template>
<script lang="ts" setup>
  import { reactive } from 'vue'

  import File from '@/components/upload/file/index.vue'
  import CurrencyFile from '@/components/upload/currencyFile/index.vue'
  import MarkerFile from '@/components/upload/markerFile/index.vue'
  import Picture from '@/components/upload/picture/index.vue'
  import ImportTable from '@/components/upload/Import/index.vue'

  const props = defineProps<{
    type: any //组件类型
    getData: any //数据传递给父级

    value?: any //数据
    disabled?: any //是否可用

    upload?: any //上传的数量和提示
    interface?: any //导入使用的数据
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
    pictureType: { accept: ' .cut, .dat, .gbr, .ggt,.grb,.ict,.iso,.nc,.tac,.txt,.GBR ', availableSuffix: '  cut dat gbr ggt grb ict iso nc tac txt GBR' },
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
