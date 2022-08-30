<!--
 * @Author: lyj
 * @Date: 2022-08-24 17:37:15
 * @LastEditTime: 2022-08-29 10:19:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-input-number v-model="state.list.left" :disabled="props.type" class="fabricWeightInput" :min="0" :controls="false" size="large" @change="e => handleChange(e, 'left')" />~
  <el-input-number v-model="state.list.right" :disabled="props.type" class="fabricWeightInput" :min="0" :controls="false" size="large" @change="e => handleChange(e, 'right')" />

  <span class="fabricWeight-right">g/m²</span>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  const props = defineProps<{
    fabricWeight: any
    type: any
  }>()

  const state = reactive({
    list: {
      left: 0,
      right: 0
    }
  })
  const data = (list: any) => {
    if (list.left > 0 && list.left > 0) {
      props.fabricWeight(list)
    }
  }
  const handleChange = (e: number, type: string) => {
    if (type === 'left') {
      state.list.left = e
      data(state.list)
    }
    if (type === 'right') {
      state.list.right = e
      data(state.list)
    }
  }
</script>

<style>
  .fabricWeightInput {
    width: 50px;
  }
  .fabricWeight-right {
    margin-left: 10px;
  }
</style>
