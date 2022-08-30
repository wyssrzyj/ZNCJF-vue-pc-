<!--
 * @Author: lyj
 * @Date: 2022-07-19 11:17:08
 * @LastEditTime: 2022-08-29 13:17:14
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <button @click="btn">跳转测试</button>

  <div class="Dome">代办事项Dome练习</div>
  <TodoInput :set-value="setValue" />
  <Dodos :list="state.list" :mov="mov" />
</template>

<script>
  import { defineComponent, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import TodoInput from './todoinput.vue' //输入框
  import Dodos from './todos.vue' //
  export default defineComponent({
    components: {
      //声明新增组件
      TodoInput,
      Dodos
    },
    setup() {
      const router = useRouter()

      const state = reactive({
        list: []
      })

      const setValue = e => {
        state.list.push({ id: Date.now(), name: e, type: true })
      }
      const mov = e => {
        state.list = state.list.filter(item => item.id !== e)
      }

      const btn = () => {
        // console.log(123456)
        // router.push({ name: "/njp/notice/notice-user", query: { num: 8848 } }); //URL中有值

        router.push({ name: '/njp/notice/notice-user', params: { name: 8848 } }) //url中没值
      }
      const loadDate = () => {
        // console.log('获取接口数据')
      }

      return { state, setValue, mov, btn, loadDate }
    },
    created() {
      // console.log(2)
      //获取接口  传递给 state中
      // loadDate();
      // console.log(state.list);
      // console.log('我是初始化获取接口数据')
    }
  })
</script>

<style>
  .Dome {
    color: red;
    font-size: 18px;
  }
</style>
