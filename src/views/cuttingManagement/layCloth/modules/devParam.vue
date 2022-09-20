<template>
  <div>
    <el-form ref="rightFormRef" :rules="rightFormRules" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <div class="title">铺布机建议参数</div>

      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="前进速度：">
            <el-input-number v-model="state.rightForm.forwardSpeed" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="匀速松紧值：">
            <el-input-number v-model="state.rightForm.uniformTightness" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="减速松紧值：">
            <el-input-number v-model="state.rightForm.reduceTightness" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行速度：">
            <el-input-number v-model="state.rightForm.crawlSpeed" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="布斗目标角度：">
            <el-input-number v-model="state.rightForm.angle" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
        </el-col>
        <el-col :span="9" class="layClothRight">
          <el-form-item label="后退速度：">
            <el-input-number v-model="state.rightForm.backSpeed" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>

          <el-form-item label="加速松紧值：">
            <el-input-number v-model="state.rightForm.accelerationTightness" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行松紧值：">
            <el-input-number v-model="state.rightForm.crawlTightness" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行距离：">
            <el-input-number v-model="state.rightForm.crawlDistance" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>

          <el-form-item label="加速权重：">
            <el-input-number v-model="state.rightForm.accelerationWeight" :disabled="disable(false)" :min="0"  :controls="false" size="large" @change="onChang" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="title">裁床建议参数</div>
      <el-form-item label="最小磨刀频率：">
        <div class="devParam-row">
          <el-input :disabled="disable(false)" v-model="state.bottomForm.minKnifeFrequency" @change="onChang" />
          <span>U/min</span>
        </div>
      </el-form-item>
      <el-form-item label="刀频：">
        <div class="devParam-row">
          <el-input :disabled="disable(false)" v-model="state.bottomForm.maxKnifeFrequency" @change="onChang" />
          <span>U/min</span>
        </div>
      </el-form-item>
      <el-form-item label="刀速：">
        <div class="devParam-row">
          <el-input :disabled="disable(false)" v-model="state.bottomForm.knifeSpeed" @change="onChang" />
          <span>m/min</span>
        </div>
      </el-form-item>
      <el-form-item label="提刀角度：">
        <div class="devParam-row">
          <el-input :disabled="disable(false)" v-model="state.bottomForm.knifeAngle" @change="onChang" />
          <span>°</span>
        </div>
      </el-form-item>
      <!-- <el-form-item label="最小磨刀距离：">
        <div class="devParam-row">
          <el-input v-model="state.rightForm.minimumSharpeningDistance" @change="onChang" />
          <span>mm</span>
        </div>
      </el-form-item>
      <el-form-item label="真空率：">
        <div class="devParam-row">
          <el-input v-model="state.rightForm.emptyRatio" @change="onChang" />
          <span>%</span>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { customFormData } from './conifgs'

  import { isEmpty } from 'lodash'
  import { reactive, ref, defineEmits, defineExpose, getCurrentInstance,  } from 'vue'
  import type { FormInstance } from 'element-plus'
  const { proxy } = getCurrentInstance()

  const emit = defineEmits(['changeFrom'])

  const rightFormRef = ref<FormInstance>()

  const props = defineProps<{
    type: any
    setData: any
    row: any
    value: any
  }>()

  const { formData } = customFormData
  const state: any = reactive({
    form: formData, //form
    rightForm: {
      forwardSpeed: '',
      backSpeed: '',
      uniformTightness: '',
      accelerationTightness: '',
      reduceTightness: '',
      crawlTightness: '',
      crawlSpeed: '',
      crawlDistance: '',
      angle: '',
      accelerationWeight: ''
    },
    bottomForm: {
      minKnifeFrequency: '',
      maxKnifeFrequency: '',
      knifeSpeed: '',
      knifeAngle: ''
    }
  })

  const setData = () => {
    if (props.row) {
      const data = {
        bedPlanId: props.row.bedPlanId,
        deviceId: props.row.deviceId,
        spreadClothLevel: props.row.spreadClothLevel
      }
      proxy.$baseService.get('/jack-ics-api/spreadTask/getParam', data).then((res: any) => {
        if (res.code === 0) {
          if (!isEmpty(res.data.spreadTaskParam)) {
            state.rightForm = res.data.spreadTaskParam
          }

          if (!isEmpty(res.data.cutTaskParam)) {
            state.bottomForm = res.data.cutTaskParam
          }

          props.setData('2', { top: state.rightForm, bottom: state.bottomForm })
        }
      })
    }
  }
  const init = () => {
    //判断是否存过数据  存过不需要重复调取接口
    if (!isEmpty(props.value.two)) {
      state.rightForm = props.value.two.top
      state.bottomForm = props.value.two.bottom
    } else {
      setData()
    }
  }

  init()

  const submitForm = async () => {
    emit('changeFrom', state.rightForm)
  }
  //表格修改返回数据
  const onChang = () => {
    props.setData('2', { top: state.rightForm, bottom: state.bottomForm })
  }

  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }
  defineExpose({ submitForm })
</script>

<style scoped lang="less">
  .layClothRight {
    margin-left: 80px;
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
  .devParam-row {
    /deep/ .el-input {
      width: 192px !important;
    }
    span {
      width: 58px;
      text-align: center;
      background-color: #eaeaea;
      display: inline-block;
    }
    .layClothLeft {
      margin-right: 50px;
    }
  }
</style>
