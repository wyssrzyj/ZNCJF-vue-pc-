<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-09-26 09:47:26
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <div class="rightForm">
    <el-form ref="formRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
      <el-row :gutter="0">
        <el-col :span="12">
          <div v-for="(item, index) in state.middle" :key="index">
            <div v-if="item.type === 'minLevel'">
              <el-form-item :label="`${item.name}`">
                <el-input-number v-model="state.form[item.model]" disabled :controls="false" :min="0" :max="state.form[item.max]" type="text" @change="handleChange" />
              </el-form-item>
            </div>

            <div v-if="item.type === null">
              <el-form-item :label="`${item.name}`">
                <div class="titleData">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" :controls="false" :min="0" :max="state.form[item.max]" type="text" />
                  <span class="titleRight">{{ item.title }}</span>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-for="(item, index) in state.right" :key="index">
            <div v-if="item.type === 'maxLevel'">
              <el-form-item :label="`${item.name}`">
                <el-input-number v-model="state.form[item.model]" :disabled="props.type" :controls="false" :min="state.form[item.min]" type="text" @change="handleChange" />
              </el-form-item>
            </div>

            <div v-if="item.type === null">
              <el-form-item :label="`${item.name}`">
                <div class="titleData">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" :controls="false" :min="0" :max="state.form[item.max]" type="text" />
                  <span class="titleRight">{{ item.title }}</span>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { customFormData } from './conifgs'

  import './index.less'
  // import BottomTable from './dialog-content-table.vue'
  const { formData, formMiddleData, formRightData, dataRule } = customFormData
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
    state.form = props.current.cutTemplateParam
    state.bottomTable = props.current.cutTemplateParam.bottomTable
  }
  init()

  // 数据 更新
  watch(
    () => props.current,
    item => {
      state.bottomTable = item.cutTemplateParam.bottomTable
      state.form = item.cutTemplateParam
    }
  )

  const handleChange = () => {
    let data = props.current
    data.cutTemplateParam = state.form
    props.update(data)
  }
</script>
