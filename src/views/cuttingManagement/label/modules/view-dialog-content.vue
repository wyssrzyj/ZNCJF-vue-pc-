<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2023-03-23 16:47:57
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <div>
    <el-form ref="ruleFormRef" class="cropForm" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
      <!-- top  -->
      <div class="label-top">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="state.form.styleImage" :disabled="disable(true)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>
        <div class="top-input">
          <el-form-item label="款式编号">
            <el-input v-model="state.form.styleCode" :disabled="disable(true)" placeholder="请输入款式编号" type="text" />
          </el-form-item>
          <el-form-item label="款式名称" prop="styleName">
            <el-input v-model="state.form.styleName" :disabled="disable(true)" placeholder="请输入款式名称" type="text" />
          </el-form-item>
        </div>
        <div class="top-shelfFile">
          <el-form-item label="唛架图" prop="shelfFile">
            <UploadModule :disabled="disable(true)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" :width="57" />
          </el-form-item>
        </div>
      </div>
      <!-- 内容 -->
      <div>
        <el-row :gutter="20" style="margin: 2px 2px 0 10px">
          <!-- left -->
          <el-col :span="8">
            <div v-for="(item, index) in state.left" :key="index">
              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
                </el-form-item>
              </div>
              <div v-if="item.type === 'time'" class="label-time">
                <el-form-item :label="`${item.name}`">
                  <el-date-picker v-model="state.form[item.model]" disabled value-format="x" type="datetime" placeholder="计划开始时间" format="YYYY-MM-DD HH:mm" @change="setTime" />
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div v-for="(item, index) in state.middle" :key="index">
              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
                </el-form-item>
              </div>
              <div v-if="item.type === 'shelfWidth'">
                <el-form-item :label="`${item.name} (mm)`">
                  <el-input-number v-model="state.form[item.model]" class="label-number" :controls="false" :precision="0" controls-position="right" :min="0" disabled />
                </el-form-item>
              </div>
              <div v-if="item.type === 'resourceSn'">
                <el-form-item :label="`${item.name}`" prop="resourceSn">
                  <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
                </el-form-item>
              </div>
              <div v-if="item.type === 'time'" class="label-time">
                <el-form-item :label="`${item.name}`">
                  <el-date-picker v-model="state.form[item.model]" disabled type="datetime" placeholder="计划结束时间" format="YYYY-MM-DD HH:mm" value-format="x" @change="setTime" />
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
              <div v-if="item.type === 'number'">
                <el-form-item :label="`${item.name} (mm)`">
                  <el-input-number v-model="state.form[item.model]" class="label-number" :controls="false" :precision="0" controls-position="right" :min="0" disabled />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-form-item label="其他附件">
        <div class="label-file">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
        </div>
      </el-form-item>
    </el-form>
    <div class="labelFoot">
      <el-button @click="resetForm()"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
      <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'

  import emits from '@njpCommon/utils/emits'
  import { EMitt } from '@njpCommon/constants/enum'

  import UploadModule from '@/components/upload/index.vue'

  import { content } from './conifgs'
  import './index.less'
  const { formData, formLeftData, formMiddleData, formRightData, dataRule } = content
  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance() as any

  const route = useRoute()
  const router = useRouter()

  const state: any = reactive({
    form: formData,
    type: false,
    left: formLeftData,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    effectiveArea: 100 //有效面积
  })

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  const init = () => {
    state.type = route.query.typeValue === 'true' ? true : false

    //数据回显
    if (route.query.id) {
      proxy.$baseService.get('/jack-ics-api/pasteTask/get', { taskId: route.query.id }).then((res: any) => {
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

  //时间
  const setTime = (e: any) => {}

  // 取消
  const resetForm = () => {
    emits.emit(EMitt.OnCloseCurrTab)
    router.push('/cuttingManagement/label') //跳转到列表
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

        data.bedPlanId = route.query.bedPlanId
        data.id = route.query.id
        data.deviceId = route.query.deviceId

        proxy.$baseService.post('/jack-ics-api/pasteTask/save', data).then((res: any) => {
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
  .cropForm {
    display: block !important;
  }
  .label-file {
    width: 83vw;
    height: 170px;
  }

  /deep/ .el-input {
    width: 300px;
  }
  .label-number {
    // width: 19vw;
    /deep/ .el-input__inner {
      width: 16.5vw;
      text-align: left !important; //输入框左对齐
    }
  }

  /deep/.el-input__inner {
    width: 17vw;
  }
  .top-input {
    margin-left: 20px;
  }
  .top-shelfFile {
    margin-left: 50px;
  }
  .label-top {
    display: flex;
  }
  .label-time {
    /deep/.el-input__wrapper {
      width: 18vw !important;
    }
  }
</style>
