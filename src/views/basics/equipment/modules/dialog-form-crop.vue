<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-11-03 08:58:54
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" label-position="top" :inline="true" :model="state.form">
    <!-- <div class="crop">
      <div class="cropContainer">
        <el-form-item prop="minKnifeFrequency" label="最小磨刀频率 (U/min)">
          <el-input v-model="state.form.minKnifeFrequency" placeholder="最小磨刀频率" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="knifeSpeed" label="刀速 (U/min)">
          <el-input v-model="state.form.knifeSpeed" placeholder="请输入刀速" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="minKnifeDistance" label="最小磨刀距离 (mm)">
          <el-input v-model="state.form.minKnifeDistance" placeholder="最小磨刀距离" type="text" :disabled="disabled(false)" />
        </el-form-item>
      </div>
      <div class="cropContainer">
        <el-form-item prop="maxKnifeFrequency" label="刀频 (U/min)">
          <el-input v-model="state.form.maxKnifeFrequency" placeholder="请输入刀频" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="knifeAngle" label="提刀角度 (°)">
          <el-input v-model="state.form.knifeAngle" placeholder="请输入提刀角度" type="text" :disabled="disabled(false)" />
        </el-form-item>
        <el-form-item prop="emptyRatio" label="真空率 (%)">
          <el-input v-model="state.form.emptyRatio" placeholder="请输入真空率" type="text" :disabled="disabled(false)" />
        </el-form-item>
      </div>
    </div> -->

    <UploadModule :disabled="disable(false)" :type="'currencyFile'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload" />

    <div class="dialogBottom">
      <el-button type="primary" :disabled="disabled(false)" class="preservation" @click="submitForm(formRef)">确认</el-button>
      <div class="empty" @click="empty(formRef)">清空</div>
      <el-button @click="resetForm()">取消</el-button>
    </div>
    <!-- </el-col> -->
    <!-- </el-row> -->
  </el-form>
</template>

<script lang="ts" setup>
  import type { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'
  import { reactive, ref, getCurrentInstance, watch } from 'vue'

  import UploadModule from '@/components/upload/index.vue'

  import { crop } from './conifgs'
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

  //上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    pictureType: { accept: ' .xpr', availableSuffix: ' xpr' },
    api: '/jack-ics-api/oss/upload'
  })

  const state: any = reactive({
    form: {
      // minKnifeFrequency: '',
      // knifeSpeed: '',
      // minKnifeDistance: '',
      // maxKnifeFrequency: '',
      // knifeAngle: '',
      // emptyRatio: '',

      attachmentList: ''
    },
    dialogTableVisible: false
  })

  const init = () => {
    try {
      let id = props.row.id

      if (id === undefined) {
        state.form = props.list
      } else {
        proxy.$baseService.get('/jack-ics-api/cutDefaultParam/get', { deviceId: id }).then((res: any) => {
          if (!isEmpty(res.data)) {
            //回显~
            let arr = res.data
            if (isEmpty(arr.attachmentList)) {
              if (arr.paramFileName) {
                arr.attachmentList = [
                  {
                    name: arr.paramFileName,
                    response: {
                      data: { src: arr.paramFile }
                    }
                  }
                ]
              } else {
                arr.attachmentList = []
              }
            }

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

  // 通用上传
  const getAttachmentList = (e: any) => {
    if (e.type === 'currencyFile') {
      if (!isEmpty(e.data)) {
        console.log('e.data', e.data)

        // let data = props.current
        state.form.attachmentList = e.data
        state.form.paramFileName = e.data[0].name
        state.form.paramFile = e.data[0].response.data.src
        // data.cutTemplateParam = state.form
        // props.update(data)
      } else {
        console.log('清空')
        // let data = props.current
        state.form.paramFileName = ''
        state.form.paramFile = ''
        // data.cutTemplateParam = state.form
        // props.update(data)
      }
    }
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let title: any = []
        // crop.forEach(item => {
        //   if (!['', 0, undefined].includes(state.form[item.value])) {
        //     if (item.name === '提刀角度') {
        //       title.push(`${item.name}:${state.form[item.value]} ° `)
        //     }
        //     if (item.name === '真空率') {
        //       title.push(`${item.name}:${state.form[item.value]} % `)
        //     }
        //     if (item.name !== '提刀角度' && item.name !== '真空率') {
        //       title.push(`${item.name}:${state.form[item.value]} mm `)
        //     }
        //   }
        // })
        props.preservation(state.form, 'crop', title.toString())
      }
    })
  }

  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
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
