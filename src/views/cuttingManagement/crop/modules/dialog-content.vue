<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-09-09 17:26:16
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="state.form.styleImage" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="state.form.styleCode" :disabled="disable(true)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称" prop="styleName">
          <el-input v-model="state.form.styleName" :disabled="disable(true)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图" prop="shelfFile">
          <UploadModule :disabled="disable(true)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'spreadClothLevel'">
            <el-form-item :label="`${item.name}`" prop="spreadClothLevel">
              <div class="level">
                <el-input v-model="state.form[item.model]" class="cropInput" :disabled="disable(item.disabled)" type="text" />
                <el-icon class="proportionsLeft" :size="30" @click="state.dialogTableVisible = true"><Edit /></el-icon>
              </div>
            </el-form-item>
          </div>

          <div v-if="item.type === 'time'">
            <el-form-item :label="`${item.name}`">
              <el-date-picker v-model="state.form[item.model]" type="datetime" placeholder="计划开始时间" format="YYYY/MM/DD hh:mm:ss" value-format="x" @change="setTime" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'time'">
            <el-form-item :label="`${item.name}`">
              <el-date-picker v-model="state.form[item.model]" type="datetime" placeholder="计划结束时间" format="YYYY/MM/DD hh:mm:ss" value-format="x" @change="setTime" />
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

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.messageTitle" width="700px">
    <Crop :list="props.list" :row="state.form" :type="false" :cancel="cancel" :preservation="preservation" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'

  import { content } from './conifgs'

  import UploadModule from './dialog-upload.vue'
  import { ElMessage } from 'element-plus'
  import './index.less'
  import Crop from './dialog-form-crop.vue'

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
    //提示信息
    prop: dataRule,
    messageTitle: '裁剪建议参数',
    effectiveArea: 100 //有效面积
  })

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  const init = () => {
    //数据回显
    if (props.row) {
      proxy.$baseService.get('/jack-ics-api/cutTask/get', { taskId: props.row.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.styleImage }]
        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFileName,
            response: {
              data: {
                src: res.data.shelfFileUrl
              }
            }
          }
        ]
        ;(res.data.deviceSn = 1), //设备编号测试~
          (state.form = res.data)
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
      state.form.styleImage = e.data
    }
    //唛架图
    if (e.type === 'shelfFile') {
      // console.log(e.data);

      state.form.shelfFile = e.data
    }
  }

  // 其他附件
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      state.form.attachmentList = e.data
    }
  }

  // const setUtilization = () => {
  //   // (铺布长度*唛架门幅)
  //   let product = state.form.spreadClothLength * state.form.shelfWidth
  //   state.form.attritionRate = state.effectiveArea / product
  // }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let data = cloneDeep(state.form) //防止污染
        // 图片
        if (!isEmpty(data.styleImage)) {
          data.styleImage = data.styleImage[0].url
        }
        // 唛架图处理
        if (!isEmpty(data.shelfFile)) {
          let shelfFile = {
            name: data.shelfFile[0].name,
            url: data.shelfFile[0].response.data.src
          }
          data.shelfFile = shelfFile
        }

        //其他附件
        if (!isEmpty(data.attachmentList)) {
          let arr: any = []

          data.attachmentList.forEach((item: any) => {
            //组件返回格式
            if (!isEmpty(item.response)) {
              arr.push({
                name: item.name,
                url: item.response.data.src,
                size: item.size,
                suffix: item.response.data.extension
              })
            } else {
              // 后端返回格式
              arr.push({
                name: item.name,
                url: item.url,
                size: item.size,
                suffix: item.suffix
              })
            }
          })
          data.attachmentList = arr
        }

        proxy.$baseService.post('/jack-ics-api/cutTask/save', data).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            formEl.resetFields()
            props.close()
          } else {
            // console.log(res.msg)
          }
        })
      }
    })
  }

  // 取消
  const resetForm = (formEl: any) => {
    props.close()
    // if (!formEl) return
    formEl.resetFields()
  }

  // ------------------

  // 取消
  const cancel = () => {
    state.dialogTableVisible = false
  }
  //确认
  const preservation = (e: any, type: string, title: any) => {
    state.form.cutTaskParam = e //赋值

    state.dialogTableVisible = false
  }
</script>
