<!--state\.list
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-28 16:49:45
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="informationTitle">床次信息</div>
    <div class="print-row">
      <div class="block-title">床次计划：</div>
      <div class="block">{{ state.list.bedPlanNo }}</div>
      <div class="block-title">款式床次号：</div>
      <div class="block">{{ state.list.styleBedNo }}</div>
      <div class="block-title">款号：</div>
      <div class="block">{{ state.list.styleCode }}</div>
      <div class="block-title">款式：</div>
      <div class="block-r">{{ state.list.styleName }}</div>
      <div class="rightBro"></div>
    </div>
    <div class="print-row">
      <div class="block-f-title">面料类型：</div>
      <div class="block-f">{{ fabric.get(state.list.fabricType) }}</div>
      <div class="block-f-title">布号：</div>
      <div class="block-f">{{ state.list.fabricCode }}</div>
      <div class="block-f-title">面料名称：</div>
      <div class="block-f">{{ state.list.fabricName }}</div>
      <div class="block-f-title">面料颜色：</div>
      <div class="block-fl">{{ state.list.fabricColor }}</div>
      <div class="rightBro"></div>
    </div>
    <div class="print-row">
      <div class="block-f-title">计划拉布层数：</div>
      <div class="block-f">{{ state.list.planSpreadClothLevel }}</div>

      <div class="block-f-title">实际拉布层数：</div>
      <div class="block-f">{{ state.list.actualSpreadClothLevel }}</div>
      <div class="block-f-title">主料：</div>
      <div class="block-f">
        <el-icon v-if="state.list.primaryFlag === 1"><Select /></el-icon>
      </div>
      <div class="block-f-title">辅料：</div>
      <div class="block-fl">
        <el-icon v-if="state.list.primaryFlag === 0"><Select /></el-icon>
      </div>
      <div class="rightBro"></div>
    </div>
    <div class="bottom"></div>

    <div class="informationTitle">唛架信息</div>
    <div class="print-row">
      <div class="block-f-title">唛架门幅(mm):</div>
      <div class="block-f">{{ state.list.shelfWidth }}</div>
      <div class="block-f-title">唛架长度(mm):</div>
      <div class="block-f">{{ state.list.shelfLength }}</div>
      <div class="block-f-title">拉布长度(mm):</div>
      <div class="block-f">{{ state.list.spreadClothLength }}</div>
      <div class="block-f-title">唛架利用率</div>
      <div class="block-fl">{{ state.list.useRate }}%</div>
      <div class="rightBro"></div>
    </div>
    <div class="bottom"></div>

    <div class="informationTitle">拉布明细</div>
    <div class="print-row">
      <div class="block-f">面料颜色:</div>
      <div class="block-f">缸号</div>
      <div class="block-f">区号:</div>
      <div class="block-f">门幅</div>
      <div class="block-f">拉布层数</div>
      <div class="block-f">拉布米长</div>
      <div class="block-f">标签米长</div>
      <div class="block-f">余布米长</div>
      <div class="block-f">备次米长</div>
      <div class="block-f">接驳米长</div>
      <div class="block-fl">短米数</div>
      <div class="rightBro"></div>
    </div>

    <div v-for="(item, index) in state.list.spreadDetailIntermediateList" :key="index" class="print-row">
      <div class="block-f">{{ item.fabricColor }}</div>
      <div class="block-f">{{ item.vatNo }}</div>
      <div class="block-f">{{ item.clothNo }}</div>
      <div class="block-f">{{ item.shelfWidth }}</div>
      <div class="block-f">{{ item.spreadClothLevel }}</div>
      <div class="block-f">{{ item.spreadClothTotalLength }}</div>
      <div class="block-f">{{ item.tagLength }}</div>
      <div class="block-f">{{ item.remainLength }}</div>
      <div class="block-f">{{ item.reserveLength }}</div>
      <div class="block-f">{{ item.appendLength }}</div>
      <div class="block-fl">{{ item.shortLength }}</div>
      <div class="rightBro"></div>
    </div>

    <div class="bottom"></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { fabric } from '@/components/conifgs'
  import { cloneDeep } from 'lodash'
  const props = defineProps<{
    data: any
  }>()

  const state: any = reactive({
    list: {}
  })
  watch(
    () => props.data,
    item => {
      state.list = cloneDeep(item)
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

  .print-row {
    display: flex;
    width: 1550px;
    height: 50px;
    border-top: 1px solid #000;
  }
  .bottom {
    width: 800px;
    height: 1px;
    background: #000;
  }
  .block-title {
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
  }
  .block {
    width: 237px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
  }
  .block-f {
    width: 237px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .block-f-title {
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .block-fl {
    width: 237px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }
  .block-r {
    width: 237px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
  }
  .rightBro {
    width: 1px;
    height: 50px;
    background: #000;
  }
  .three {
    width: 300px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
  }
</style>
