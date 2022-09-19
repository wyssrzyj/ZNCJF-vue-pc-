<template>
  <el-form
    ref="rightFormRef"
    :rules="state.prop"
    :model="state.rightForm"
    :inline="true"
    label-width="auto"
    label-position="top"
  >
    <el-form-item label="生产订单：">
      <el-input v-model="state.rightForm.produceOrderCode" disabled />
    </el-form-item>

    <el-form-item label="款式床次号：">
      <el-input v-model="state.rightForm.styleBedNo" disabled />
    </el-form-item>
    <el-form-item label="床次计划号：" required prop="bedPlanNo">
      <el-input :value="state.rightForm.bedPlanNo" :placeholder="`请选择床次计划号：`">
        <template #append>
          <span class="setting" @click="setBedPlanNo"
            ><el-icon><Setting color="#3e8ff7" /></el-icon
          ></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="铺布任务号：">
      <el-input v-model="state.rightForm.taskCode" disabled />
    </el-form-item>
    <el-form-item label="面料编号：">
      <el-input v-model="state.rightForm.fabricCode" disabled />
    </el-form-item>
    <el-form-item label="面料名称：">
      <el-input v-model="state.rightForm.fabricName" disabled />
    </el-form-item>
    <el-form-item label="面料颜色：">
      <el-input v-model="state.rightForm.fabricColor" disabled />
    </el-form-item>
    <el-form-item label="唛架长度：">
      <div class="layCloth-row">
        <el-input v-model="state.rightForm.spreadClothLength" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="唛架门幅：">
      <div class="layCloth-row">
        <el-input v-model="state.rightForm.shelfWidth" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="铺布长度：">
      <div class="layCloth-row">
        <el-input v-model="state.rightForm.spreadClothLength" disabled />
        <span>米</span>
      </div>
    </el-form-item>
    <el-form-item label="设备编号：" required prop="deviceSn">
      <el-input :value="state.rightForm.deviceSn" :placeholder="`请选择设备编号`">
        <template #append>
          <span class="setting" @click="setDeviceSn"
            ><el-icon><Setting color="#3e8ff7" /></el-icon
          ></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="设备名称：">
      <el-input v-model="state.rightForm.deviceName" disabled />
    </el-form-item>
    <el-form-item label="铺布层数：">
      <el-input v-model="state.rightForm.spreadClothLevel" disabled />
    </el-form-item>
    <el-form-item label="损耗率%：">
      <el-input v-model="state.rightForm.useRate" disabled />
    </el-form-item>
    <el-form-item label="单层件数：">
      <el-input v-model="state.rightForm.levelClothSum" disabled />
    </el-form-item>
    <el-form-item label="床次总件数：">
      <el-input v-model="state.rightForm.bedSum" disabled />
    </el-form-item>
  </el-form>
  <!-- 床次计划 -->
  <el-dialog
    v-if="state.bedPlanNoType"
    v-model="state.bedPlanNoType"
    title="床次计划"
    width="1100px"
  >
    <DeviceSn :type="props.type" :operation="operation" />
  </el-dialog>
  <!-- 设备编号 -->
  <el-dialog
    v-if="state.deviceSnType"
    v-model="state.deviceSnType"
    title="床次计划"
    width="1100px"
  >
    <DeviceSnType :type="props.type" :operation="setDeviceSnType" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, defineExpose, ref, defineEmits, watch } from "vue";
import { ElMessage } from "element-plus";
import DeviceSn from "./dialog-content-deviceSn.vue";
import DeviceSnType from "./dialog-content-deviceSnType.vue";

import { selectDevice } from "./conifgs";
const { formData, dataRule } = selectDevice;

const emit = defineEmits(["changeFrom"]);

const rightFormRef = ref<any>();
const props = defineProps<{
  type: any;
  setData: any;
  value: any;
}>();

const state: any = reactive({
  rightForm: formData,
  prop: dataRule,

  //设备
  device: {
    deviceId: "",
    deviceSn: "",
  },
  bedPlanNoType: false,
  deviceSnType: false,
});

//初始渲染赋值
const init = () => {
  state.rightForm = props.value;
};
init();


watch(
  () => props.value,
  (item: any) => {
    state.device.deviceId = item.deviceId;
    state.device.deviceSn = item.deviceSn;

    state.rightForm = item;
    props.setData("1", state.rightForm);
  }
);

const validateFrom = () => {
  submitForm(rightFormRef);
};
// 校验表单
const submitForm = async (formEl: any | undefined | any) => {
  if (!formEl) return;
  await formEl.value.validate((valid: any) => {
    if (valid) {
      emit("changeFrom", state.rightForm);
    }
  });
};

defineExpose({ validateFrom });

const setBedPlanNo = () => {
  state.bedPlanNoType = true;
};
const setDeviceSn = () => {
  state.deviceSnType = true;
};
//设置床次数据
const operation = (e: any) => {
  if (e.type === "cancel") {
    state.bedPlanNoType = false;
  }
  if (e.type === "confirm") {
    e.data.bedPlanId = e.data.id;
    //设备
    e.data.deviceId = state.device.deviceId;
    e.data.deviceSn = state.device.deviceSn;

    state.rightForm = e.data;
    props.setData("1", state.rightForm);

    ElMessage({
      message: "床次计划号添加成功",
      type: "success",
    });
    state.bedPlanNoType = false;
  }
};
//设置设备编号数据

const setDeviceSnType = (e: any) => {
  if (e.type === "cancel") {
    state.deviceSnType = false;
  }
  if (e.type === "confirm") {
    //存一份用于回显111
    state.device.deviceId = e.data.id;
    state.device.deviceSn = e.data.sn;

    state.rightForm.deviceId = e.data.id;
    state.rightForm.deviceSn = e.data.sn;

    props.setData("1", state.rightForm);

    ElMessage({
      message: "设备编号添加成功",
      type: "success",
    });
    state.deviceSnType = false;
  }
};
</script>

<style scoped lang="less">
.layCloth-row {
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
.setting {
  cursor: pointer;
}
</style>
