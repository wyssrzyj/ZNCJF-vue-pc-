<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-31 12:49:46
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <el-form ref="ruleFormRef" class="dialogContentForm" :rules="state.prop" :inline="true" :model="form" label-width="130px">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="form.styleImage" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="form.styleImage" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="form.styleCode" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称" prop="styleName">
          <el-input v-model="form.styleName" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图" prop="shelfFile">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getData" :value="form.shelfFile" :upload="upload.shelfFile" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="form.attachmentList" :upload="upload.attachmentList" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'produceOrderCode'">
            <el-form-item label="生产订单" prop="produceOrderCode">
              <el-input v-model="form.produceOrderCode" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'fabricColor'">
            <el-form-item label="面料颜色" prop="fabricColor">
              <el-input v-model="form.fabricColor" placeholder="模板：红，蓝 " :disabled="disable(item.disabled)" type="text">
                <template #append>
                  <el-tooltip class="box-item" effect="dark" content=" 模板：红，蓝  【如有多种颜色 按,分隔】" placement="right-start">
                    <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'shelfWidth'">
            <el-form-item label="唛架门幅" prop="shelfWidth">
              <el-input v-model="form.shelfWidth" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'spreadClothLevel'">
            <el-form-item label="铺布层数" prop="spreadClothLevel">
              <el-input-number v-model="form.spreadClothLevel" :disabled="disable(item.disabled)" controls-position="right" :min="1" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="item.model" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'styleBedNo'">
            <el-form-item :label="`${item.name}`" prop="styleBedNo">
              <el-input v-model="form.styleBedNo" :disabled="disable(item.disabled)" type="text">
                <template #append>
                  <el-tooltip class="box-item" effect="dark" content="数字 自动生成 生成规则：一个款式根据床次计划数量从1开始+1  不可修改 " placement="right-start">
                    <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'fabricName'">
            <el-form-item :label="item.name" prop="fabricName" class="buttonContainer">
              <el-select v-model="form.fabricName" :disabled="disable(item.disabled)">
                <el-option label="CJoo1" value="1" />
                <el-option label="PBJ001" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'shelfLength'">
            <el-form-item :label="`${item.name}`" prop="shelfLength">
              <el-input v-model="form.shelfLength" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'spreadClothLength'">
            <el-form-item :label="`${item.name}`" prop="spreadClothLength">
              <el-input v-model="form.spreadClothLength" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'shelfIdList'">
            <el-form-item :label="`${item.name}`" prop="shelfIdList">
              <el-icon class="proportionsLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>
              <el-tooltip class="box-item" effect="dark" content="维护排唛比例后生成总件数机损耗率" placement="right-start">
                <el-icon class="proportionsRight" :size="20"><QuestionFilled /></el-icon>
              </el-tooltip>
            </el-form-item>
          </div>
          <div v-if="item.type === 'lossRate'">
            <el-form-item :label="`${item.name}`" class="buttonContainer">
              <el-input v-model="item.model" :disabled="disable(item.disabled)" type="text" />

              <!-- <button class="LayButton">按钮w</button> -->
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="item.model" :disabled="disable(item.disabled)" type="text" />
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

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="排唛比例" width="1000px">
    <PopModule :operation="operation" :form="form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import UploadModule from './uploadModule/index.vue'
  import { ElMessage } from 'element-plus'
  import PopModule from './popModule/index.vue'

  const ruleFormRef = ref<any>()

  const props = defineProps<{
    dialogType: boolean
    close: any
  }>()

  const form = reactive(formData)

  const state = reactive({
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
  })

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  const init = () => {
    // console.log('我是初始化')
    //获取接口数据赋值form
  }
  onMounted(() => {
    init()
  })

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }

  // 上传
  const getData = (e: any) => {
    if (e.type === 'styleImage') {
      form.styleImage = e.data[0].url
    }
    if (e.type === 'file') {
      form.shelfFile = e.data
    }
    // console.log(e)
  }
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      form.attachmentList = e.data
      // console.log('其他附件', e)
    }
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        // console.log('成功', form)
        // close()
      }
    })
  }

  //排唛比例
  const shippingMarks = () => {
    let colorTitle: any = form.fabricColor
    let spreadClothLevel = false
    let fabricColor = false
    // 铺布层数
    if (Number(form.spreadClothLevel) > 0) {
      spreadClothLevel = true
    } else {
      ElMessage({
        message: '铺布层数不可为空',
        type: 'warning'
      })
    }
    // 面料颜色
    if (colorTitle) {
      let data = colorTitle.split('，')

      if (data.length === 1) {
        fabricColor = true
      }

      if (data.length > 1) {
        let pattern = /([a-zA-Z0-9]+，?)+|[\u4e00-\u9fa5]，/
        if (pattern.test(colorTitle)) {
          fabricColor = true
        } else {
          ElMessage({
            message: '请按照模板写法',
            type: 'warning'
          })
        }
      }
    } else {
      ElMessage({
        message: '面料颜色不可为空',
        type: 'warning'
      })
    }

    if (spreadClothLevel === true && fabricColor === true) {
      state.dialogTableVisible = true
    }
  }

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
      //获取子项数据 shelfIdList
      form.shelfIdList = e.data
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
