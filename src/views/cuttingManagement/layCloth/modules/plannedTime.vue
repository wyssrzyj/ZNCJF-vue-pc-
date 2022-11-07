<template>
  <div class="plannedTime">
    <!-- 甘特图 -->
    <div class="title">甘特图</div>
    <div class="gunter" @click="see">
      <img :src="layClothImg" alt="" class="time-img" />
      <div class="gunter-txt">查看甘特图</div>
    </div>

    <el-form ref="rightFormRef" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
      <!-- 铺布任务 -->
      <div class="title">铺布任务</div>
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
      <!-- 打标任务 -->
      <div v-if="state.planType">
        <div class="title">
          打标任务 <span> <el-switch v-model="state.spreadTaskTimeType" :disabled="disable(false)" @change="spreadTaskType" /></span>
        </div>
        <div v-if="state.spreadTaskTimeType" class="pasteTaskTime">
          <el-form-item label="贴标任务开始时间：">
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
          <el-form-item label="贴标任务结束时间：">
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
        </div>
      </div>

      <!-- 裁剪任务 -->
      <div class="title">裁剪任务</div>
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
  <el-dialog v-if="state.imgType" v-model="state.imgType" :close-on-click-modal="false" :draggable="false" title="查看甘特图" width="1100px" hei>
    <ChartDisplay />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { isEmpty } from 'lodash'
  // import  from  "./"

  import { Calendar } from '@element-plus/icons-vue'
  import ChartDisplay from './chartDisplay-img.vue'
  import layClothImg from '@/components/icon/layCloth.png'
  const { proxy } = getCurrentInstance() as any

  const rightFormRef = ref<FormInstance>()
  const props = defineProps<{
    type: any
    setData: any
    value: any
    ids: any
  }>()

  const state: any = reactive({
    planType: true, //贴标时间是否可用
    imgType: false,
    spreadTaskTimeType: true, //是否跳过打标
    rightForm: {
      //铺布
      spreadTaskTime: {
        planStartTime: null,
        planEndTime: null
      },
      isSkipPaste: 0, //是否跳过打标
      //贴标
      pasteTaskTime: {
        planStartTime: null,
        planEndTime: null
      },
      //裁剪
      cutTaskTime: {
        planStartTime: null,
        planEndTime: null
      }
    }
  })
  const see = () => {
    state.imgType = true
  }

  const setList = () => {
    if (props.ids) {
      proxy.$baseService
        .get('/jack-ics-api/spreadTask/getTime', {
          bedPlanId: props.ids.bedPlanId
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
            let isSkipPaste = state.rightForm.isSkipPaste

            state.spreadTaskTimeType = isSkipPaste === 0 ? true : false
            // state.rightForm = res.data
            props.setData('3', state.rightForm)
          }
        })
    }
  }

  //设备是否选择了有贴标机的
  const setPlanType = () => {
    proxy.$baseService.get('/jack-ics-api/device/listTaskTypeByDeviceId', { deviceId: props.ids.deviceId }).then((res: any) => {
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

      let isSkipPaste = state.rightForm.isSkipPaste

      state.spreadTaskTimeType = isSkipPaste === 0 ? true : false
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
  //是否关闭贴标时间
  const spreadTaskType = (e: any) => {
    state.spreadTaskTimeType = e
    let isSkipPaste = e === true ? 0 : 1
    state.rightForm.isSkipPaste = isSkipPaste
  }

  const setTime = (type: any) => {
    // 铺布- 1.5
    // 打标-25分钟
    // 裁剪-35分钟
    props.setData('3', state.rightForm)
  }
  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }

  // 监听时间更改

  // //铺布任务开始
  // watch(
  //   () => state.rightForm.spreadTaskTime.planStartTime,
  //   item => {
  //     state.rightForm.spreadTaskTime.planEndTime = item + 5400000
  //   }
  // )
  // //铺布任务结束
  // watch(
  //   () => state.rightForm.spreadTaskTime.planEndTime,
  //   item => {
  //     //是否
  //     if(state.spreadTaskTimeType){
  //     state.rightForm.pasteTaskTime.planStartTime = item + 5400000
  //     }else{
  //     state.rightForm.cutTaskTime.planStartTime = item + 5400000
  //     }
  //   }
  // )

  // // 贴标任务开始
  // watch(
  //   () => state.rightForm.pasteTaskTime.planStartTime,
  //   item => {
  //     state.rightForm.pasteTaskTime.planEndTime = item + 1500000
  //   }
  // )
  // // 贴标任务结束
  // watch(
  //   () => state.rightForm.pasteTaskTime.planEndTime,
  //   item => {
  //     state.rightForm.cutTaskTime.planStartTime = item + 1500000
  //   }
  // )
  // // 裁剪任务开始
  // watch(
  //   () => state.rightForm.cutTaskTime.planStartTime,
  //   item => {
  //     state.rightForm.cutTaskTime.planEndTime = item + 2100000
  //   }
  // )
</script>

<style scoped lang="less">
.plannedTime{
  width: 540px;
}
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
  .pasteTaskTime {
    display: flex;
  }
  .gunter {
    width: 120px;
    cursor: pointer;
    display: flex;
    margin-bottom: 20px;
  }
  .gunter-txt {
    color: #3e8ff7;
    transform: translate(4px, 8px);
  }
</style>
