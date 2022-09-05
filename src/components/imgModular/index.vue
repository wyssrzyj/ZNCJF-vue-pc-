<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-09-02 17:04:06
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <img v-if="props.img === ''" :src="state.img" alt="主图" class="emptyImg" />
  <img v-if="props.img !== ''" :src="props.img" alt="主图" class="equipmentImg" />
</template>
<script lang="ts" setup>
  import { reactive } from 'vue'

  import jackImg from '@/components/img/jack.png'
  const props = defineProps<{
    img: any
  }>()

  const state = reactive({
    img: jackImg
  })
</script>

<style>
  .equipmentImg {
    width: 75px;
    height: 75px;
  }
  .emptyImg {
    background: #bbbdbb;
    width: 75px;
    height: 75px;
    padding: 10px;
  }
</style>
