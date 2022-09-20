<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-19 17:11:45
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div id="print">
    <div>
      <div class="topContainer">
        <vue-qr text="1008611" margin="5" size="120" />
        <div class="topRight">
          <div>浙江杰克智联智能设备科技有限公司</div>
          <div class="title">裁剪拉布单</div>
        </div>
      </div>
    </div>
      <Information  :data="state.data"/>
      <Ready :data="state.data"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive ,getCurrentInstance} from 'vue'
  import { isEmpty } from 'lodash';
  import Information from './dialog-print-information.vue'
  import Ready from './dialog-print-ready.vue'
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    id:any
  }>()

  const state = reactive({
    data: {}
  })
  const init = () => {
      proxy.$baseService.get('/jack-ics-api/print/getTaskCompleteInfo',{bedPlanId:props.id} ).then((res: any) => {
         if (!isEmpty(res.data)) {
        state.data = res.data
      }
      
      })
  }
  init()
</script>

<style>
  .topContainer {
    display: flex;
    width: 100%;
    height: 80px;
  }
  .topLeft {
    width: 15%;
  }
  .topRight {
    font-size: 20px;
    font-weight: 20px;
    width: 85%;
    text-align: center;
  }
  .title {
    font-size: 15px;
  }
  .information {
    margin-left: 40px;
  }
</style>
