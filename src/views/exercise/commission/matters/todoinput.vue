<!--
 * @Author: lyj
 * @Date: 2022-07-19 11:07:44
 * @LastEditTime: 2022-08-29 13:14:57
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <input v-model="state.txt" type="text" @keyup.enter="inputText" />
</template>

<script>
  import { defineComponent, reactive } from 'vue'

  export default defineComponent({
    props: { setValue: Function },
    setup(props) {
      const state = reactive({
        txt: '练习'
      })
      const inputText = e => {
        if (state.txt) {
          props.setValue(e.target.value)
          state.txt = ''
        }
      }
      return { state, inputText }
    }
  })
</script>

<style></style>
