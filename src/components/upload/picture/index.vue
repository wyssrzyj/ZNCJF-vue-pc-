<!--
 * @Author: lyj
 * @Date: 2022-08-17 15:35:46
 * @LastEditTime: 2022-11-17 16:35:21
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div v-if="props.disabled === true">
    <img v-if="state.fileList.length === 0" class="pictureImg" :src="state.img" />
    <!-- style="width: 100px; height: 100px" -->
    <el-image v-if="state.fileList.length === 1" class="disabledImg" :src="state.fileList[0].url" :preview-src-list="state.srcList" :initial-index="4" fit="cover" />
  </div>
  <div v-if="props.disabled === false">
    <IntellicutImg :getFileList="getFileList" v-model="state.fileList" :value="state.fileList" :limit="state.limit" />
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
    img: jackImg,
    srcList: []
  })

  watch(
    () => props.value,
    (item: any) => {
      if (!isEmpty(props.value.img)) {
        if (item.img[0].url) {
          state.fileList = item.img
          state.srcList = [item.img[0].url]
        } else {
          state.fileList = []
        }
      } else {
        state.fileList = []
      }
    }
  )
 
  const getFileList=(e:any)=>{
    let res =e[0].response.data.src
      props.gitImg({ type: 'img', data: [{url:res}] })
  }
</script>
<style>
  .disabledContainer {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    background: #bbbdbb;
  }

  .pictureImg {
    border-radius: 10px;
    padding: 10px;
    background: #bbbdbb;
    width: 100px;
    height: 100px;
  }
  .disabledImg {
    width: 100px;
    height: 100px;
    padding: 10px;
    border-radius: 10px;
  }
</style>
