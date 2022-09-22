<!--
 * @Author: lyj
 * @Date: 2022-08-17 15:35:46
 * @LastEditTime: 2022-09-22 22:13:54
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div v-if="props.disabled === true">
    <img v-if="state.fileList.length === 0" class="pictureImg" :src="state.img" />
    <img v-if="state.fileList.length === 1" class="disabledImg" :src="state.fileList[0].url" />
  </div>
  <div v-if="props.disabled === false">
    <IntellicutImg v-model="state.fileList" :model-value="state.fileList" :limit="state.limit" />
  </div>
</template>
<script lang="ts" setup>
  import IntellicutImg from './intellicutImg.vue'
  import { reactive, watch } from 'vue'
  import jackImg from '@/components/img/jack.png'
  import { isEmpty } from 'lodash'
  const props = defineProps<{
    gitImg: any
    value: any
    disabled: boolean
  }>()
  const state: any = reactive({
    fileList: props.value.img || [],
    limit: 1,
    img: jackImg
  })

  watch(
    () => props.value,
    (item: any) => {
       
      if (!isEmpty(props.value.img)) {
        if (item.img[0].url) {
          console.log(item.img);
          state.fileList = item.img
        }else{
        state.fileList=[]
        }
      }else{
        state.fileList=[]
      }
    }
  )

  watch(
    () => state.fileList,
    (item: any) => {
      props.gitImg({ type: 'img', data: item })
    }
  )
</script>
<style>
  .disabledContainer {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    background: #bbbdbb;
  }

  .pictureImg {
    padding: 10px;
    background: #bbbdbb;
    width: 100px;
    height: 100px;
  }
  .disabledImg {
    width: 100px;
    height: 100px;
    padding: 10px;
  }
</style>
