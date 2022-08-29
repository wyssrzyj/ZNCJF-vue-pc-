<!--
 * @Author: lyj
 * @Date: 2022-08-17 12:58:20
 * @LastEditTime: 2022-08-18 14:06:51
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <Picture v-if="state.type === 'img'" :git-img="gitImg" :value="value" />
  <File v-if="state.type === 'file'" :git-file="gitFile" :value="value" />
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue'
  import File from './file/index.vue'
  import Picture from './picture/index.vue'
  export default defineComponent({
    components: {
      //声明新增组件
      File,
      Picture
    },
    model: {
      prop: 'img',
      event: 'custom'
    },
    props: { type: String, getData: Function, value: Array },
    setup(props) {
      const state = reactive({
        value: props.value,
        type: props.type
      })

      const gitImg = (e: any) => {
        props.getData(e)
      }
      const gitFile = (e: any) => {
        props.getData(e)
      }
      return { state, gitImg, gitFile }
    }
  })
</script>

<style></style>
