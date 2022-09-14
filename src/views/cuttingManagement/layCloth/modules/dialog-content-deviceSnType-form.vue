<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-12 15:05:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" :inline="true" :model="state.form" @keyup.enter="onSubmit()">
    <el-form-item  prop="spec" label="设备型号">
      <el-input v-model="state.form.spec" label-width="30px" />
    </el-form-item>
    <el-form-item  prop="sn" label="设备编号">
      <el-input v-model="state.form.sn" label-width="30px" />
    </el-form-item>
    <el-form-item  prop="name" label="设备名称">
      <el-input v-model="state.form.name" label-width="30px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary"   @click="empty(formRef)">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive,  ref } from 'vue'
  const formRef = ref()
  const props = defineProps<{
    setValue: any
  }>()

  const state = reactive({
    form: {
      spec: '',
      sn: '',
      name: ''
    },
    dialogTableVisible: false
  })

  const onSubmit = () => {
    props.setValue && props.setValue(state.form)
  }
  // 清空
  const empty = (formEl:any) => {
    if (!formEl) return
    formEl.resetFields()
  }
</script>

<style></style>
