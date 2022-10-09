<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-10-09 11:45:16
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
                  <el-input-number v-model="state.form[item.model]" disabled class="fabricLayingForm" :controls="false" :min="1" :max="state.form[item.max]" type="text" />
                </el-form-item>
              </div>

              <div v-if="item.type === 'forwardSpeed'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="fabricLayingForm" :controls="false" type="text" @change="handleChange" />
                  <span class="fabricLayingCompany">mm/s</span>
                </el-form-item>
              </div>

              <div v-if="item.type === 'crawlSpeed'">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" @change="handleChange">
                    <template #append>mm/s</template>
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="item.type === 'angle'">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" @change="handleChange">
                    <template #append>°</template>
                  </el-input>
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
                <el-form-item :label="`${item.name}`" :prop="item.prop">
                  <!-- :model-value="state.form[item.model]" -->
                  <!-- <span>{{ state.form[item.model] }}</span>
                  <span>{{ state.form.maxLevel }}</span> -->
                  <el-input-number
                    v-model="state.form[item.model]"
                    :disabled="props.type"
                    class="fabricLayingForm"
                    :controls="false"
                    :min="Number(state.form[item.min]) + 1"
                    :value-on-clear="Number(state.form[item.min]) + 2"
                    type="text"
                    @change="handleChange"
                  />
                </el-form-item>
              </div>

              <div v-if="item.type === 'backSpeed'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" class="fabricLayingForm" :controls="false" type="text" @change="handleChange" />
                  <span class="fabricLayingCompany">mm/s</span>
                </el-form-item>
              </div>
              <div v-if="item.type === 'crawlDistance'">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="props.type" type="text" @change="handleChange">
                    <template #append>mm</template>
                  </el-input>
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
  import { reactive, watch, nextTick, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import './index.less'
  import { customFormData } from './conifgs'
  import BottomTable from './dialog-content-table.vue'
  const { formData, formMiddleData, formRightData, dataRule } = customFormData
  const props = defineProps<{
    current: any
    update: any
    type: any
  }>()

  const state: any = reactive({
    form: formData, //form
    bottomTable: formData.bottomTable, //table
    oldMaxLevel: 0, //最大层数的旧值
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
      state.bottomTable = item.spreadTemplateParam.bottomTable
      if (item.spreadTemplateParam.MaxLevelType === true) {
        //数据超出 使用下一层的最小值-1
        state.form = item.spreadTemplateParam
        state.form.maxLevel =Number (state.form.max)-1
      } else {
        state.form = item.spreadTemplateParam
      }
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
