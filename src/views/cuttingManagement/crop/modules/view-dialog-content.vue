<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2023-01-10 11:12:24
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <Demo />
  <el-form ref="ruleFormRef" class="cropForm" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <el-col :span="6">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="state.form.styleImage" :disabled="disable(true)" :type="'img'" :get-data="getData" :value="state.form" />
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
      </el-col>
      <el-col :span="6">
        <div v-for="(item, index) in state.left" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === 'time'">
            <el-form-item :label="`${item.name}`">
              <el-date-picker
                v-model="state.form[item.model]"
                class="crop-number"
                :disabled="disable(item.disabled)"
                value-format="x"
                type="datetime"
                placeholder="计划开始时间"
                format="YYYY-MM-DD HH:mm"
              />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === 'number'">
            <el-form-item :label="`${item.name} (mm)`">
              <el-input-number v-model="state.form[item.model]" class="crop-number" :controls="false" :precision="0" controls-position="right" :min="0" disabled />
            </el-form-item>
          </div>

          <div v-if="item.type === 'deviceSn'">
            <el-form-item :label="`${item.name}`" prop="deviceSn">
              <!-- <div class="level"> -->
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
              <!-- <el-input v-model="state.form[item.model]" class="cropInput" :disabled="disable(item.disabled)" type="text" /> -->
              <el-icon class="proportionsLeft" :size="30" @click="state.dialogTableVisible = true"><Edit /></el-icon>
              <!-- </div> -->
            </el-form-item>
          </div>
          <div v-if="item.type === 'time'">
            <el-form-item :label="`${item.name}`">
              <el-date-picker
                v-model="state.form[item.model]"
                class="crop-number"
                :disabled="disable(item.disabled)"
                type="datetime"
                placeholder="计划结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="x"
              />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === 'number'">
            <el-form-item :label="`${item.name} (mm)`">
              <el-input-number v-model="state.form[item.model]" class="crop-number" :controls="false" :precision="0" controls-position="right" :min="0" disabled />
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-form-item label="其他附件">
      <div class="crop-file">
        <UploadModule :disabled="disable(true)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
      </div>
    </el-form-item>
  </el-form>

  <div class="cropFoot">
    <el-button @click="resetForm()"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">保存并返回</el-button>
  </div>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :draggable="false" :title="state.messageTitle" width="700px">
    <Crop :row="state.form" :type="props.dialogType" :cancel="cancel" :preservation="preservation" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { isEmpty, cloneDeep } from 'lodash'
  import { ElMessage } from 'element-plus'

  import emits from '@njpCommon/utils/emits'
  import { EMitt } from '@njpCommon/constants/enum'

  import UploadModule from '@/components/upload/index.vue'
  import { content } from './conifgs'
  import Demo from './demo.vue'

  import './index.less'
  import Crop from './dialog-form-crop.vue'

  const { formData, formMiddleData, formLeftData, formRightData, dataRule } = content
  const ruleFormRef = ref<any>()
  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const state: any = reactive({
    form: formData,
    type: false,
    left: formLeftData,
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
    //初始设置数据
    state.type = route.query.typeValue === 'true' ? true : false

    //数据回显
    if (route.query.id) {
      proxy.$baseService.get('/jack-ics-api/cutTask/get', { taskId: route.query.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.styleImage }]
        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFileName,
            shelfImage: res.data.shelfImage,
            response: {
              data: {
                src: res.data.shelfFileUrl
              }
            }
          }
        ]
        // (res.data.deviceSn = 1), //设备编号测试~
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
      state.form.styleImage = e.data
    }
    //唛架图
    if (e.type === 'shelfFile') {
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

  // 取消
  const resetForm = () => {
    emits.emit(EMitt.OnCloseCurrTab)
    router.push('/cuttingManagement/crop') //跳转到列表
  }

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
            resetForm()
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

  // ------------------

  // 取消
  const cancel = () => {
    state.dialogTableVisible = false
  }
  //确认
  const preservation = (e: any) => {
    state.form.cutTaskParam = e //赋值

    state.dialogTableVisible = false
  }
</script>
<style scoped lang="less">
  .layCloth-row {
    .el-input {
      width: 100px !important;
    }
    .spreadClothLength {
      margin-left: 44px;
    }
    span {
      width: 58px;
      text-align: center;
      background-color: #eaeaea;
      display: inline-block;
    }
  }
  .setting {
    cursor: pointer;
  }
  .crop-number {
    width: 20vw;
    /deep/ .el-input__inner {
      text-align: left !important; //输入框左对齐
    }
  }
  /deep/.el-input__inner {
    width: 17vw;
  }
</style>
