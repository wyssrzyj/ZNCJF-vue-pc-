<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-09-02 09:13:28
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 铺布 -->
  <LayCloth v-if="props.form.type === '1'" :list="props.list" :row="props.row" :type="props.type" :cancel="cancel" :preservation="preservation" />
  <!-- 裁剪 -->
  <Crop v-if="props.form.type === '3'" :list="props.list" :row="props.row" :type="props.type" :cancel="cancel" :preservation="preservation" />
</template>

<script lang="ts" setup>
  import Crop from './dialog-form-crop.vue'
  import LayCloth from './dialog-form-laycloth.vue'

  import { getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    operation: any
    form: any
    type: boolean
    row: any
    list: any
  }>()

  //确认、子组件数据
  const preservation = (e: any, type: string, title: any) => {
    let data = { ...e, defaultParam: title, deviceId: props.row.id }
    //铺布
    if (type === 'layCloth') {
      proxy.$baseService.post('/jack-ics-api/spreadDefaultParam/save', data).then((res: any) => {
        props.operation({ type: 'confirm', data: { list: e, title: title, paramId: res.data } })
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
      })
    }
    // 裁剪
    if (type === 'crop') {
      proxy.$baseService.post('/jack-ics-api/cutDefaultParam/save', data).then((res: any) => {
        props.operation({ type: 'confirm', data: { list: e, title: title, paramId: res.data } })
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }

  // 取消
  const cancel = () => {
    props.operation({ type: 'cancel', data: {} })
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
