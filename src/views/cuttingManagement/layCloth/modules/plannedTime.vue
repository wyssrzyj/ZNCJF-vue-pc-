<template>
  <div>
    <el-form ref="rightFormRef" :rules="rightFormRules" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <div class="title">任务时间设置</div>
      <el-form-item label="铺布任务开始时间：">
        <el-date-picker v-model="state.rightForm.startTimeOfTheClothLayingTask" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
      <el-form-item label="铺布任务结束时间：">
        <el-date-picker v-model="state.rightForm.endTimeOfTheClothLayingTask" :clearable="false" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
      <el-form-item label="贴标任务开始时间：">
        <el-date-picker v-model="state.rightForm.startTimeOfTheLabelingTask" :clearable="false" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
      <el-form-item label="贴标任务结束时间：">
        <el-date-picker v-model="state.rightForm.endTimeOfTheLabelingTask" :clearable="false" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
      <el-form-item label="裁剪任务开始时间：">
        <el-date-picker v-model="state.rightForm.trimTheTaskStartTime" :clearable="false" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
      <el-form-item label="裁剪任务结束时间：">
        <el-date-picker v-model="state.rightForm.trimTheTaskEnd" :clearable="false" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" :suffix-icon="Calendar" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { defineExpose, onMounted, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'

  import { Calendar } from '@element-plus/icons-vue'
  const rightFormRef = ref<FormInstance>()
  const emit = defineEmits(['changeFrom'])

  const state: any = reactive({
    rightForm: {
      startTimeOfTheClothLayingTask: '',
      endTimeOfTheClothLayingTask: '',
      startTimeOfTheLabelingTask: '',
      endTimeOfTheLabelingTask: '',
      trimTheTaskStartTime: '',
      trimTheTaskEnd: ''
    }
  })

  onMounted(() => {
    let elWrapper = document.querySelectorAll('.right-from .el-input__wrapper') as NodeListOf<HTMLElement>
    elWrapper.forEach(el => {
      const elClid = el.children[0]
      const copyEl = elClid
      copyEl.children[0].children[0].style.margin = 0
      el.removeChild(elClid)
      el.appendChild(copyEl)
    })
  })

  // 校验表单
  const submitForm = () => {
    emit('changeFrom', state.rightForm)
  }

  defineExpose({ submitForm })
</script>

<style scoped lang="less">
  .el-input__prefix-inner {
    /deep/ .el-input__icon {
      margin: 0 !important;
    }
  }
  .BottomTable {
    width: 100%;
    margin-bottom: 30px;
    /deep/ .el-input {
      width: 100% !important;
    }
  }
  .title {
    display: block;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    //margin: 0;
    margin-left: 8px !important;
    margin-bottom: 20px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: -8px;
      width: 3px;
      height: 16px;
      background: #3e8ff7;
      border-radius: 1px 1px 1px 1px;
    }
  }
  .row {
    /deep/ .el-input {
      width: 192px !important;
    }
    span {
      width: 58px;
      text-align: center;
      background-color: #eaeaea;
      display: inline-block;
    }
  }
</style>
