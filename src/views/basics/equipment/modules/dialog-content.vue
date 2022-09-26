<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-09-23 14:02:59
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="设备图片" class="layclothImg" prop="img">
          <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>

        <el-form-item label="设备默认参数" prop="defaultParam" class="log-defaultParam">
          <el-icon class="proportionsLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>
          <br />

          <span v-for="(item, index) in state.title" :key="index" class="title">{{ item }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'sn'">
            <el-form-item :label="`${item.name}`" prop="sn">
              <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'name'">
            <el-form-item :label="`${item.name}`" prop="name">
              <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'relationDevice'">
            <el-form-item :label="item.name" prop="relationDevice" class="buttonContainer">
              <el-select v-model="state.form.relationDevice" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)">
                <el-option v-for="(item, index) in state.relationDevice" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <template #append>
                <el-tooltip class="box-item" effect="dark" content="铺布机关联贴标机  贴标机关联裁床 " placement="right-start">
                  <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'spec'">
            <el-form-item :label="`${item.name}`" prop="spec">
              <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'type'">
            <el-form-item label="设备类型" prop="type" class="buttonContainer">
              <el-select v-model="state.form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" @change="change">
                <el-option v-for="item in state.equipmentType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'remark'">
            <el-form-item :label="`${item.name}`" prop="remark">
              <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :rows="2" type="textarea" :disabled="disable(item.disabled)" />
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dialogBottom">
      <el-button type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-form>

  <el-dialog :draggable="false"  v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.messageTitle" width="700px">
    <DialogForms :list="state.echoDefaultParam" :row="props.row" :type="state.type" :operation="operation" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'

  import { QuestionFilled } from '@element-plus/icons-vue'
  import { equipmentType } from '@/components/conifgs.ts'

  import UploadModule from './dialog-upload.vue'
  import DialogForms from './dialog-forms.vue'
  import { content } from './conifgs'

  import './index.less'

  const { formData, formMiddleData, formRightData, dataRule } = content

  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const state: any = reactive({
    form: formData,
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    equipmentType: equipmentType,
    title: '',
    echoDefaultParam: {}, //设备默认参数未保存暂存回显数据
    //提示信息
    prop: dataRule,
    messageTitle: '铺布建议参数',
    relationDevice: []
  })

  //获取关联设备
  const setRelationDevice = (id: any) => {
    state.form.associatedEquipment = '' //将选中的清空
    state.title = ''
    const data = {
      deviceType: id
    }

    proxy.$baseService.get('/jack-ics-api/device/relationDevice', data).then((res: any) => {
      if (!isEmpty(res.data)) {
        let list: any = []
        res.data.forEach((item: any) => {
          list.push({
            label: item.name,
            value: item.id
          })
        })

        state.relationDevice = list
      } else {
        state.relationDevice = []
      }
    })
  }

  const init = () => {
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/device/get', { id: props.row.id }).then((res: any) => {
        res.data.type = res.data.type.toString()
        setRelationDevice(res.data.type)

        res.data.img = res.data.img !== '' ? [{ url: res.data.img }] : []

        state.form = res.data

        let arr = res.data.defaultParam.split(',')
        state.title = arr
      })
    }
  }
  init()

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }

  // 上传
  const getData = (e: any) => {
    if (e.type === 'img') {
      if (!isEmpty(e.data)) {
        // console.log(e.data)

        state.form.img = e.data
      } else {
        state.form.img = ''
      }
    }
  }

  // 设备类型更改
  const change = (e: any) => {
    setRelationDevice(e)

    state.echoDefaultParam = {}
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        if (!isEmpty(state.form.img)) {
          state.form.img = state.form.img[0].url
        }else{
          state.form.img = ''
        }

        proxy.$baseService.post('/jack-ics-api/device/save', state.form).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            formEl.resetFields()
            props.close('preservation')
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    })
  }

  //设备默认参数
  const shippingMarks = () => {
    if (state.form.type === '') {
      ElMessage({
        message: '请选择设备类型',
        type: 'warning'
      })
    }

    if (state.form.type === '2') {
      ElMessage({
        message: '贴标暂无设备默认参数',
        type: 'warning'
      })
    }
    if (state.form.type === '1') {
      state.messageTitle = '铺布建议参数'
      state.dialogTableVisible = true
    }
    if (state.form.type === '3') {
      state.messageTitle = '裁剪建议参数'
      state.dialogTableVisible = true
    }
  }

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
      let arr = e.data.title.split(',')
      state.title = arr
      state.form.defaultParam = e.data.title

      // 新增的时候 需要传递一个设备默认保存返回的id
      state.form.paramId = e.data.paramId

      //暂存回显数据
      state.echoDefaultParam = e.data.list

      // console.log('赋值成功', form)
      state.dialogTableVisible = false
    }
  }

  // 取消
  const resetForm = (formEl: any) => {
    formEl.resetFields()
    props.close('cancel')
  }
</script>
