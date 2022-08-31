<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-08-31 12:52:58
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 铺布 -->
  <LayCloth v-if="props.form.type === '1'" :type="props.type" :cancel="cancel" :preservation="preservation" :form="props.form" :list="props.list" />
  <!-- 裁剪 -->
  <Crop v-if="props.form.type === '3'" :type="props.type" :cancel="cancel" :preservation="preservation" :form="props.form" :list="props.list" />
</template>

<script lang="ts" setup>
  import LayCloth from './LayCloth/index.vue'
  import Crop from './Crop/index.vue'
  import { getCurrentInstance } from 'vue'
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    operation: any
    form: any
    type: boolean
    list: any
  }>()

  const cancel = () => {
    props.operation({ type: 'cancel', data: {} })
  }
  //确认、子组件数据
  const preservation = (e: any, type: string, title: any) => {
    let data = { ...e, defaultParam: title }

    //铺布
    if (type === 'layCloth') {
      proxy.$baseService.post('/jack-ics-api/spread-default-param/save', data).then((res: any) => {
        props.operation({ type: 'confirm', data: { list: e, title: title } })
      })
    }

    if (type === 'crop') {
      proxy.$baseService.post('/jack-ics-api/cut-default-param/save', data).then((res: any) => {
        props.operation({ type: 'confirm', data: { list: e, title: title } })
      })
    }
  }
</script>

<style>
  .footer {
    width: 100%;
    margin-top: 20px;
    height: 30px;
  }
  .footer-right {
    width: 150px;
    height: 30px;
    float: right;
  }
</style>
