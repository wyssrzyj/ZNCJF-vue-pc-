<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-10-02 14:01:32
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-row :gutter="30" style="margin: 2px 2px 0 10px">
    <!-- form -->
    <el-col :span="8">
      <div>
        <el-form ref="ruleFormRef" class="dialogContentForm" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
          <el-form-item label="模板面料图片" class="layclothImg" prop="img">
            <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
          </el-form-item>
          <el-form-item label="参数模板编号" prop="sn">
            <el-input v-model="state.form.sn" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
          </el-form-item>
          <el-form-item label="参数模板名称" prop="name">
            <el-input v-model="state.form.name" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
          </el-form-item>
          <el-form-item label="面料类型" prop="fabricType">
            <el-select v-model="state.form.fabricType" :disabled="disable(false)">
              <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="面料克重" prop="fabricWeight">
            <FabricWeight v-model="state.form.fabricWeight" :data="state.form" :type="state.type" :fabric-weight="fabricWeight" />
          </el-form-item>
          <el-form-item label="关联面料">
            <RelatedFabric :form="state.form" :type="state.type" :set-fabric="setFabric" />
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <!-- 自定义 -->
    <el-col :span="16" class="dialogBottomRight">
      <Option :init-form="state.initForm" :type="state.type" :data="state.form" :get-list="getList" />
    </el-col>
    <div class="dialogBottom">
      <el-button type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)"> 确认 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-row>
</template>
<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { content } from './conifgs'
  import './index.less'
  import { ElMessage } from 'element-plus'
  import { fabricType } from '@/components/conifgs.ts'

  import UploadModule from './dialog-upload.vue'
  import FabricWeight from './dialog-content-weight.vue'
  import Option from './dialog-content-right.vue'
  import RelatedFabric from './dialog-content-fabric.vue'
  const { proxy } = getCurrentInstance()

  const ruleFormRef = ref<any>()
  const { formData, dataRule } = content

  const props = defineProps<{
    dialogType: boolean
    close: any
    current: any
    row: any
  }>()

  const state = reactive({
    form: cloneDeep(formData) ,
    initForm: cloneDeep (formData),
    type: props.dialogType,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    fabricType: fabricType
  })

  const init = () => {
    //获取接口数据赋值form
    if (!isEmpty(props.row)) {
      proxy.$baseService.get('/jack-ics-api/cutTemplateParam/get', { templateId: props.row.id }).then((res: any) => {
        let arr = res.data
        const { sn, name, fabricType, imageUrl, fabricWeightMin, fabricWeightMax } = arr.templateDTO
        //赋值
        arr.sn = sn
        arr.name = name
        arr.fabricType = fabricType
        arr.img = [{ url: imageUrl }]
        arr.fabricWeight = { left: Number(fabricWeightMin), right: Number(fabricWeightMax) }
        arr.fabricType=arr.fabricType.toString()
        state.form = arr
        state.initForm = arr
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
      state.form.img = e.data
    }
  }
  //面料克重 赋值
  const fabricWeight = (e: any) => {
    state.form.fabricWeight = e
    state.form.fabricWeightMin = e.left
    state.form.fabricWeightMax = e.right
    const cloneForm = cloneDeep(state.form)
    state.form = cloneForm
  }
  //  面料类型 赋值
  //  const change=(e:any)=>{
  //   state.form.fabricType=e
  //     const cloneForm = cloneDeep(state.form)
  //     state.form = cloneForm

  //  }
  //关联面料
  const setFabric = (e: any) => {
    state.form.relationFabricList = e
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        const { fabricType, fabricWeightMax, fabricWeightMin, img, name, sn } = state.form

        // 格式处理
        let arr = {
          templateDTO: {
            id: props.row.id,
            fabricType: Number(fabricType),
            fabricWeightMax: Number(fabricWeightMax),
            fabricWeightMin: Number(fabricWeightMin),
            imageUrl: !isEmpty(img) ? img[0].url : '',
            name: name,
            sn: sn,
            relationFabricList: !isEmpty(state.form.relationFabricList) ?state.form.relationFabricList:null
          },
          levelParamVOList: state.form.levelParamVOList
        }
        proxy.$baseService.post('/jack-ics-api/cutTemplateParam/save', arr).then((res: any) => {
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

  const getList = (e: any) => {
    state.form.levelParamVOList = e
  }
  // 取消
  const resetForm = (formEl: any) => {
    formEl.resetFields()
    props.close()
  }
</script>
