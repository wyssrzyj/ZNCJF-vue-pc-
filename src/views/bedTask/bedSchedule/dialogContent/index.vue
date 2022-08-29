<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 13:16:17
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
        <el-form-item label="款图" class="layclothImg" prop="img">
          <UploadModule v-model="form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="form.img" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="form.name" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称" prop="username">
          <el-input v-model="form.username" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图" prop="file">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getData" :value="form.file" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getData" :value="form.file" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'bedSchedule'">
            <el-form-item label="生产订单" prop="bedSchedule">
              <el-input v-model="form.bedSchedule" :disabled="disable(item.disabled)" type="text" />
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
          <div v-if="item.type === 'marker'">
            <el-form-item label="唛架门幅" prop="marker">
              <el-input v-model="form.marker" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'layingNumber'">
            <el-form-item label="铺布层数" prop="layingNumber">
              <el-input-number v-model="form.layingNumber" :disabled="disable(item.disabled)" controls-position="right" :min="1" type="text" />
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
          <div v-if="item.type === 'bedNumber'">
            <el-form-item :label="`${item.name}`" prop="bedNumber">
              <el-input v-model="form.bedNumber" :disabled="disable(item.disabled)" type="text">
                <template #append>
                  <el-tooltip class="box-item" effect="dark" content="数字 自动生成 生成规则：一个款式根据床次计划数量从1开始+1  不可修改 " placement="right-start">
                    <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'equipment'">
            <el-form-item :label="item.name" prop="equipment" class="buttonContainer">
              <el-select v-model="form.equipment" :disabled="disable(item.disabled)">
                <el-option label="CJoo1" value="1" />
                <el-option label="PBJ001" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="item.type === 'markerLength'">
            <el-form-item :label="`${item.name}`" prop="markerLength">
              <el-input v-model="form.markerLength" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'layCloth'">
            <el-form-item :label="`${item.name}`" prop="layCloth">
              <el-input v-model="form.layCloth" :disabled="disable(item.disabled)" type="text">
                <template #append>米</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'proportions'">
            <el-form-item :label="`${item.name}`" prop="proportions">
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
  const shippingMarks = () => {
    let colorTitle: any = form.fabricColor
    let layingNumber = false
    let fabricColor = false
    // 铺布层数
    if (Number(form.layingNumber) > 0) {
      layingNumber = true
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

    if (layingNumber === true && fabricColor === true) {
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
