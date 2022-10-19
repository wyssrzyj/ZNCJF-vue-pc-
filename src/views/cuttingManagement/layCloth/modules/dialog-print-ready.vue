<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-10-17 15:41:49
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="informationTitle">成衣明细</div>
  <div class="work-container">
    <!--表头 -->
    <div class="work-top-head">
      <div class="work-ready-two">面料颜色</div>
      <div class="work-ready-two">拉布层数</div>
      <div class="work-ready-two">尺码配比</div>

      <div v-if="state.list.length > 0" class="dynamic">
        <div v-for="(item, index) in state.list" :key="index">
          <div :style="{ width: `${state.width}px` }" class="work-dynamic">{{ item.size }}</div>
          <div :style="{ width: `${state.width}px` }" class="work-dynamic">{{ item.levelClothSum }}</div>
        </div>
      </div>

      <div v-if="state.list.length === 0" class="dynamic">
        <div>
          <div :style="{ width: `1000px` }" class="work-dynamic">{{}}</div>
          <div :style="{ width: `1000px` }" class="work-dynamic">{{}}</div>
        </div>
      </div>
      <div>
        <div class="work-ready-block-r">件数</div>
        <div class="work-ready-block-r">{{ state.levelClothSums }}</div>
      </div>
    </div>
    <!-- 列表数据 -->
    <div v-for="(item, i) in state.color" :key="i" class="work-top-data">
      <div class="work-ready-one">{{ item.color }}</div>
      <div class="work-ready-one">{{ item.spreadClothLevel }}</div>
      <div class="work-ready-one">{{ item.color }}</div>
      <div v-if="state.list.length > 0" class="dynamic">
        <div v-for="(v, index) in state.list" :key="index" :style="{ width: `${state.width}px` }" class="work-dynamic">{{ item[v.size] }}</div>
      </div>
      <div v-if="state.list.length === 0" class="dynamic">
        <div :style="{ width: `1000px` }" class="work-dynamic">{{}}</div>
      </div>
      <div>
        <div class="work-ready-block-r">{{ item.sum }}</div>
      </div>
    </div>
    <!-- 尾部 -->
    <div class="work-top-bottom">
      <div class="work-ready-one-bottom">合计</div>
      <div class="work-ready-block-r-bottom">{{ state.sum }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { isEmpty, cloneDeep } from 'lodash'
  import { reactive, watch } from 'vue'
  const props = defineProps<{
    data: any
  }>()

  const state = reactive({
    list: [],
    color: [],
    levelClothSums: 0,
    sum: 0, //合计
    width: 1000
  })

  //  获取当前项总和
  const currentAnd = (topData: any, data: any) => {
    let sum = 0
    //获取当前行的总和
    let sizeData: any = []
    topData.forEach((item: any) => {
      sizeData.push(item.size)
    })
    sizeData.forEach((item: any) => {
      if (data[item]) {
        sum += Number(data[item])
      }
    })
    return sum
  }

  //计算积
  const addData = (size: any, topData: any, data: any) => {
    let dataClone = cloneDeep(topData)
    let arr = dataClone.filter((item: any) => item.size === size)
    let sum = data.spreadClothLevel * Number(arr[0].levelClothSum)
    return sum
  }

  //添加对应的字段并赋值
  const setSize = (v: any, item: any) => {
      let topData = item.sizeAndAmountList //动态头
    let data = cloneDeep(v)
    let size = item.colorAndSizeList
    //给每一项添加对应的字段
    size.forEach((i: any) => {
      console.log(data.color);
      console.log(i.color);
      if (data.color === i.color) {
        console.log(addData(i.size, topData, data));
        data[i.size] = addData(i.size, topData, data)
      }
    })

    data.sum = currentAnd(topData, data)
    return data
  }

  //处理数据格式
  const setDataFormat = (item: any) => {
    let list = cloneDeep(item.colorAndLevelList)
    let arr: any = []
    //添加对应字段
    if (!isEmpty(item.colorAndSizeList)) {
      list.forEach((v: any) => {
        arr.push(setSize(v, item))
      })
    }
    return arr
  }

  watch(
    () => props.data,
    item => {
      // 动态头部
      let dynamic = item.sizeAndAmountList

      if (!isEmpty(dynamic)) {
        let sum = 0
        dynamic.forEach((item: any) => {
          sum += Number(item.levelClothSum)
        })
        //单层件树总和
        state.levelClothSums = sum
      }else{
        state.levelClothSums = 0

      }
      
      state.list = !isEmpty(dynamic) ? dynamic : []


      if (!isEmpty(dynamic)) {
        state.width = 1000 / dynamic.length
      }
      // 列表
      state.color = setDataFormat(item)

      console.log("测试",state.color);

      //合计
      const dataSum = state.color.reduce((total, current: any) => {
        total += current.sum
        return total
      }, 0)
      state.sum = dataSum
    }
  )
</script>

<style>
  .work-container {
    width: 1550px;
    height: 100%;
  }
  /* 动态的 */
  .work-dynamic {
    font-size: 12px !important;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
  }

  /* 头部 */
  .work-top-head {
    margin-bottom: 50px;
    display: flex;
    height: 50px;
  }
  .work-top-data {
    display: flex;
    width: 100%;
    height: 50px;
  }

  .work-ready-two {
    font-size: 12px !important;
    width: 150px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
  }
  .work-ready-one {
    font-size: 12px !important;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
  }

  .work-ready-one-bottom {
    font-size: 12px !important;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  .work-ready-block-r {
    font-size: 12px !important;
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    border-top: 1px solid #000;
  }

  /* 底部 */
  .work-top-bottom {
    display: flex;
    height: 50px;
  }
  .work-ready-block-r-bottom {
    flex: 1;
    font-size: 12px !important;
    /* width: 1250px; */
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #000;
  }
  .work-top {
    display: flex;
    width: 100%;
    height: 50px;
  }
  /* 动态 */
  .dynamic {
    width: 1000px;
    /* height: 50px; */
    display: flex;
  }
</style>
