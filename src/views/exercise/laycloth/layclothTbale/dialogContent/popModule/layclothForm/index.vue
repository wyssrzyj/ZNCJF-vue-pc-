<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-18 15:40:43
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form :inline="true" :model="state.form" @keyup.enter="onSubmit()">
    <el-form-item label="设备编号">
      <el-input v-model="state.form.name1" label-width="120px" />
    </el-form-item>
    <el-form-item label="设备名称">
      <el-input v-model="state.form.name2" />
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
