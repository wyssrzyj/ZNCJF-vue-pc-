<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-11-03 14:53:49
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="formRef" label-position="top" :inline="true" :model="state.form" label-width="130px">
    <UploadModule :disabled="disable(false)" :type="'currencyFile'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload" />
    <div class="dialogBottom">
      <el-button v-if="props.type !== true" type="primary" :disabled="disabled(false)" class="preservation" @click="submitForm(formRef)">确认</el-button>
      <!-- <el-button type="warning" :disabled="disabled(false)" class="preservation" @click="empty(formRef)">清空</el-button> -->
      <el-button @click="resetForm()">取消</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
  import type { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'
  import { reactive, ref, getCurrentInstance } from 'vue'

  import UploadModule from '@/components/upload/index.vue'

  import './index.less'

  const { proxy } = getCurrentInstance() as any
  const formRef = ref<FormInstance>()

  const props = defineProps<{
    cancel: any //取消
    preservation: any //确认
    type: boolean //是否可用
    row: any
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
      // emptyRatio: ''
      attachmentList: ''
    },
    dialogTableVisible: false
  })

  const init = () => {
    //判断 本地是否有值 cutTaskParam
    try {
      let data = {
        bedPlanId: props.row.bedPlanId,
        deviceId: props.row.deviceId,
        spreadClothLevel: props.row.spreadClothLevel
      }
      proxy.$baseService.get('/jack-ics-api/spreadTask/getParam', data).then((res: any) => {
        if (!isEmpty(res.data)) {
          let arr = res.data.cutTaskParam
          if (!isEmpty(arr)) {
            state.form.id = arr.id
            //  文件数据回显
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

            state.form = arr
          }
        }
      })
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
        props.preservation(state.form)
      }
    })
  }

  // 通用上传
  const getAttachmentList = (e: any) => {
    if (e.type === 'currencyFile') {
      if (!isEmpty(e.data)) {
        state.form.attachmentList = e.data
        state.form.paramFileName = e.data[0].name
        state.form.paramFile = e.data[0].response.data.src
      } else {
        state.form.paramFileName = ''
        state.form.paramFile = ''
      }
    }
  }

  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }

  // 清空
  // const empty = (formEl: FormInstance | undefined) => {
  //   if (!formEl) return
  //   formEl.resetFields()
  // }

  // 取消
  const resetForm = () => {
    props.cancel()
  }
</script>
