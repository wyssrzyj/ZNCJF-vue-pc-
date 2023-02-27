<template>
  <el-form ref="rightFormRef" class="rightFormRef" :rules="state.prop" :model="state.rightForm" :inline="true" label-width="auto" label-position="top">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <el-col :span="6">
        <el-form-item label="生产订单">
          <el-input v-model="state.rightForm.produceOrderCode" disabled />
        </el-form-item>
        <el-form-item label="床次">
          <el-input v-model="state.rightForm.styleBedNo" disabled />
        </el-form-item>
        <el-form-item label="床次计划号" required prop="bedPlanNo" class="deviceSn">
          <el-input disabled :value="state.rightForm.bedPlanNo" :placeholder="`请选择床次`" />
          <!-- <span class="setting" @click="setBedPlanNo"  暂时注销 22.9.23 13-02 -->
          <div class="bedPlanNo-img">
            <el-icon><Search /></el-icon>
          </div>
        </el-form-item>
        <el-form-item label="铺布任务号">
          <el-input v-model="state.rightForm.taskCode" disabled />
        </el-form-item>
        <el-form-item label="计划开始时间：">
          <el-date-picker v-model="state.rightForm.planStartTime" :clearable="false" value-format="x" format="YYYY-MM-DD HH:mm" type="datetime" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="面料编号">
          <el-input v-model="state.rightForm.fabricCode" disabled />
        </el-form-item>
        <el-form-item label="面料名称">
          <el-input v-model="state.rightForm.fabricName" disabled />
        </el-form-item>
        <el-form-item label="面料颜色">
          <el-input v-model="state.rightForm.fabricColor" disabled />
        </el-form-item>
        <el-form-item label="唛架长度 (mm)">
          <el-input v-model="state.rightForm.shelfLength" disabled />
        </el-form-item>
        <el-form-item label="计划结束时间：">
          <el-date-picker v-model="state.rightForm.planEndTime" :clearable="false" value-format="x" format="YYYY-MM-DD HH:mm" type="datetime" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="唛架门幅 (mm)">
          <el-input v-model="state.rightForm.shelfWidth" disabled />
        </el-form-item>
        <el-form-item label="铺布长度 (mm)">
          <el-input v-model="state.rightForm.spreadClothLength" disabled />
        </el-form-item>
        <el-form-item label="设备编号" required prop="deviceSn" class="deviceSn">
          <el-input :value="state.rightForm.deviceSn" :placeholder="`请选择设备编号`" disabled />
          <!-- <img :src="equipmentIcon" alt="" class="setting-img" @click="setDeviceSn" /> -->
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="state.rightForm.deviceName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="铺布层数">
          <el-input v-model="state.rightForm.spreadClothLevel" disabled />
        </el-form-item>
        <el-form-item label="利用率%">
          <el-input v-model="state.rightForm.useRate" disabled />
        </el-form-item>
        <el-form-item label="单层件数">
          <el-input v-model="state.rightForm.levelClothSum" disabled />
        </el-form-item>
        <el-form-item label="床次总件数">
          <el-input v-model="state.rightForm.bedSum" disabled />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <!-- 床次计划 -->
  <el-dialog v-if="state.bedPlanNoType" v-model="state.bedPlanNoType" :draggable="false" :close-on-click-modal="false" title="床次计划" width="1100px">
    <DeviceSn :type="props.type" :operation="operation" />
  </el-dialog>
  <!-- 设备编号 -->
  <el-dialog v-if="state.deviceSnType" v-model="state.deviceSnType" :draggable="false" :close-on-click-modal="false" title="设备编号" width="1100px">
    <DeviceSnType :type="props.type" :operation="setDeviceSnType" :value="props.value" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import DeviceSn from './dialog-content-deviceSn.vue'
  import DeviceSnType from './dialog-content-deviceSnType.vue'

  // import equipmentIcon from '@/components/icon/equipment-icon.png'

  import { selectDevice } from './conifgs'
  const { formData, dataRule } = selectDevice

  // const emit = defineEmits(['changeFrom'])

  const rightFormRef = ref<any>()
  const props = defineProps<{
    type: any
    setData: any
    value: any
  }>()

  const state: any = reactive({
    rightForm: formData,
    prop: dataRule,

    //设备
    device: {
      deviceId: '',
      deviceSn: ''
    },
    bedPlanNoType: false,
    deviceSnType: false
  })

  //初始渲染赋值
  const init = () => {
    state.rightForm = props.value
  }
  init()

  watch(
    () => props.value,
    (item: any) => {
      try {
        state.device.deviceId = item.deviceId
        state.device.deviceSn = item.deviceSn
        state.rightForm = item
        props.setData('1', state.rightForm)
      } catch (error) {}
    }
  )

  // 暂时关闭 2-24
  // const setDeviceSn = () => {
  //   if (!props.type) {
  //     state.deviceSnType = true
  //   }
  // }
  //设置床次数据
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.bedPlanNoType = false
    }
    if (e.type === 'confirm') {
      e.data.bedPlanId = e.data.id
      //设备
      // e.data.deviceId = state.device.deviceId;
      // e.data.deviceSn = state.device.deviceSn;

      state.rightForm = e.data
      props.setData('1', state.rightForm)

      ElMessage({
        message: '床次添加成功',
        type: 'success'
      })
      state.bedPlanNoType = false
    }
  }
  //设置设备编号数据
  const setDeviceSnType = (e: any) => {
    if (e.type === 'cancel') {
      state.deviceSnType = false
    }
    if (e.type === 'confirm') {
      //存一份用于回显111
      state.device.deviceId = e.data.id
      state.device.deviceSn = e.data.sn
      state.rightForm.deviceId = e.data.id
      state.rightForm.deviceSn = e.data.sn

      state.rightForm.deviceName = e.data.equipmentName

      state.rightForm.labelingSn = e.data.labelingSn
      state.rightForm.labelingName = e.data.labelingName

      props.setData('1', state.rightForm)
      // ElMessage({
      //   message: '设备编号添加成功',
      //   type: 'success'
      // })
      state.deviceSnType = false
    }
  }
</script>

<style scoped lang="less">
  .layCloth-row {
    position: relative;
    .el-input {
      width: 50px !important;
    }
    .spreadClothLength {
      margin-left: 100px;
    }
  }

  .numberRight {
    position: relative;

    right: -100px;
    top: 0;
    width: 58px;
    text-align: center;
    background-color: #eaeaea;
    display: inline-block;
  }

  .setting {
    cursor: pointer;
  }

  .deviceSn {
    position: relative;
  }

  .setting-img {
    position: absolute;
    left: 200px;
    top: -2px;
    width: 35px;
    cursor: pointer;
  }
  .bedPlanNo-img {
    position: absolute;
    left: 210px;
    top: 2px;
    width: 25px;
    cursor: pointer;
  }
  .rightFormRef {
    transform: translateX(-20px);
    display: block;
    /deep/ .el-input {
      width: 250px;
    }
    /deep/ .el-input__inner {
      text-align: left !important; //输入框左对齐
    }
  }
</style>
