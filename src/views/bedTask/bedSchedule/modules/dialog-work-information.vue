<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-19 09:11:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="informationTitle">床次信息</div>
    <div class="row">
      <div class="infBlockLeft">床次计划：</div>
      <div class="infBlock">{{ state.list.bedPlanNo }}</div>
      <div class="infBlock-title">款式床次号：</div>
      <div class="infBlock">{{ state.list.styleBedNo }}</div>
      <div class="infBlock-title">款式编码：</div>
      <div class="infBlock">{{ state.list.styleCode }}</div>
      <div class="infBlock-title">款式名称：</div>
      <div class="infBlock">{{ state.list.styleName }}</div>
    </div>
    <div class="row">
      <div class="infBlockLeft">面料类型：</div>
      <div class="block-f">{{ fabric.get(Number(state.list.fabricType) ) }}</div>
      <div class="infBlock-title">面料编号：</div>
      <div class="infBlock">{{ state.list.fabricCode }}</div>
      <div class="infBlock-title">面料名称：</div>
      <div class="infBlock">{{ state.list.fabricName }}</div>
      <div class="infBlock-title">面料颜色：</div>
      <div class="infBlock">{{ state.list.fabricColor }}</div>
      <!-- <div class="rightBro"></div> -->
    </div>
    <div class="row">
      <div class="infBlockLeft">唛架门幅(米)</div>
      <div class="infBlock">{{ state.list.shelfWidth }}</div>
      <div class="infBlock-title">唛架长度(米)</div>
      <div class="infBlock">{{ state.list.shelfLength }}</div>
      <div class="infBlock-title">拉布长度(米)</div>
      <div class="infBlock">{{ state.list.spreadClothLength }}</div>
      <div class="infBlock-title">计划拉布层数</div>
      <div class="infBlock">{{ state.list.planSpreadClothLevel }}</div>
      <!-- <div class="rightBro"></div> -->
    </div>
    <div class="row">
      <div class="infBlockLeft">版图名称:</div>
      <div class="infThree">{{ state.list.shelfFileName }}</div>
      <div class="infBlock-title">版图路径：</div>
      <div class="infThree">{{ state.list.shelfFileUrl }}</div>
    </div>
    <div class="infRow">
      <div class="infBlockLeft">备注:</div>
      <div class="remarks">{{ state.list.planSpreadClothLevel }}</div>
      <!-- <div class="infBlock-title">备注</div>
      <div class="infThree">{{ state.list.remark }}</div> -->
    </div>

    <div class="bottom"></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import {  fabric } from '@/components/conifgs.ts'
  const props = defineProps<{
    data: any
  }>()

  const state = reactive({
    list: {}
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

  .infRow {
    display: flex;
    width: 1200px;
    height: 50px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .row {
    display: flex;
    width: 1200px;
    height: 50px;
    border-top: 1px solid #000;
  }
  .bottom {
    width: 1200px;
    height: 1px;
    background: #000;
  }
  .infBlockLeft {
    width: 100px;
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
  }
  .infBlock-title {
    width: 100px;
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  .infBlock {
    width: 200px;
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
    width: 500px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
  .remarks{
        width: 1100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-right: 1px solid #000;
  }
</style>
