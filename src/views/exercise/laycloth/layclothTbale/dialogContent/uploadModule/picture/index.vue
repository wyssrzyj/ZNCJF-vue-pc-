<!--
 * @Author: lyj
 * @Date: 2022-08-17 15:35:46
 * @LastEditTime: 2022-08-18 13:52:24
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <njp-upload-images-v1 v-model="state.fileList" :limit="state.limit" />
</template>
<script lang="ts">
  import { defineComponent, reactive, watch } from 'vue'

  export default defineComponent({
    props: {
      gitImg: {
        type: Function,
        default: () => {}
      },
      value: Array
    },
    setup(props) {
      const state = reactive({
        fileList: props.value || [],
        limit: 1
      })
      watch(
        () => state.fileList,
        (item: any) => {
          props.gitImg({ type: 'img', data: [] })
        }
      )
      return { state }
    }
  })
</script>
