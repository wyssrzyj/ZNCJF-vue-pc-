<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-18 19:08:33
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  dome测试
  <LayclothForm :set-value="setValue" />
  <LayclothTbale :form-list="state.formList" />
</template>

<script>
  import { reactive, defineComponent } from 'vue'
  import LayclothForm from './layclothForm/index.vue'
  import LayclothTbale from './layclothTbale/index.vue'

  export default defineComponent({
    components: {
      LayclothForm,
      LayclothTbale
    },
    setup() {
      const state = reactive({
        formList: {}
      })
      const setValue = e => {
        state.formList = e
      }

      return { state, setValue }
    }
  })
</script>

<style></style>
