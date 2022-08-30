<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-18 19:09:07
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form :inline="true" :model="state.form" @keyup.enter="onSubmit()">
    <el-form-item label="床次计划号">
      <el-input v-model="state.form.name1" label-width="120px" />
    </el-form-item>
    <el-form-item label="铺布任务号">
      <el-input v-model="state.form.name2" />
    </el-form-item>
    <el-form-item label="设备名称">
      <el-input v-model="state.form.name3" />
    </el-form-item>
    <el-form-item label="任务状态">
      <el-select v-model="state.form.type" placeholder="请选择任务状态">
        <el-option label="未下发" value="1" />
        <el-option label="已下发" value="2" />
        <el-option label="进行中" value="3" />
        <el-option label="已完成" value="4" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { reactive, defineComponent } from 'vue'
  export default defineComponent({
    props: { setValue: Function },
    setup(props) {
      const state = reactive({
        form: {
          name1: '',
          name2: '',
          name3: '',
          type: ''
        }
      })
      const onSubmit = () => {
        props.setValue && props.setValue(state.form)
      }

      return { state, onSubmit }
    }
  })

  // export default {};
</script>

<style></style>
