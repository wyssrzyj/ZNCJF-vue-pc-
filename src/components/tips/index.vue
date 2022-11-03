<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-11-03 10:11:42
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-tooltip effect="dark" :content="props.title" placement="right-start">
    <div class="tips">
      <img :src="Tagging" alt="" />
    </div>
  </el-tooltip>
</template>
<script lang="ts" setup>
  import Tagging from '@/components/icon/tagging.png'
  const props = defineProps<{
    title: any
  }>()
</script>

<style lang="less" scoped>
  .tips {
    width: 30px;
    color: #409eff;
    transform: translate(-12px, -2px);
  }
</style>
