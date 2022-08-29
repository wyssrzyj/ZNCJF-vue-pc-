<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 13:23:32
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
        <el-form-item label="面料图片" class="layclothImg" prop="img">
          <UploadModule v-model="form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="form.img" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getData" :value="form.file" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'fabricNo'">
            <el-form-item label="面料编号" prop="fabricNo">
              <el-input v-model="form.fabricNo" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'fabricType'">
            <el-form-item label="面料类型" prop="fabricType">
              <el-input v-model="form.fabricType" :disabled="disable(item.disabled)" type="text" />
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
          <div v-if="item.type === 'looseCloth'">
            <el-form-item label="需要松布" prop="looseCloth">
              <el-radio-group v-model="form.looseCloth" :disabled="disable(item.disabled)" class="ml-4">
                <el-radio label="1" size="large">是</el-radio>
                <el-radio label="2" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-if="item.type === 'preshrink'">
            <el-form-item label="需要预缩" prop="preshrink">
              <el-radio-group v-model="form.preshrink" :disabled="disable(item.disabled)" class="ml-4">
                <el-radio label="1" size="large">是</el-radio>
                <el-radio label="2" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-if="item.type === 'layingParameters'">
            <el-form-item :label="`${item.name}`" :prop="item.prop">
              <el-select v-model="item.model" :disabled="disable(item.disabled)">
                <el-option label="绒布" value="1" />
                <el-option label="黑布" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'fabricColor'">
            <el-form-item :label="`${item.name}`" prop="fabricColor">
              <el-input v-model="item.model" :disabled="disable(item.disabled)" type="textarea" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'fabricName'">
            <el-form-item :label="`${item.name}`" prop="fabricName">
              <el-input v-model="form.fabricName" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`" :prop="item.prop">
              <el-input v-model="item.model" :disabled="disable(item.disabled)" type="text">
                <template #append>{{ item.append }}</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'cuttingMachine'">
            <el-form-item :label="`${item.name}`" :prop="item.prop">
              <el-select v-model="item.model" :disabled="disable(item.disabled)">
                <el-option label="绒布" value="1" />
                <el-option label="黑布" value="2" />
              </el-select>
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

  <!-- <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="排唛比例" width="1000px">
    <PopModule :operation="operation" :form="form" />
  </el-dialog> -->
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'
  import UploadModule from './uploadModule/index.vue'

  const ruleFormRef = ref<any>()

  const props = defineProps<{
    dialogType: boolean
    close: any
  }>()

  const form: any = reactive(formData)

  const state = reactive({
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
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
    // console.log('最终展示', e)
    if (e.type === 'img') {
      form.img = e.data
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
  // const shippingMarks = () => {
  //   let colorTitle: any = form.fabricColor
  //   let layingNumber = false
  //   let fabricColor = false
  //   // 铺布层数
  //   if (Number(form.layingNumber) > 0) {
  //     layingNumber = true
  //   } else {
  //     ElMessage({
  //       message: '铺布层数不可为空',
  //       type: 'warning'
  //     })
  //   }
  //   // 面料颜色
  //   if (colorTitle) {
  //     let data = colorTitle.split('，')

  //     if (data.length === 1) {
  //       fabricColor = true
  //     }

  //     if (data.length > 1) {
  //       let pattern = /([a-zA-Z0-9]+，?)+|[\u4e00-\u9fa5]，/
  //       if (pattern.test(colorTitle)) {
  //         fabricColor = true
  //       } else {
  //         ElMessage({
  //           message: '请按照模板写法',
  //           type: 'warning'
  //         })
  //       }
  //     }
  //   } else {
  //     ElMessage({
  //       message: '面料颜色不可为空',
  //       type: 'warning'
  //     })
  //   }

  //   if (layingNumber === true && fabricColor === true) {
  //     state.dialogTableVisible = true
  //   }
  // }

  //弹窗事件
  // const operation = (e: any) => {
  //   if (e.type === 'cancel') {
  //     state.dialogTableVisible = false
  //   }
  //   if (e.type === 'confirm') {
  //     //获取子项数据 proportions
  //     form.proportions = e.data
  //     state.dialogTableVisible = false
  //   }
  // }

  // 取消
  const resetForm = (formEl: any) => {
    props.close()
    // if (!formEl) return
    formEl.resetFields()
  }
</script>
