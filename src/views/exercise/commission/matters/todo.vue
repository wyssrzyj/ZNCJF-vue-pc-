<!--
 * @Author: lyj
 * @Date: 2022-07-19 14:12:40
 * @LastEditTime: 2022-08-29 13:14:51
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <h1>{{ item.name }}</h1>
    <br />
    <div>
      <button v-show="item.type === true" @click="end">完成</button>
      <button @click="mov">删除</button>
    </div>
  </div>
</template>

<script>
  import { computed, reactive, defineComponent } from 'vue'
  // defineProps

  export default defineComponent({
    props: {
      item: { id: Date.now(), name: String, type: Boolean },
      getId: Function
    },
    setup(props) {
      const state = reactive({
        arr: []
      })
      const abc = computed(() => props.item)

      // const setGetId = computed(() => props.getId);

      const end = () => {
        abc.value.type = false
      }
      const mov = () => {
        props.getId(props.item.id)
      }

      return { state, mov, end }
    }
  })
  // const props = defineProps({
  //   item: {
  //     default: () => ({ id: "", name: "", type: true })
  //   },
  //   getId: Function,
  //   name: String
  // });
</script>

<style></style>
