<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2023-02-04 13:14:20
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div id="work">
    <div>
      <div class="topContainer">
       测试 {{ state.data.bedPlanId }}
        <vue-qr :text="state.data.bedPlanId" margin="5" size="120" />
        <div class="topRight">
          <div class="title">裁铺任务工单</div>
        </div>
      </div>
    </div>
    <Information :data="state.data" />
    <Ready :data="state.data" />
  </div>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash'
  import { reactive, getCurrentInstance } from 'vue'
  import VueQr from 'vue-qr/src/packages/vue-qr.vue'
  import Information from './dialog-work-information.vue'
  import Ready from './dialog-work-ready.vue'
  const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    id: any
  }>()

  const state: any = reactive({
    data: {
      bedPlanId:"",//打印二维码
    }
  })

  const init = () => {
  if(props.id){
     proxy.$baseService.get('/jack-ics-api/print/getTaskInfo', { bedPlanId: props.id }).then((res: any) => {
      if (!isEmpty(res.data)) {
        state.data = res.data

      }
    })
  }
   
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
</style>
