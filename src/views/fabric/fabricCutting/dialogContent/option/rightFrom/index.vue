<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 10:58:15
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <el-form ref="formRef" class="crop-form" :rules="state.prop" :inline="true" :model="state.form" label-width="100px">
    <el-row :gutter="0">
      <el-col :span="12">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'minLevel'">
            <el-form-item :label="`${item.name}`">
              <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="ropForm" :controls="false" :min="1" :max="state.form[item.max]" type="text" @change="handleChange" />
            </el-form-item>
          </div>
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" class="ropForm" @change="handleChange">
                <template #append>{{ item.append }}</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'maxLevel'">
            <el-form-item :label="`${item.name}`">
              <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="ropForm" :controls="false" :min="state.form[item.min]" type="text" @change="handleChange" />
            </el-form-item>
          </div>
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="props.type" class="ropForm" type="text" @change="handleChange">
                <template #append>{{ item.append }}</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <!-- <div>
      <BottomTable :on-chang="onChang" :bottom-table="state.bottomTable" />
    </div> -->
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'

  // import BottomTable from './bottomTable/index.vue'

  const props = defineProps<{
    current: any
    update: any
    type: any
  }>()

  const state = reactive({
    form: formData, //form
    bottomTable: formData.bottomTable, //table
    //
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })

  // 初始
  const init = () => {
    state.form = props.current.spreadTemplateParam
    state.bottomTable = props.current.spreadTemplateParam.bottomTable
  }
  init()

  // 数据 更新
  watch(
    () => props.current,
    item => {
      // console.log(item.spreadTemplateParam.bottomTable)

      state.bottomTable = item.spreadTemplateParam.bottomTable
      state.form = item.spreadTemplateParam
    }
  )

  const handleChange = () => {
    props.update('form', state.form)
  }
  // table修改的返回值
  // const onChang = () => {
  //   props.update('table', state.bottomTable)
  // }
</script>
<style></style>
