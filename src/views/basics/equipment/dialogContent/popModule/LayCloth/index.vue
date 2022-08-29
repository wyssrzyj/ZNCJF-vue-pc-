<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 11:02:11
 * @Description: 
 * @LastEditors: lyj
-->
<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-08-17 13:38:19
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" :rules="state.prop" :inline="true" :model="formData" label-width="130px">
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item prop="forwardSpeed" label="前进速度">
          <el-input-number v-model="formData.forwardSpeed" :min="0" :max="10" controls-position="right" placeholder="请输入前进速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="uniformTension" label="匀速松紧值">
          <el-input v-model="formData.uniformTension" placeholder="请输入匀速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="slowDown" label="减速松紧值">
          <el-input v-model="formData.slowDown" placeholder="请输入减速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="creepSpeed" label="爬行速度">
          <el-input v-model="formData.creepSpeed" placeholder="请输入爬行速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="targetAngle" label="布斗目标角度">
          <el-input v-model="formData.targetAngle" placeholder="请输入布斗目标角度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="targetAngle" label="切布段速">
          <el-input-number v-model="formData.targetAngle" :min="0" :max="10" controls-position="right" placeholder="请输入切布段速" type="text" :disabled="disabled(false)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="reverseSpeed" label="后退速度">
          <el-input-number v-model="formData.reverseSpeed" :min="0" :max="10" controls-position="right" placeholder="请输入后退速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="acceleration" label="加速松紧值">
          <el-input v-model="formData.acceleration" placeholder="请输入加速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="creeping" label="爬行松紧值">
          <el-input v-model="formData.creeping" placeholder="请输入爬行松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="distance" label="爬行距离">
          <el-input v-model="formData.distance" placeholder="请输入爬行距离" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="accelerationWeight" label="加速权重">
          <el-input v-model="formData.accelerationWeight" placeholder="请输入加速权重" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="targetAngle" label="切布长度">
          <el-input-number v-model="formData.targetAngle" :min="0" controls-position="right" placeholder="请输入切布段速" type="text" :disabled="disabled(false)" />
        </el-form-item>
      </el-col>

      <div class="dialogBottom">
        <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="submitForm(formRef)">确认</el-button>
        <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="empty(formRef)">清空</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'
  import type { FormInstance } from 'element-plus'

  const formRef = ref<FormInstance>()
  const props = defineProps<{
    cancel: any //取消
    preservation: any //确认
    type: boolean //是否可用
  }>()

  const formData = reactive<any>({
    forwardSpeed: '',
    uniformTension: '',
    slowDown: '',
    creepSpeed: '',
    targetAngle: '',
    reverseSpeed: '',
    acceleration: '',
    creeping: '',
    distance: '',
    accelerationWeight: ''
  })

  const state = reactive({
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })
  const init = () => {
    // console.log('我是初始化')
    //获取接口数据赋值form
  }
  onMounted(() => {
    init()
  })

  // 是否可用
  const disabled = (type: any) => {
    return props.type === true ? true : type
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        props.preservation(formData)
      }
    })
  }

  // 取消
  const empty = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  // 取消
  const resetForm = () => {
    props.cancel()
  }
</script>
