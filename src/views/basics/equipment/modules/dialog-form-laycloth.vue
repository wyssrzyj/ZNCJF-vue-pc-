<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-09-01 18:00:19
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item prop="forwardSpeed" label="前进速度">
          <el-input-number v-model="state.form.forwardSpeed" :min="0" :max="10" controls-position="right" placeholder="请输入前进速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="uniformTightness" label="匀速松紧值">
          <el-input v-model="state.form.uniformTightness" placeholder="请输入匀速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="reduceTightness" label="减速松紧值">
          <el-input v-model="state.form.reduceTightness" placeholder="请输入减速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="crawlSpeed" label="爬行速度">
          <el-input v-model="state.form.crawlSpeed" placeholder="请输入爬行速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="angle" label="布斗目标角度">
          <el-input v-model="state.form.angle" placeholder="请输入布斗目标角度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="cutSpeed" label="切布段速">
          <el-input-number v-model="state.form.cutSpeed" :min="0" :max="10" controls-position="right" placeholder="请输入切布段速" type="text" :disabled="disabled(false)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="backSpeed" label="后退速度">
          <el-input-number v-model="state.form.backSpeed" :min="0" :max="10" controls-position="right" placeholder="请输入后退速度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="accelerationTightness" label="加速松紧值">
          <el-input v-model="state.form.accelerationTightness" placeholder="请输入加速松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="crawlTightness" label="爬行松紧值">
          <el-input v-model="state.form.crawlTightness" placeholder="请输入爬行松紧值" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="crawlDistance" label="爬行距离">
          <el-input v-model="state.form.crawlDistance" placeholder="请输入爬行距离" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="accelerationWeight" label="加速权重">
          <el-input v-model="state.form.accelerationWeight" placeholder="请输入加速权重" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="cutLength" label="切布长度">
          <el-input-number v-model="state.form.cutLength" :min="0" controls-position="right" placeholder="请输入切布段速" type="text" :disabled="disabled(false)" />
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
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'
  import { layCloth } from './conifgs.ts'
  import './index.less'

  const { proxy } = getCurrentInstance()
  const formRef = ref<FormInstance>()
  let { formMiddleData, formRightData, dataRule, data } = layCloth
  const props = defineProps<{
    cancel: any //取消
    preservation: any //确认
    type: boolean //是否可用
    row: any
    list: any
  }>()

  const state = reactive({
    form: {
      forwardSpeed: '',
      uniformTightness: '',
      reduceTightness: '',
      crawlSpeed: '',
      angle: '',
      cutSpeed: '',
      backSpeed: '',
      accelerationTightness: '',
      crawlTightness: '',
      crawlDistance: '',
      accelerationWeight: '',
      cutLength: ''
    },
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })

  const init = () => {
    try {
      console.log('id', props.row.id)

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
