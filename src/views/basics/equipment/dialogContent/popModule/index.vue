<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-08-29 13:11:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 铺布 -->
  <LayCloth v-if="props.form.equipmentType === '1'" :type="props.type" :cancel="cancel" :preservation="preservation" />
  <!-- 裁剪 -->
  <Crop v-if="props.form.equipmentType === '3'" :type="props.type" :cancel="cancel" :preservation="preservation" />
</template>

<script lang="ts" setup>
  import LayCloth from './LayCloth/index.vue'
  import Crop from './Crop/index.vue'

  const props = defineProps<{
    operation: any
    form: any
    type: boolean
  }>()

  const cancel = () => {
    props.operation({ type: 'cancel', data: {} })
  }
  //确认、子组件数据
  const preservation = (e: any) => {
    props.operation({ type: 'confirm', data: e })
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
