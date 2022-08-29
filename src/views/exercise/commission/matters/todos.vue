<!--
 * @Author: lyj
 * @Date: 2022-07-19 11:21:48
 * @LastEditTime: 2022-08-29 13:15:00
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>子项合集</div>
  <div></div>
  <div v-for="item in list" :key="item.id">
    <Todo :item="item" :get-id="getId" :name="123" />
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue'
  import Todo from './todo.vue'

  export default defineComponent({
    components: {
      Todo
    },
    props: { list: Array, mov: Function },

    setup(props) {
      const state = reactive({
        // list: []
      })
      const getId = e => {
        props.mov(e)
      }
      return { state, getId }
    }
  })
</script>

<style></style>
