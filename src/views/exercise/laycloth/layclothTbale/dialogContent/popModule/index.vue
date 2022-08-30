<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2022-08-29 13:06:46
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <LayclothForm :set-value="setValue" />
  <LayclothTbale :form="state.formList" :select="select" />
  <div class="footer">
    <div class="footer-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="preservation">保存</el-button>
    </div>
  </div>
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
    props: {
      operation: {
        type: Function,
        default: () => {}
      }
    },
    setup(props) {
      const state = reactive({
        formList: {},
        tableSelect: {}
      })
      const setValue = e => {
        state.formList = e
      }
      //选中
      const select = e => {
        // console.log('选中项', e)
        state.tableSelect = e
      }
      const cancel = e => {
        props.operation({ type: 'cancel', data: {} })
      }
      const preservation = e => {
        props.operation({ type: 'confirm', data: state.tableSelect })
      }

      return { state, setValue, select, cancel, preservation }
    }
  })
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
