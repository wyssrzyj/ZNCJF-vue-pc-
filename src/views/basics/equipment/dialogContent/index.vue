<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-31 12:55:23
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
  <el-form ref="ruleFormRef" class="dialogContentForm" :rules="state.prop" :inline="true" :model="form" label-width="130px">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="设备图片" class="layclothImg" prop="img">
          <UploadModule v-model="form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="form.img" />
        </el-form-item>

        <el-form-item label="设备默认参数" prop="defaultParam">
          <el-icon class="proportionsLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>

          <br />
          <span v-for="(item, index) in state.title" :key="index" class="title">{{ item }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'sn'">
            <el-form-item :label="`${item.name}`" prop="sn">
              <el-input v-model="form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'name'">
            <el-form-item :label="`${item.name}`" prop="name">
              <el-input v-model="form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'relationDevice'">
            <el-form-item :label="item.name" prop="associatedEquipment" class="buttonContainer">
              <el-select v-model="form.associatedEquipment" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)">
                <el-option label="CJoo1" value="1" />
                <el-option label="PBJ001" value="2" />
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
              <el-input v-model="form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'type'">
            <el-form-item label="设备类型" prop="type" class="buttonContainer">
              <el-select v-model="form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" @change="change">
                <el-option v-for="item in state.equipmentType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'remarks'">
            <el-form-item :label="`${item.name}`" prop="remarks">
              <el-input v-model="form[item.model]" :placeholder="`请输入${item.name}`" :rows="2" type="textarea" :disabled="disable(item.disabled)" />
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

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.messageTitle" width="700px">
    <PopModule :type="state.type" :operation="operation" :form="form" :list="state.echoDefaultParam" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'

  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import { equipmentType } from '@/components/conifgs.ts'
  import UploadModule from './uploadModule/index.vue'
  import PopModule from './popModule/index.vue'
  import { isEmpty } from 'lodash'

  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const form = reactive(formData)

  const state = reactive({
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
    state.title = ''
    const data = {
      deviceType: id
    }
    proxy.$baseService.get('/jack-ics-api/device/relationDevice', data).then((res: any) => {
      // console.log('关联设备下拉列表', res)
      state.relationDevice = res.data
    })
  }

  const init = () => {
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/device/get', { id: props.row.id }).then((res: any) => {
        // console.log('编辑', res)
      })
    }

    // console.log('我是初始化', props.row.id)
    //获取接口数据赋值form
    setRelationDevice('1')
  }
  init()

  // onMounted(() => {
  // })

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }

  // 上传
  const getData = (e: any) => {
    // console.log('最终展示', e)
    if (e.type === 'img') {
      form.img = e.data
    }
  }

  // 设备类型更改
  const change = (e: any) => {
    setRelationDevice(e)
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        if (!isEmpty(form.img)) {
          form.img = form.img[0].url
        }
        // console.log('成功', form)
        proxy.$baseService.post('/jack-ics-api/device/save', form).then((res: any) => {
          // console.log(res)
          props.close('preservation')
        })
      }
    })
  }

  //设备默认参数
  const shippingMarks = () => {
    if (form.type === '1') {
      state.messageTitle = '铺布建议参数'
      state.dialogTableVisible = true
    }
    if (form.type === '3') {
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
      form.defaultParam = e.data.title
      //暂存回显数据
      state.echoDefaultParam = e.data.list

      // console.log('赋值成功', form)
      state.dialogTableVisible = false
    }
  }

  // 取消
  const resetForm = (formEl: any) => {
    props.close('cancel')
    // if (!formEl) return
    formEl.resetFields()
  }
</script>
