<template>
  <div>
    <el-form ref="rightFormRef" :rules="rightFormRules" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <div class="title">任务时间设置</div>
      <el-form-item label="铺布任务开始时间：">
        <el-date-picker
          v-model="state.rightForm.spreadTaskTime.planStartTime"
          :disabled="disable(false)"
          :clearable="false"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
      <el-form-item label="铺布任务结束时间：">
        <el-date-picker
          v-model="state.rightForm.spreadTaskTime.planEndTime"
          :disabled="disable(false)"
          :clearable="false"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
      <el-form-item v-if="state.planType" label="贴标任务开始时间：">
        <el-date-picker
          v-model="state.rightForm.pasteTaskTime.planStartTime"
          :disabled="disable(false)"
          :clearable="false"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
      <el-form-item v-if="state.planType" label="贴标任务结束时间：">
        <el-date-picker
          v-model="state.rightForm.pasteTaskTime.planEndTime"
          :disabled="disable(false)"
          :clearable="false"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
      <el-form-item label="裁剪任务开始时间：">
        <el-date-picker
          v-model="state.rightForm.cutTaskTime.planStartTime"
          :disabled="disable(false)"
          :clearable="false"
          value-format="x"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
      <el-form-item label="裁剪任务结束时间：">
        <el-date-picker
          v-model="state.rightForm.cutTaskTime.planEndTime"
          :disabled="disable(false)"
          :clearable="false"
          type="datetime"
          format="YYYY-MM-DD HH:mm"
          value-format="x"
          :suffix-icon="Calendar"
          @change="setTime"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'

  import { Calendar } from '@element-plus/icons-vue'
  const { proxy } = getCurrentInstance()

  const rightFormRef = ref<FormInstance>()
  const props = defineProps<{
    type: any
    setData: any
    value: any
    bedPlanId: any
  }>()

  const state: any = reactive({
    planType: true, //贴标时间是否可用
    rightForm: {
      //铺布
      spreadTaskTime: {
        planStartTime: '',
        planEndTime: ''
      },
      //贴标
      pasteTaskTime: {
        planStartTime: '',
        planEndTime: ''
      },
      //裁剪
      cutTaskTime: {
        planStartTime: '',
        planEndTime: ''
      }
    }
  })

  const setList = () => {
    if (props.bedPlanId) {
      proxy.$baseService
        .get('/jack-ics-api/spreadTask/getTime', {
          bedPlanId: props.bedPlanId
        })
        .then((res: any) => {
          if (res.code === 0) {
            if (res.data.spreadTaskTime) {
              state.rightForm.spreadTaskTime = res.data.spreadTaskTime
            }
            if (res.data.pasteTaskTime) {
              state.rightForm.pasteTaskTime = res.data.pasteTaskTime
            }
            if (res.data.cutTaskTime) {
              state.rightForm.cutTaskTime = res.data.cutTaskTime
            }

            // state.rightForm = res.data
            props.setData('3', state.rightForm)
          }
        })
    }
  }

  //设备是否选择了有贴标机的
  const setPlanType = () => {
    proxy.$baseService.get('/jack-ics-api/device/listTaskTypeByDeviceId', { deviceId: props.bedPlanId }).then((res: any) => {
      if (res.data[1] === 2) {
        state.planType = true
      } else {
        state.planType = false
      }
    })
  }

  const init = () => {
    setPlanType()

    //判断是否存过数据  存过不需要重复调取接口
    if (!isEmpty(props.value.three)) {
      state.rightForm = props.value.three
    } else {
      setList()
    }
  }

  init()

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

  const setTime = () => {
    props.setData('3', state.rightForm)
  }

  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }
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
