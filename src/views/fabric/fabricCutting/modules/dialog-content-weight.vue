<!--
 * @Author: lyj
 * @Date: 2022-08-24 17:37:15
 * @LastEditTime: 2022-11-07 13:34:52
 * @Description: 
 * @LastEditors: lyj
-->
<template>
   <div class="fabricWeight">
    <el-input-number v-model="state.list.left" :disabled="props.type" class="fabricWeightInput" :min="0" :controls="false" @change="(e:any) => handleChange(e, 'left')" />~
    <el-input-number v-model="state.list.right" :disabled="props.type" class="fabricWeightInput" :min="0" :controls="false" @change="(e:any) => handleChange(e, 'right')" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'

  const props = defineProps<{
    fabricWeight: any
    type: any
    data: any
  }>()

  const state: any = reactive({
    list: {
      left: '',
      right: ''
    }
  })

  const init = () => {
    state.list = props.data.fabricWeight
  }
  init()

  watch(
    () => props.data,
    item => {
      state.list = item.fabricWeight
    }
  )
  const data = (list: any) => {
    if (list.right > 0) {
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

<style lang="less" scoped>
  .fabricWeight {
    padding: 5px;
    width: 190px;
    height: 45px;
    background: #eaeaea;
    border: 1px solid #ddd;
  }
  .fabricWeightInput {
    width: 80px;
    height: 30px;
  }
  .fabricWeight-right {
    margin-left: 28px;
  }
</style>
