<template>
  <div>
    <el-form ref="rightFormRef" class="rightFormRef" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <div class="title">
        <div>铺布机建议参数</div>
      </div>
      <div class="parameter" >
        <div class="parameter-top">
          <el-form-item label="前进速度">
            <Tips title="1-10段" />
            <el-input-number v-model="state.rightForm.forwardSpeed" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="匀速松紧值">
            <el-input-number v-model="state.rightForm.uniformTightness" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="减速松紧值">
            <el-input-number v-model="state.rightForm.reduceTightness" :disabled="disable(false)" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行速度 (mm/s)">
            <el-input-number v-model="state.rightForm.crawlSpeed" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <!-- <el-form-item label="布斗目标角度">
            <div class="devParam-row">
              <el-input-number v-model="state.rightForm.angle" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>°</span>
            </div>
          </el-form-item> -->
        </div>
        <div class="parameter-foot">
          <el-form-item label="后退速度">
            <Tips title="1-10段" />
            <el-input-number v-model="state.rightForm.backSpeed" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>

          <el-form-item label="加速松紧值">
            <el-input-number v-model="state.rightForm.accelerationTightness" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行松紧值">
            <el-input-number v-model="state.rightForm.crawlTightness" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <el-form-item label="爬行距离 (mm)">
            <el-input-number v-model="state.rightForm.crawlDistance" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item>
          <!-- <el-form-item label="加速权重">
            <el-input-number v-model="state.rightForm.accelerationWeight" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
          </el-form-item> -->
        </div>
      </div>
      <div class="title">
        <div>裁床建议参数</div>
        <div class="unitSearch">
          <el-select v-model="value" style="width: 50px" class="unitSearch-option">
            <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>

      <el-row :gutter="20">
        <div class="currencyFile">
          <UploadModule :disabled="disable(false)" :type="'currencyFile'" :get-data="getAttachmentList" :value="state.bottomForm.attachmentList" :upload="upload" />
        </div>

        <!-- 暂时隐藏 -->
        <!-- <el-col :span="9">
          <el-form-item label="最小磨刀频率">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.minKnifeFrequency" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>U/min</span>
            </div>
          </el-form-item>

          <el-form-item label="刀速">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.knifeSpeed" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>m/min</span>
            </div>
          </el-form-item>
          <el-form-item label="最小磨刀距离">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.minKnifeDistance" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>mm</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="layClothRight">
          <el-form-item label="刀频">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.maxKnifeFrequency" class="layClothTow" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>U/min</span>
            </div>
          </el-form-item>
          <el-form-item label="提刀角度">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.knifeAngle" class="layClothTow" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>°</span>
            </div>
          </el-form-item>
          <el-form-item label="真空率">
            <div class="devParam-row">
              <el-input-number v-model="state.bottomForm.emptyRatio" class="layClothTow" :disabled="disable(false)" :min="0" :controls="false" size="large" @change="onChang" />
              <span>%</span>
            </div>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash'
  import { reactive, ref, defineEmits, defineExpose, getCurrentInstance } from 'vue'
  import type { FormInstance } from 'element-plus'

  import Tips from '@/components/tips/index.vue'
  import UploadModule from '@/components/upload/index.vue'
  import { customFormData } from './conifgs'

  const { proxy } = getCurrentInstance() as any

  const emit = defineEmits(['changeFrom'])

  const rightFormRef = ref<FormInstance>()

  const props = defineProps<{
    type: any
    setData: any
    row: any
    value: any
  }>()

  const { formData } = customFormData
  const value = ref('2')
  const state: any = reactive({
    form: formData, //form
    options: [
      // {
      //   value: '1',
      //   label: '参数配置',
      //   disabled: true,
      // },
      {
        value: '2',
        label: '参数文件'
      }
    ],
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
      minKnifeDistance: '',
      emptyRatio: '',
      knifeSpeed: '',
      knifeAngle: ''
    }
  })
  //上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    pictureType: { accept: ' .xpr', availableSuffix: ' xpr' },
    api: '/jack-ics-api/oss/upload'
  })

  //处理参数文件回显
  const setAttachmentList = (arr: any) => {
    //处理格式问题
    if (!isEmpty(arr.attachmentList)) {
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

    return arr
  }
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
            //处理参数文件回显
            let arr = res.data.cutTaskParam
            state.bottomForm = setAttachmentList(arr)
          }
          props.setData('2', { top: state.rightForm, bottom: state.bottomForm })
        }
      })
    }
  }
  const init = () => {
    //判断是否存过数据  存过不需要重复调取接口
    if (!isEmpty(props.value.two)) {
      if (!isEmpty(props.value.two.top)) {
        state.rightForm = props.value.two.top
      }

      let arr = props.value.two.bottom
      //异步处理 不然watch监听不到
      setTimeout(function () {
        if(arr){
        state.bottomForm = setAttachmentList(arr)
        }
      }, 100)
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

  // 通用上传
  const getAttachmentList = (e: any) => {
    if (e.type === 'currencyFile') {
      if (!isEmpty(e.data)) {
        state.bottomForm.attachmentList = e.data
        state.bottomForm.paramFileName = e.data[0].name
        state.bottomForm.paramFile = e.data[0].response.data.src
        props.setData('2', { top: state.rightForm, bottom: state.bottomForm })
      } else {
        state.bottomForm.paramFileName = ''
        state.bottomForm.paramFile = ''
        props.setData('2', { top: state.rightForm, bottom: state.bottomForm })
      }
    }
  }
  defineExpose({ submitForm })
</script>

<style scoped lang="less">
  .layClothRight {
    transform: translateX(100px);
  }
  .BottomTable {
    width: 100%;
    margin-bottom: 30px;
    /deep/ .el-input {
      width: 100% !important;
    }
  }
  .title {
    display: flex;
    width: 100%;
    height: 33px;
    line-height: 33px;
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
      top: 8px;
      left: -8px;
      width: 3px;
      height: 16px;
      background: #3e8ff7;
      border-radius: 1px 1px 1px 1px;
    }
  }
  .devParam-row {
    display: flex;
    /deep/ .el-input {
      height: 32px;
      width: 180px !important;
    }
    span {
      margin-top: 3px;
      width: 58px;
      height: 32px;
      text-align: center;
      background-color: #eaeaea;
      display: inline-block;
    }
    // .layClothTow {
    //   margin-left: 30px;
    // }
  }
  .unitSearch {
    margin-left: 5px;
    el-input el-input--suffix {
      width: 50px !important;
    }
    // .unitSearch-option{
    //   width: 50px;
    // }
  }
  .currencyFile {
    margin-left: 10px;
  }

  .rightFormRef {
    display: block;
    /deep/ .el-input {
      width: 300px;
    }
    /deep/ .el-input__inner {
      text-align: left !important; //输入框左对齐
    }
  }
  .parameter{
    transform: translate(-5vw, 0);  
  }
  .parameter-top{
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    
  }
   .parameter-foot{
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    
  }
</style>
