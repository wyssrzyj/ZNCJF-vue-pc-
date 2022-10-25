<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-10-24 13:51:17
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <div class="bottomTable">
    <div class="bottomTable-form">
      <el-form ref="formRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
        <el-row :gutter="0">
          <el-col :span="12">
            <div v-for="(item, index) in state.middle" :key="index">
              <div v-if="item.type === 'minLevel'">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" disabled class="fabricLaying-number" :controls="false" :min="1" :max="state.form[item.max]" type="text" />
                </el-form-item>
              </div>
              <!--  参数上传 -->
              <!-- <div v-if="item.type === 'file'" class="currencyFile">
                <el-form-item :label="`${item.name}`" :prop="item.prop">
                  <UploadModule :disabled="disable(false)" :type="'currencyFile'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload" />
                </el-form-item>
              </div> -->

              <div v-if="item.type === 'forwardSpeed'">
                <el-form-item :label="`${item.name} (段)`">
                  <el-input-number v-model="state.form[item.model]" :min="1" :max="10" :disabled="props.type" class="fabricLaying-number" :controls="false" type="text" @change="handleChange" />
                  <!-- <span class="fabricLayingCompany">段</span> -->
                </el-form-item>
              </div>

              <div v-if="item.type === 'crawlSpeed'">
                <el-form-item :label="`${item.name} (mm/s)`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" type="text" class="fabricLaying-number" :controls="false" @change="handleChange" />
                </el-form-item>
              </div>
              <div v-if="item.type === 'angle'">
                <el-form-item :label="`${item.name} (°)`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" type="text" class="fabricLaying-number" :controls="false" @change="handleChange" />
                </el-form-item>
              </div>

              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" type="text" class="fabricLaying-number" :controls="false" @change="handleChange" />
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-for="(item, index) in state.right" :key="index">
              <div v-if="item.type === 'maxLevel'">
                <el-form-item :label="`${item.name}`" :prop="item.prop">
                  <el-input-number
                    v-model="state.form[item.model]"
                    :disabled="props.type"
                    class="fabricLaying-number"
                    :controls="false"
                    :min="Number(state.form[item.min]) + 1"
                    :max="Number(state.form.maxLevelMax)"
                    :value-on-clear="Number(state.form[item.min]) + 2"
                    type="text"
                    @change="handleChange"
                  />
                </el-form-item>
              </div>
              <!-- <div v-if="item.type === 'file'">
                <el-form-item class="currencyFile" />
              </div> -->

              <div v-if="item.type === 'backSpeed'">
                <el-form-item :label="`${item.name} (段)`">
                  <el-input-number v-model="state.form[item.model]" :min="1" :max="10" :disabled="props.type" class="fabricLaying-number" :controls="false" type="text" @change="handleChange" />
                </el-form-item>
              </div>
              <div v-if="item.type === 'crawlDistance'">
                <el-form-item :label="`${item.name} (mm)`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" type="text" class="fabricLaying-number" :controls="false" @change="handleChange" />
                </el-form-item>
              </div>
              <div v-if="item.type === null">
                <el-form-item :label="`${item.name}`">
                  <el-input-number v-model="state.form[item.model]" :disabled="props.type" type="text" class="fabricLaying-number" :controls="false" @change="handleChange" />
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 暂时隐藏 2022-10-13 10.20 -->
    <!-- <div>
      <BottomTable :type="props.type" :on-chang="onChang" :bottom-table="state.bottomTable" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  // import UploadModule from '@/components/upload/index.vue'
  import './index.less'
  import { customFormData } from './conifgs'
  // import BottomTable from './dialog-content-table.vue'
  const { formData, formMiddleData, formRightData, dataRule } = customFormData
  const props = defineProps<{
    current: any
    update: any
    type: any
  }>()

  const state: any = reactive({
    form: formData, //form
    bottomTable: formData.bottomTable, //table
    //
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })

  //上传
  // const upload = reactive({
  //   shelfFile: { limit: 1, title: '最多上传一个' },
  //   pictureType: { accept: ' .xpr', availableSuffix: ' xpr' },
  //   api: '/jack-ics-api/oss/upload'
  // })

  // 初始
  const init = () => {
    state.form = props.current.spreadTemplateParam
    state.bottomTable = props.current.spreadTemplateParam.bottomTable
  }
  init()

  watch(
    () => props.current,
    item => {
      state.bottomTable = item.spreadTemplateParam.bottomTable

      let arr = item.spreadTemplateParam
      //处理参数文件回显
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

      state.form = cloneDeep(arr)
    }
  )

  const handleChange = () => {
    let data = props.current
    data.spreadTemplateParam = state.form
    props.update(data)
  }
  // table修改的返回值
  // const onChang = (e: any) => {
  //   let data = props.current
  //   data.spreadTemplateParam.bottomTable = e
  //   props.update(data)
  // }

  // 是否可用
  // const disable = (type: any) => {
  //   return state.type === true ? true : type
  // }

  // // 通用上传
  // const getAttachmentList = (e: any) => {
  //   if (e.type === 'currencyFile') {
  //     console.log(e.data)
  //     if (!isEmpty(e.data)) {
  //       let data = props.current
  //       state.form.attachmentList = e.data
  //       state.form.paramFileName = e.data[0].name
  //       state.form.paramFile = e.data[0].response.data.src
  //       data.spreadTemplateParam = state.form
  //       props.update(data)
  //     } else {
  //       let data = props.current
  //       state.form.paramFileName = ""
  //       state.form.paramFile = ""
  //       data.spreadTemplateParam = state.form
  //       props.update(data)
  //     }
  //   }
  // }
</script>
<style lang="less" scoped>
  .currencyFile {
    width: 100%;
    height: 150px;
    margin: 0 !important;
  }
</style>
