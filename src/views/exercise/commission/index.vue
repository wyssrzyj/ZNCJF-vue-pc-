<!--
 * @Author: lyj
 * @Date: 2022-06-14 14:15:08
 * @LastEditTime: 2022-08-29 13:14:07
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>Dome练习111111</div>
  <ul>
    <input v-model="state.text" type="text" />
    <span>{{ state.text }}</span>
    <div><input v-model="getSms" type="checkbox" />全选</div>
    <li v-for="(item, index) in state.list" :key="index">
      <input v-model="item.type" type="checkbox" />{{ item.name }}--{{ item.price }} <button @click="item.sum++">+</button> 【{{ item.sum }}】
      <button @click="item.sum > 1 ? item.sum-- : null">-</button>
    </li>
    <div>总数量{{ state.data.sum }}</div>
    <span>总价: {{ state.prices }}</span>
    <!-- <Lyj :product="state.text" :lyj="99999" :getLyj="getLyj" /> -->
  </ul>
  <span v-for="(item, index) in state.valueChild" :key="index"> 名字：{{ item.name }} </span>
  <Matters />
  <div>图表dome</div>
  <EchartsDome />
  <div>fromDome联系</div>
  <FormDome />
</template>

<script lang="ts">
  import { computed, defineComponent, reactive } from 'vue'
  // import Lyj from "./lyj.vue";
  import Matters from './matters/index.vue'
  import EchartsDome from './echartsDome/indrx.vue'
  // import FormDome from './formDome/index.vue'

  export default defineComponent({
    components: {
      //声明新增组件。
      // Lyj,
      Matters,
      EchartsDome
      // FormDome
    },
    setup() {
      const state = reactive({
        text: '输入框1',
        prices: 666,
        data: { sum: 888 },
        product: '9999',
        list: [
          { name: '苹果', type: true, price: 1, sum: 1 },
          { name: '西瓜', type: false, price: 2, sum: 2 },
          { name: '菠萝', type: true, price: 3, sum: 3 },
          { name: '沃柑', type: false, price: 4, sum: 4 }
        ],
        valueChild: []
      })

      // watch(
      //   () => [state.list],
      //   item => {
      //     console.log('我发生了改变12', item)
      //   }
      // )

      //获取总价格
      const totalPrice = (list: any) => {
        let listType = list.filter((item: any) => item.type === true)
        let sum = 0
        listType.forEach((item: any) => {
          sum += item.price * item.sum
        })

        state.prices = sum
      }

      let getSms = computed({
        set(v: any) {
          totalPrice(state.list)
          return state.list.map(item => (item.type = v))
        },
        get() {
          totalPrice(state.list)
          return state.list.length === state.list.filter(item => item.type).length
        }
      })
      let getLyj = (e: any) => {
        state.valueChild = e
      }

      return { state, getSms, getLyj }
    }
  })
</script>

<style></style>
