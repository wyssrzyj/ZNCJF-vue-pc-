<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-25 09:57:40
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

        <el-form-item :label="`设备默认参数`" prop="proportions">
          <el-icon class="proportionsLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'equipmentNumber'">
            <el-form-item :label="`${item.name}`" prop="equipmentNumber">
              <el-input v-model="form.equipmentNumber" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'equipmentName'">
            <el-form-item :label="`${item.name}`" prop="equipmentName">
              <el-input v-model="form.equipmentName" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'associatedEquipment'">
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
          <div v-if="item.type === 'equipmentModel'">
            <el-form-item :label="`${item.name}`" prop="equipmentModel">
              <el-input v-model="form.equipmentModel" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'equipmentType'">
            <el-form-item label="设备类型" prop="equipmentType" class="buttonContainer">
              <el-select v-model="form.equipmentType" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)">
                <el-option v-for="item in state.equipmentType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'remarks'">
            <el-form-item :label="`${item.name}`" prop="remarks">
              <el-input v-model="form.remarks" :placeholder="`请输入${item.name}`" :rows="2" type="textarea" :disabled="disable(item.disabled)" />
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
    <PopModule :type="state.type" :operation="operation" :form="form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue'
  import { formData, formMiddleData, formRightData, dataRule } from './conifgs'
  import './index.css'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import UploadModule from './uploadModule/index.vue'
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
    equipmentType: [
      { name: '铺布机', id: '1' },
      { name: '打标机', id: '2' },
      { name: '裁床', id: '3' }
    ],
    //提示信息
    prop: dataRule,
    messageTitle: '铺布建议参数'
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

  //设备默认参数
  const shippingMarks = () => {
    if (form.equipmentType === '1') {
      state.messageTitle = '铺布建议参数'
      state.dialogTableVisible = true
    }
    if (form.equipmentType === '3') {
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
      //获取子项数据 proportions
      // console.log('确认的数据', e.data)

      form.proportions = e.data
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
