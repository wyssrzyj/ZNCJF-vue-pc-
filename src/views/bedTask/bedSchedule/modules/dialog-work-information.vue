<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-10-28 15:26:05
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="informationTitle">床次信息</div>
    <div class="work-row">
      <div class="work-infBlockLeft">床次计划：</div>
      <div class="work-infBlock">{{ state.list.bedPlanNo }}</div>
      <div class="work-infBlock-title">款式床次号：</div>
      <div class="work-infBlock">{{ state.list.styleBedNo }}</div>
      <div class="work-infBlock-title">款式编码：</div>
      <div class="work-infBlock">{{ state.list.styleCode }}</div>
      <div class="work-infBlock-title">款式名称：</div>
      <div class="work-infBlock">{{ state.list.styleName }}</div>
    </div>
    <div class="work-row">
      <div class="work-infBlockLeft">面料类型：</div>
      <div class="work-infBlock">{{ fabric.get(state.list.fabricType) }}</div>
      <div class="work-infBlock-title">面料编号：</div>
      <div class="work-infBlock">{{ state.list.fabricCode }}</div>
      <div class="work-infBlock-title">面料名称：</div>
      <div class="work-infBlock">{{ state.list.fabricName }}</div>
      <div class="work-infBlock-title">面料颜色：</div>
      <div class="work-infBlock">{{ state.list.fabricColor }}</div>
      <!-- <div class="rightBro"></div> -->
    </div>
    <div class="work-row">
      <div class="work-infBlockLeft">唛架门幅(mm)</div>
      <div class="work-infBlock">{{ state.list.shelfWidth }}</div>
      <div class="work-infBlock-title">唛架长度(mm)</div>
      <div class="work-infBlock">{{ state.list.shelfLength }}</div>
      <div class="work-infBlock-title">拉布长度(mm)</div>
      <div class="work-infBlock">{{ state.list.spreadClothLength }}</div>
      <div class="work-infBlock-title">计划拉布层数</div>
      <div class="work-infBlock">{{ state.list.planSpreadClothLevel }}</div>
      <!-- <div class="rightBro"></div> -->
    </div>
    <div class="work-row">
      <div class="work-infBlockLeft-bottom">版图名称:</div>
      <div class="infThree-bottom">{{ state.list.shelfFileName }}</div>
      <div class="work-infBlock-title-bottom">版图路径：</div>
      <div class="infThree-bottom">{{ state.list.shelfFileUrl }}</div>
    </div>
    <div class="work-infRow">
      <div class="work-infBlockLeft">备注:</div>
      <div class="work-remarks">{{ state.list.remark }}</div>
      <!-- <div class="work-infBlock-title">备注</div>
      <div class="infThree">{{ state.list.remark }}</div> -->
    </div>

    <div class="work-bottom"></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { fabric } from '@/components/conifgs'
  const props = defineProps<{
    data: any
  }>()

  const state = reactive({
    list: {
      bedPlanNo: '',
      styleBedNo: '',
      styleCode: '',
      styleName: '',
      fabricType: '',
      fabricCode: '',
      fabricName: '',
      fabricColor: '',
      shelfWidth: '',
      shelfLength: '',
      spreadClothLength: '',
      planSpreadClothLevel: '',
      shelfFileName: '',
      shelfFileUrl: '',
      remark: ''
    }
  })
  watch(
    () => props.data,
    item => {
      state.list = item
    }
  )
</script>

<style>
  .informationTitle {
    font-size: 15px;
    font-weight: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
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

  .work-row {
    display: flex;
    width: 1550px;
    height: 50px;
    border-top: 1px solid #000;
  }
  .work-infRow {
    margin-top: 15px;
    display: flex;
    width: 1550px;
    height: 50px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .work-bottom {
    width: 1550px;
    height: 1px;
    background: #000;
  }
  .work-infBlockLeft {
    width: 150px;
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
  }
  .work-infBlock-title {
    width: 150px;
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  .work-infBlock {
    width: 237px;
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  .rightBro {
    width: 1px;
    height: 50px;
    background: #000;
  }
  .infThree {
    width: 530px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  .work-remarks {
    width: 1450px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  /* 版图 */
  .work-infBlockLeft-bottom {
    width: 150px;
    font-size: 12px !important;
    height: 65px;
    text-align: center;
    line-height: 65px;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
  }
  .infThree-bottom {
    width: 625px;
    height: 65px;
    text-align: center;
    border-right: 1px solid #000;
    padding: 10px;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: normal;
  }
  .work-infBlock-title-bottom {
    width: 150px;
    font-size: 12px !important;
    height: 65px;
    text-align: center;
    line-height: 65px;
    border-right: 1px solid #000;
  }
</style>
