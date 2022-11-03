<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-10-26 13:49:14
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" :inline="true" :model="state.form" @keyup.enter="onSubmit()">
    <el-form-item prop="produceOrderCode" label="生产订单">
      <el-input v-model="state.form.produceOrderCode" label-width="30px" />
    </el-form-item>
    <el-form-item prop="bedPlanNo" label="床次">
      <el-input v-model="state.form.bedPlanNo" label-width="30px" />
    </el-form-item>
    <el-form-item prop="styleCode" label="款式编号">
      <el-input v-model="state.form.styleCode" label-width="30px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary" @click="empty(formRef)">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  const formRef = ref()
  const props = defineProps<{
    setValue: any
  }>()

  const state = reactive({
    form: {
      produceOrderCode: '',
      bedPlanNo: '',
      styleCode: ''
    },
    dialogTableVisible: false
  })

  const onSubmit = () => {
    props.setValue && props.setValue(state.form)
  }
  // 清空
  const empty = (formEl: any) => {
    if (!formEl) return
    formEl.resetFields()
  }
</script>

<style></style>
