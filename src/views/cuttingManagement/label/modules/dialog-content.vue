<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-09-07 11:13:28
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" class="dialogContentForm" :rules="dataRule" :inline="true" :model="state.form" label-width="130px">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="state.form.styleImage" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="state.form.styleCode" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称">
          <el-input v-model="state.form.styleName" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图">
          <UploadModule :disabled="disable(false)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'spreadClothLevel'">
            <el-form-item :label="item.name" prop="spreadClothLevel" class="buttonContainer">
              <el-select v-model="state.form[item.model]">
                <el-option label="CJoo1" value="1" />
                <el-option label="PBJ001" value="2" />
              </el-select>
              <!-- <button class="LayButton" @click="state.dialogTableVisible = true">按钮q</button> -->
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="item.disable" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="item.disable" type="text" />
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

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="模板弹窗" width="1000px">
    <PopModule :operation="operation" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'

  import { content } from './conifgs'
  import { isEmpty, cloneDeep } from 'lodash'

  import UploadModule from './dialog-upload.vue'
  import { ElMessage } from 'element-plus'

  import PopModule from './dialog-content-dialog.vue'
  import './index.less'
  const { formData, formMiddleData, formRightData, dataRule } = content
  const { proxy } = getCurrentInstance()
  const ruleFormRef = ref<any>()

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  // const form = reactive(formData)

  const state: any = reactive({
    form: formData,
    type: props.dialogType,
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
    if (props.row) {
      proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: props.row.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.styleImage }]

        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFile.name,
            response: {
              data: {
                src: res.data.shelfFile.src
              }
            }
          }
        ]

        // console.log('获取接口数据', res.data)
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
                url: item.src,
                size: item.size,
                suffix: item.suffix
              })
            }
          })
          data.attachmentList = arr
        }

        proxy.$baseService.post('/jack-ics-api/bedPlan/save', data).then((res: any) => {
          if (res.code === 200) {
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

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
      let color = e.data.map((item: any) => {
        return item.color
      })
      e.data.map((item: any) => {
        item.type = ''
      })

      state.form.shelfList = e.data
      state.form.fabricColor = color.join('，') //颜色更新

      state.dialogTableVisible = false
    }
  }

  // 取消
  const resetForm = (formEl: any) => {
    props.close()
    // if (!formEl) return
    formEl.resetFields()
  }
</script>
