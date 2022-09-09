<template>
  <el-form ref="rightFormRef" :rules="rightFormRules" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
    <el-form-item label="生产订单：">
      <el-input v-model="state.rightForm.produceOrder" disabled />
    </el-form-item>
    <el-form-item label="款式床次号：">
      <el-input v-model="state.rightForm.styleBedNumber" disabled />
    </el-form-item>
    <el-form-item label="床次计划号：" required prop="bedScheduleNo">
      <el-input v-model="state.rightForm.bedScheduleNo" :suffix-icon="Search" />
    </el-form-item>
    <el-form-item label="铺布任务号：">
      <el-input v-model="state.rightForm.layingTaskNo" disabled />
    </el-form-item>
    <el-form-item label="面料编号：">
      <el-input v-model="state.rightForm.fabricNo" disabled />
    </el-form-item>
    <el-form-item label="面料名称：">
      <el-input v-model="state.rightForm.fabricName" disabled />
    </el-form-item>
    <el-form-item label="面料颜色：">
      <el-input v-model="state.rightForm.fabricColor" disabled />
    </el-form-item>
    <el-form-item label="唛架长度：">
      <div class="row">
        <el-input v-model="state.rightForm.markShelfLength" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="唛架门幅：">
      <div class="row">
        <el-input v-model="state.rightForm.markFrameDoorWidth" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="铺布长度：">
      <div class="row">
        <el-input v-model="state.rightForm.layingLength" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="设备编号：" required prop="equipmentNo">
      <el-input v-model="state.rightForm.equipmentNo" :suffix-icon="Operation" />
    </el-form-item>
    <el-form-item label="设备名称：">
      <el-input v-model="state.rightForm.equipmentName" disabled />
    </el-form-item>
    <el-form-item label="铺布层数：">
      <el-input v-model="state.rightForm.numberOfLayingLayers" disabled />
    </el-form-item>
    <el-form-item label="损耗率%：">
      <el-input v-model="state.rightForm.lossRate" disabled />
    </el-form-item>
    <el-form-item label="单层件数：">
      <el-input v-model="state.rightForm.numberOfSingleLayer" disabled />
    </el-form-item>
    <el-form-item label="床次总件数：">
      <el-input v-model="state.rightForm.totalNumberOfBeds" disabled />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, defineExpose, ref, defineEmits } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { Search, Operation } from '@element-plus/icons-vue'
  const emit = defineEmits(['changeFrom'])

  const rightFormRef = ref<FormInstance>()
  const state: any = reactive({
    rightForm: {
      produceOrder: '',
      styleBedNumber: '',
      bedScheduleNo: '',
      layingTaskNo: '',
      fabricNo: '',
      fabricName: '',
      fabricColor: '',
      markShelfLength: '',
      markFrameDoorWidth: '',
      layingLength: '',
      equipmentNo: '',
      equipmentName: '',
      numberOfLayingLayers: '',
      lossRate: '',
      numberOfSingleLayer: '',
      totalNumberOfBeds: ''
    }
  })
  const rightFormRules = reactive<FormRules>({
    bedScheduleNo: [
      {
        required: true,
        message: '请输入床次计划号',
        trigger: 'blur'
      }
    ],
    equipmentNo: [
      {
        required: true,
        message: '请输入设备编号',
        trigger: 'blur'
      }
    ]
  })

  const validateFrom = () => {
    submitForm(rightFormRef)
  }
  // 校验表单
  const submitForm = async (formEl: FormInstance | undefined | any) => {
    if (!formEl) return
    await formEl.value.validate((valid: any) => {
      if (valid) {
        emit('changeFrom', state.rightForm)
      }
    })
  }

  defineExpose({ validateFrom })
</script>

<style scoped lang="less">
  .row {
    .el-input {
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
