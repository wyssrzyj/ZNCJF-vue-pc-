<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-30 17:55:52
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
  <el-form ref="formRef" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item prop="minKnifeFrequency" label="最小磨刀频率">
          <el-input v-model="state.form.minKnifeFrequency" placeholder="最小磨刀频率" type="text" :disabled="disabled(false)">
            <template #append>U/min</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="knifeSpeed" label="刀速">
          <el-input v-model="state.form.knifeSpeed" placeholder="请输入刀速" type="text" :disabled="disabled(false)">
            <template #append>U/min</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="minKnifeDistance" label="最小磨刀距离">
          <el-input v-model="state.form.minKnifeDistance" placeholder="最小磨刀距离" type="text" :disabled="disabled(false)">
            <template #append> mm </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="maxKnifeFrequency" label="刀频">
          <el-input v-model="state.form.maxKnifeFrequency" placeholder="请输入刀频" type="text" :disabled="disabled(false)">
            <template #append>U/min</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="knifeAngle" label="提刀角度">
          <el-input v-model="state.form.knifeAngle" placeholder="请输入提刀角度" type="text" :disabled="disabled(false)">
            <template #append>°</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="emptyRatio" label="真空率">
          <el-input v-model="state.form.emptyRatio" placeholder="请输入真空率" type="text" :disabled="disabled(false)">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <div class="dialogBottom">
          <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="submitForm(formRef)">确认</el-button>
          <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="empty(formRef)">清空</el-button>
          <el-button @click="resetForm()">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { data } from './conifgs'
  import './index.css'
  import type { FormInstance } from 'element-plus'

  const formRef = ref<FormInstance>()
  const props = defineProps<{
    cancel: any //取消
    preservation: any //确认
    type: boolean //是否可用
  }>()
  // console.log('最子项', props.type)

  // const formData = reactive<any>({
  //   minKnifeFrequency: '',
  //   knifeSpeed: '',
  //   minKnifeDistance: '',
  //   creepSpeed: '',
  //   targetAngle: '',
  //   maxKnifeFrequency: '',
  //   knifeAngle: '',
  //   emptyRatio: '',
  //   distance: '',
  //   accelerationWeight: ''
  // })

  const state = reactive({
    form: {
      minKnifeFrequency: '',
      knifeSpeed: '',
      minKnifeDistance: '',
      creepSpeed: '',
      targetAngle: '',
      maxKnifeFrequency: '',
      knifeAngle: '',
      emptyRatio: '',
      distance: '',
      accelerationWeight: ''
    },
    dialogTableVisible: false
    //提示信息
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
        let title: any = []
        data.forEach(item => {
          // if (state.form[item.value] !== '' && state.form[item.value] !== 0 && state.form[item.value] !== undefined) {
          if (!['', 0, undefined].includes(state.form[item.value])) {
            title.push(`${item.name}:${state.form[item.value]}`)
          }
        })

        props.preservation(state.form, 'crop', title.toString())
      }
    })
  }
  // 清空
  const empty = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  // 取消
  const resetForm = () => {
    props.cancel()
  }
</script>
