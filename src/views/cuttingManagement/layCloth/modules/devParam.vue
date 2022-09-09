<template>
  <div>
    <el-form ref="rightFormRef" :rules="rightFormRules" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <div class="title">铺布机建议参数</div>
      <el-form-item label="最小层数：">
        <el-input v-model="state.rightForm.minLayers" />
      </el-form-item>
      <el-form-item label="最大层数：">
        <el-input v-model="state.rightForm.maxLayers" />
      </el-form-item>
      <el-form-item label="前进速度：">
        <el-input v-model="state.rightForm.forwardSpeed" />
      </el-form-item>
      <el-form-item label="后退速度：">
        <el-input v-model="state.rightForm.reverseSpeed" />
      </el-form-item>
      <el-form-item label="匀速松紧值：">
        <el-input v-model="state.rightForm.constantVelocityTightnessValue" />
      </el-form-item>
      <el-form-item label="加速松紧值：">
        <el-input v-model="state.rightForm.accelerationTightnessValue" />
      </el-form-item>
      <el-form-item label="减速松紧值：">
        <el-input v-model="state.rightForm.decelerationTightnessValue" />
      </el-form-item>
      <el-form-item label="爬行松紧值：">
        <el-input v-model="state.rightForm.crawlingTightnessValue" />
      </el-form-item>
      <el-form-item label="爬行速度：">
        <el-input v-model="state.rightForm.crawlingSpeed" />
      </el-form-item>
      <el-form-item label="爬行距离：">
        <el-input v-model="state.rightForm.creep" />
      </el-form-item>
      <el-form-item label="布斗目标角度：">
        <el-input v-model="state.rightForm.angleOfTheTarget" />
      </el-form-item>
      <el-form-item label="加速权重：">
        <el-input v-model="state.rightForm.accelerateWeight" />
      </el-form-item>
      <div class="BottomTable">
        <BottomTable :on-chang="onChang" :bottom-table="state.bottomTable" />
      </div>
      <div class="title">裁床建议参数</div>
      <el-form-item label="最小磨刀频率：">
        <div class="row">
          <el-input v-model="state.rightForm.minimumSharpeningFrequency" />
          <span>U/min</span>
        </div>
      </el-form-item>
      <el-form-item label="刀频：">
        <div class="row">
          <el-input v-model="state.rightForm.knifeFrequency" />
          <span>U/min</span>
        </div>
      </el-form-item>
      <el-form-item label="刀数：">
        <div class="row">
          <el-input v-model="state.rightForm.daoNum" />
          <span>m/min</span>
        </div>
      </el-form-item>
      <el-form-item label="提刀角度：">
        <div class="row">
          <el-input v-model="state.rightForm.mentionKnifeAngle" />
          <span>°</span>
        </div>
      </el-form-item>
      <el-form-item label="最小磨刀距离：">
        <div class="row">
          <el-input v-model="state.rightForm.minimumSharpeningDistance" />
          <span>mm</span>
        </div>
      </el-form-item>
      <el-form-item label="真空率：">
        <div class="row">
          <el-input v-model="state.rightForm.vacuumRate" />
          <span>%</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import BottomTable from './dialog-content-table.vue'
  import { customFormData } from './conifgs'

  import { reactive, ref, defineEmits, defineExpose } from 'vue'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['changeFrom'])

  const rightFormRef = ref<FormInstance>()

  const { formData } = customFormData
  const state: any = reactive({
    form: formData, //form
    rightForm: {
      minLayers: '',
      maxLayers: '',
      forwardSpeed: '',
      reverseSpeed: '',
      constantVelocityTightnessValue: '',
      accelerationTightnessValue: '',
      decelerationTightnessValue: '',
      crawlingTightnessValue: '',
      crawlingSpeed: '',
      creep: '',
      angleOfTheTarget: '',
      accelerateWeight: '',
      minimumSharpeningFrequency: '',
      knifeFrequency: '',
      daoNum: '',
      mentionKnifeAngle: '',
      minimumSharpeningDistance: '',
      vacuumRate: ''
    },
    bottomTable: formData.bottomTable
  })

  // 校验表单
  // eslint-disable-next-line no-unused-vars
  const submitForm = async () => {
    emit('changeFrom', state.rightForm)
  }
  //表格修改返回数据
  const onChang = (data: any) => {
    // console.log(data)
  }

  defineExpose({ submitForm })
</script>

<style scoped lang="less">
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
