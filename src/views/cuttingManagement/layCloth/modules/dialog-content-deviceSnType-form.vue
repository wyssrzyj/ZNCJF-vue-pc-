<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-11-23 10:35:53
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="container">
      <el-form ref="formRef" :inline="true" :model="state.form" @keyup.enter="onSubmit()">
    <!-- <el-form-item  prop="spec" label="设备型号">
      <el-input v-model="state.form.spec" label-width="30px" />
    </el-form-item> -->
    <el-form-item prop="sn" label="设备编号">
      <el-input v-model="state.form.sn" label-width="30px" />
    </el-form-item>
    <el-form-item prop="name" label="设备名称">
      <el-input v-model="state.form.name" label-width="30px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary" @click="empty(formRef)">清空</el-button>
    </el-form-item>
  
  </el-form>
    <!-- 甘特图 -->
      <img @click="see" :src="layClothImg" alt="" class="time-img" />
  </div>


    <el-dialog v-if="state.imgType" v-model="state.imgType" :close-on-click-modal="false" :draggable="false" title="查看甘特图" width="1100px" hei>
     <ChartDisplay :chartDate='state.chartDate'/>
  </el-dialog>
</template>

<script lang="ts" setup>
import layClothImg from '@/components/icon/layCloth.png'
  import ChartDisplay from './chartDisplay-img.vue'
  import { reactive, ref } from 'vue'
  const formRef = ref()
  const props = defineProps<{
    value:any
    setValue: any
  }>()

  const state = reactive({
    form: {
      spec: '',
      sn: '',
      name: ''
    },
    dialogTableVisible: false,
    imgType: false,
    chartDate:{api:"/jack-ics-api/device/listAllUseTime",type:"equipment",height:"600px",
   deviceId:props.value.deviceId
  }


  })

  const onSubmit = () => {
    props.setValue && props.setValue(state.form)
  }
    const see = () => {
    state.imgType = true
  }
  // 清空
  const empty = (formEl: any) => {
    if (!formEl) return
    formEl.resetFields()
  }
</script>

<style scoped lang="less">
.container{
  position: relative;
}
  
  .time-img{
    cursor: pointer;

    position: absolute;
    top: 0;
    right: 10px;
  }
  </style>
