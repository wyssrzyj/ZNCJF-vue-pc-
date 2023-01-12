<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-01-04 13:19:36
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
    <div class="fabric-form">
      <el-row :gutter="20" style="margin: 2px 2px 0 10px">
        <el-col :span="8">
          <el-form-item label="面料图片" class="layclothImg" prop="img">
            <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
          </el-form-item>
        </el-col>
        <!-- left -->
        <el-col :span="8">
          <div v-for="(item, index) in state.middle" :key="index">
            <div v-if="item.type === 'sn'">
              <el-form-item :label="item.name" :prop="item.prop">
                <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
              </el-form-item>
            </div>
            <div v-if="item.type === 'type'">
              <el-form-item :label="item.name" :prop="item.prop">
                <el-select v-model="state.form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" @change="onchange">
                  <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <!-- <div v-if="item.type === 'antipattern'">
            <el-form-item label="需要对纹" prop="antipattern">
              <el-radio-group v-model="form.antipattern" :disabled="disable(item.disabled)" class="ml-4">
                <el-radio label="1" size="large">是</el-radio>
                <el-radio label="2" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div> -->
            <!-- <div v-if="item.type === 'looseClothFlag'">
            <el-form-item label="需要松布" prop="looseClothFlag">
              <el-radio-group v-model="state.form[item.model]" :disabled="disable(item.disabled)" class="ml-4">
                <el-radio :label="1" size="large">是</el-radio>
                <el-radio :label="2" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div> -->
            <!-- <div v-if="item.type === 'shrinkFlag'">
            <el-form-item label="需要预缩" prop="shrinkFlag">
              <el-radio-group v-model="state.form[item.model]" :disabled="disable(item.disabled)" class="ml-4">
                <el-radio :label="1" size="large">是</el-radio>
                <el-radio :label="2" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div> -->
            <div v-if="item.type === 'spreadTemplateId'">
              <el-form-item :label="`${item.name}`" :prop="item.prop">
                <div class="spreadTemplateId">
                  <Tips title="先输入类型和克重再选择" />
                </div>
                <el-select v-model="state.form[item.model]" :disabled="disable(item.disabled)" :placeholder="`请选择${item.name}`">
                  <el-option v-for="item in state.spreadTemplate" :key="item.id" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <div v-if="item.type === 'primaryFlag'">
              <el-form-item :label="`${item.name}`" :prop="item.prop">
                <el-radio-group v-model="state.form[item.model]" :disabled="disable(item.disabled)" class="ml-4">
                  <el-radio :label="1" size="large">主料</el-radio>
                  <el-radio :label="2" size="large">辅料</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <!-- right -->
        <el-col :span="8">
          <div v-for="(item, index) in state.right" :key="index">
            <div v-if="item.type === 'name'">
              <el-form-item :label="`${item.name}`" :prop="item.prop">
                <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
              </el-form-item>
            </div>

            <div v-if="item.type === 'weight'">
              <el-form-item :label="`${item.name}  (${item.append})`" :prop="item.prop">
                <el-input-number v-model="state.form[item.model]" class="equipment-number" :controls="false" :min="0" controls-position="right" :placeholder="`请输入${item.name}`" type="text" />
                <!-- <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" @change="onchange" /> -->
              </el-form-item>
            </div>

            <div v-if="item.type === 'cutTemplateId'">
              <el-form-item :label="`${item.name}`" :prop="item.prop">
                <div class="spreadTemplateId">
                  <Tips title="先输入类型和克重再选择" />
                </div>
                <el-select v-model="state.form[item.model]" :disabled="disable(item.disabled)" :placeholder="`请选择${item.name}`">
                  <el-option v-for="item in state.cutTemplate" :key="item.id" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <div v-if="item.type === 'color'">
              <el-form-item :label="`${item.name}`" prop="color">
                <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="textarea" :placeholder="`请输入${item.name}`" />
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-form-item label="其他附件">
      <div class="fabricManagement-file">
        <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
      </div>
    </el-form-item>
  </el-form>
  <div class="dialogFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>
  <!-- <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="排唛比例" width="1000px">
    <PopModule :operation="operation" :form="form" />
  </el-dialog> -->
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { ElMessage } from 'element-plus'

  import UploadModule from '@/components/upload/index.vue'
  import { fabricType } from '@/components/conifgs'
  import Tips from '@/components/tips/index.vue'

  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.less'

  const { proxy } = getCurrentInstance() as any
  const ruleFormRef = ref<any>()
  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  const state: any = reactive({
    form: formData,
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    spreadTemplate: [],
    cutTemplate: [],
    //提示信息
    prop: dataRule,
    fabricType: fabricType
  })

  // 更改格式
  const structure = (e: any) => {
    let sum: any = []
    if (!isEmpty(e)) {
      e.forEach((item: any) => {
        sum.push({
          label: item.name,
          value: item.id
        })
      })
    }
    return sum
  }

  //获取参数模板
  let getParam = (data: any) => {
    //铺布参数模板
    proxy.$baseService.get('/jack-ics-api/spreadTemplateParam/listName', data).then((res: any) => {
      if (res.code === 0) {
        state.spreadTemplate = structure(res.data)
      }
    })
    //裁床参数模板
    proxy.$baseService.get('/jack-ics-api/cutTemplateParam/listName', data).then((res: any) => {
      if (res.code === 0) {
        state.cutTemplate = structure(res.data)
      }
    })
  }

  const init = () => {
    if (props.row) {
      proxy.$baseService.get('/jack-ics-api/fabric/get', { id: props.row.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.img }]
        //类型
        res.data.type = res.data.type.toString()
        // if (res.data.primaryFlag) {
        //   radio1.value = res.data.primaryFlag
        // }

        let data = { fabricType: res.data.type, fabricWeight: res.data.weight }
        getParam(data)
        state.form = res.data
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

  const onchange = () => {
    let data = { fabricType: state.form.type, fabricWeight: state.form.weight }
    getParam(data)
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let data = cloneDeep(state.form) //防止污染
        // 图片
        if (!isEmpty(data.img)) {
          data.img = data.img[0].url
        } else {
          data.img = ''
        }
        let attachmentList: any = []

        //其他附件
        if (!isEmpty(data.attachmentList)) {
          data.attachmentList.forEach((item: any) => {
            //组件返回格式
            if (!isEmpty(item.response)) {
              attachmentList.push({
                name: item.name,
                url: item.response.data.src,
                size: item.size,
                suffix: item.response.data.extension
              })
            } else {
              // 后端返回格式
              attachmentList.push({
                name: item.name,
                url: item.url,
                size: item.size,
                suffix: item.suffix
              })
            }
          })
        }
        data.attachmentList = attachmentList
        proxy.$baseService.post('/jack-ics-api/fabric/save', data).then((res: any) => {
          if (res.data === true) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            formEl.resetFields()
            props.close('preservation')
          } else {
            ElMessage({
              message: `${res.msg}`,
              type: 'warning'
            })
          }
        })
      }
    })
  }

  // 其他附件
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      state.form.attachmentList = e.data
    }
  }
  // 取消
  const resetForm = (formEl: any) => {
    formEl.resetFields()
    props.close('cancel')
  }
</script>
<style lang="less" scoped>
  /deep/ .el-input__inner {
    text-align: left !important; //输入框左对齐
  }
</style>
