<template>
  <div class="container">
    <div class="top">
      <p v-for="(item, i) in state.topList" :key="i" :class="state.topCurrent === i ? 'active' : ''" @click="state.topCurrent = i">{{ item }}</p>
    </div>
    <div class="middle">
      <div class="left-form">
        <el-form ref="leftForm" :rules="leftFormRules" :model="state.leftForm" label-width="auto" label-position="top">
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
        </el-form>
      </div>
      <div class="right-from">
        <!--选择设备-->
        <SelectDev v-if="state.topCurrent === 0" ref="selectDevice" @changeFrom="selectDeviceSub" />
        <!--设备参数-->
        <DevParam v-if="state.topCurrent === 1" ref="devParam" @changeFrom="devParamSub" />
        <!--计划时间-->
        <PlannedTime v-if="state.topCurrent === 2" ref="plannedTime" @changeFrom="plannedTimeSub" />
      </div>
    </div>
    <div class="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SelectDev from './selectDev.vue'
  import DevParam from './devParam.vue'
  import PlannedTime from './plannedTime.vue'
  import UploadModule from './dialog-upload.vue'
  import { content } from './conifgs'

  import { isEmpty } from 'lodash'
  import { reactive, ref } from 'vue'
  import type { FormRules } from 'element-plus'
  import { FormInstance } from 'element-plus'

  const leftForm = ref<FormInstance>()

  const { formData } = content

  const props = defineProps<{
    close: any
  }>()

  const state: any = reactive({
    form: formData,
    topCurrent: 2,
    topList: ['1.选择设备', '2.设备参数', '3.计划时间'],
    leftForm: {
      styleNo: '',
      styleName: ''
    },
    // 选择设备表单数据
    selectDeviceData: {},
    // 设备参数表单数据
    devParamData: {},
    // 计划时间表单数据
    plannedTimeData: {}
  })
  const leftFormRules = reactive<FormRules>({
    styleName: [
      {
        required: true,
        message: '请输入款式名称',
        trigger: 'change'
      }
    ]
  })

  const selectDevice = ref<any>(null)
  const devParam = ref<any>(null)
  const plannedTime = ref<any>(null)

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }
  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  // 上传
  const getData = (e: any) => {
    if (e.type === 'img') {
      state.form.styleImage = e.data
    }
    //唛架图
    if (e.type === 'shelfFile') {
      if (!isEmpty(e.data)) {
        let shelfFile = e.data[0].response.data

        const { heigh, width, sumArea } = shelfFile
        state.form.shelfWidth = heigh //唛架门幅
        state.form.shelfLength = width //唛架长度
        state.form.spreadClothLength = Number(width) + 0.03 //铺布长度
        state.effectiveArea = sumArea //利用率
        //利用率
        state.form.attritionRate = sumArea / (heigh * Number(state.form.spreadClothLength))
        //文件传给组件
        e.data[0].response.data.src = e.data[0].response.data.shelfFileUrl

        state.form.shelfFile = e.data //赋值
      }
      // shelfWidth
    }
  }

  // 其他附件
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      state.form.attachmentList = e.data
    }
  }

  // 保存
  const save = () => {
    // 先校验左边表单
    submitForm(leftForm)
    // 通过 topCurrent 区分保存内容
    // 选择设备
    if (state.topCurrent === 0) {
      selectDevice.value.validateFrom()
    }
    // 设备参数
    if (state.topCurrent === 1) {
      devParam.value.submitForm()
    }
    // 计划时间
    if (state.topCurrent === 2) {
      plannedTime.value.submitForm()
    }
  }

  // 选择设备提交
  const selectDeviceSub = (data: any) => {
    state.selectDeviceData = data
    submitForm(leftForm).then(res => {
      if (data && res) {
      }
    })
  }
  // 设备参数提交
  const devParamSub = (data: any) => {
    state.devParamData = data
    submitForm(leftForm).then(res => {
      if (data && res) {
      }
    })
  }
  // 计划时间提交
  const plannedTimeSub = (data: any) => {
    state.plannedTimeData = data
    submitForm(leftForm).then(res => {
      if (data && res) {
      }
    })
  }
  //  表单验证
  const submitForm = async (formEl: FormInstance | undefined | any) => {
    if (!formEl) return
    return await formEl.value.validate((valid: any) => {
      return !!valid
    })
  }

  // 取消
  const close = (formEl: any) => {
    props.close()
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 10px;
    .top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid #eaeaea;
      padding: 0 20px 30px 10px;
      p {
        margin: 0;
        width: 244px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bcbcbc;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        background: url('../../../../assets/images/layCloth/step-bg2.png') 100% 100% no-repeat;
        &.active {
          background: url('../../../../assets/images/layCloth/step-bg2-active.png') 100% 100% no-repeat !important;
          color: #ffffff;
        }
        &:hover {
          background: url('../../../../assets/images/layCloth/step-bg2-active.png') 100% 100% no-repeat;
          color: #ffffff;
        }
        &:nth-child(1) {
          background: url('../../../../assets/images/layCloth/step-bg1.png') 100% 100% no-repeat;
          &.active {
            background: url('../../../../assets/images/layCloth/step-bg1-active.png') 100% 100% no-repeat !important;
            color: #ffffff;
          }
        }
        &:nth-child(1):hover {
          background: url('../../../../assets/images/layCloth/step-bg1-active.png') 100% 100% no-repeat;
        }
      }
    }
    .middle {
      width: 100%;
      display: flex;
      height: 585px;
      overflow-y: auto;
      //align-items: center;
      justify-content: space-between;
      margin: 20px 0 30px 0;
      /deep/ .el-input {
        width: 250px;
      }
      .left-from {
        width: 250px;
      }
      .right-from {
        width: 555px;
        //display: flex;
        //align-items: center;
        //justify-content: space-between;
        //.el-form{
        //  display: flex;
        //  flex-wrap: wrap;
        //  justify-content: space-between;
        //  .el-form-item{
        //    width: calc(calc(100% / 2) - 0px);
        //  }
        //}
      }
    }
    .foot {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      height: 52px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.302);
    }
  }
</style>
