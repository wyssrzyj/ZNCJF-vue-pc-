<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-09-22 14:17:11
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <div class="bottomTable">
    <div class="bottomTable-form">
      <el-form ref="formRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
        <el-row :gutter="0">
          <el-col :span="12">
            <div v-for="(item, index) in state.middle" :key="index">
              <div v-if="item.type === 'minLevel'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number
                  disabled
                    v-model="state.form[item.model]"
                    class="fabricLayingForm"
                    :controls="false"
                    :min="1"
                    :max="state.form[item.max]"
                    type="text"
                  />
                </el-form-item>
              </div>

              <div v-if="item.type === 'forwardSpeed'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="fabricLayingForm" :controls="false" type="text" @change="handleChange" />
                </el-form-item>
              </div>

              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" @change="handleChange" />
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-for="(item, index) in state.right" :key="index">
              <div v-if="item.type === 'maxLevel'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="fabricLayingForm" :controls="false" :min="Number(state.form[item.min])+1" type="text" @change="handleChange" />
                </el-form-item>
              </div>

              <div v-if="item.type === 'backSpeed'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="fabricLayingForm" :controls="false" type="text" @change="handleChange" />
                </el-form-item>
              </div>
              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" @change="handleChange" />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <BottomTable :type="props.type" :on-chang="onChang" :bottom-table="state.bottomTable" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { customFormData } from './conifgs'

  import './index.less'
  import BottomTable from './dialog-content-table.vue'
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
    let data = props.current
    data.spreadTemplateParam = state.form
    props.update(data)
  }
  // table修改的返回值
  const onChang = (e: any) => {
    let data = props.current
    data.spreadTemplateParam.bottomTable = e
    props.update(data)
  }
</script>
