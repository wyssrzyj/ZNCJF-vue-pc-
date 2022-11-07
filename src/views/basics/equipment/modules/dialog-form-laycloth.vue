<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-11-07 13:46:00
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item v-for="(item, index) in state.middle" :key="index" :prop="item.prop" :label="`${item.name}${item.company}`">
          <div v-if="item.type === 'forwardSpeed'">
            <div class="equipment-forwardSpeed">
              <Tips :title="`1-10段`" />
            </div>
            <el-input-number
              v-model="state.form[item.model]"
              class="equipment-number"
              :controls="false"
              :precision="0"
              :min="0"
              :max="10"
              controls-position="right"
              :placeholder="`请输入${item.name}`"
              type="text"
              :disabled="disabled(false)"
            />
          </div>
          <div v-if="item.type !== 'forwardSpeed'">
            <el-input-number
              v-model="state.form[item.model]"
              class="equipment-number"
              :controls="false"
              :precision="0"
              :min="0"
              :max="10"
              controls-position="right"
              :placeholder="`请输入${item.name}`"
              type="text"
              :disabled="disabled(false)"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-for="(item, index) in state.right" :key="index" :prop="item.prop" :label="`${item.name}${item.company}`">
           <div v-if="item.type === 'backSpeed'">
            <div class="equipment-forwardSpeed">
              <Tips :title="`1-10段`" />
            </div>
            <el-input-number
              v-model="state.form[item.model]"
              class="equipment-number"
              :controls="false"
              :precision="0"
              :min="0"
              :max="10"
              controls-position="right"
              :placeholder="`请输入${item.name}`"
              type="text"
              :disabled="disabled(false)"
            />
          </div>
          <div v-if="item.type !== 'backSpeed'">
            <el-input-number
              v-model="state.form[item.model]"
              class="equipment-number"
              :controls="false"
              :precision="0"
              :min="0"
              :max="10"
              controls-position="right"
              :placeholder="`请输入${item.name}`"
              type="text"
              :disabled="disabled(false)"
            />
          </div>
        </el-form-item>
      </el-col>

      <div class="dialogBottom">
        <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="submitForm(formRef)">确认</el-button>
        <el-button type="warning" :disabled="disabled(false)" class="preservation" @click="empty(formRef)">清空</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'
  import { layCloth } from './conifgs'

  import Tips from '@/components/tips/index.vue'

  import './index.less'

  const { proxy } = getCurrentInstance() as any
  const formRef = ref<FormInstance>()
  const props = defineProps<{
    cancel: any //取消
    preservation: any //确认
    type: boolean //是否可用
    row: any
    list: any
  }>()

  let { formMiddleData, formRightData, dataRule, data, formData } = layCloth
  const state = reactive({
    form: formData,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })

  const init = () => {
    try {
      let id = props.row.id
      //判断id是否为空≈【新增】
      if (id === undefined) {
        state.form = props.list
      } else {
        proxy.$baseService.get('/jack-ics-api/spreadDefaultParam/get', { deviceId: id }).then((res: any) => {
          if (!isEmpty(res.data)) {
            state.form = res.data
          }
        })
      }
    } catch (error) {}
  }

  init()

  // 是否可用
  const disabled = (type: any) => {
    return props.type === true ? true : type
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let title: any = []
        data.forEach((item: any) => {
          if (!['', 0, undefined, null].includes(state.form[item.value])) {
            title.push(`${item.name}:${state.form[item.value]}`)
          }
        })

        props.preservation(state.form, 'layCloth', title.toString())
      }
    })
  }

  //清空
  const empty = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  // 取消
  const resetForm = () => {
    props.cancel()
  }
</script>
