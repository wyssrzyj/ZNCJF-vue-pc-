<!--
 * @Author: lyj
 * @Date: 2022-08-18 14:56:09
 * @LastEditTime: 2023-02-13 08:55:03
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="dialog-formula-container">
    <div v-for="(item, index) in state.list" :key="index">
      <div class="dialog-formula-top" @click="setStyle(index)"><span>公式1</span> <el-checkbox v-model="item.type" label="" size="large" @change="setStyle(index)" /></div>
      <div :class="item.type ? 'dialog-formula-content' : 'dialog-formula-content-no'">{{ item.value }}</div>
      <div :class="item.type ? 'dialog-formula-bottom' : 'dialog-formula-bottom-no'">
        参数:
        <br />
        <div>
          {{ item.explain }}
        </div>
      </div>
    </div>
  </div>
  <!-- 底部 -->
  <div class="dialogBottom">
    <el-button type="primary" class="preservation" @click="preservation">确认</el-button>
    <!-- <div class="empty" @click="empty(formRef)">清空</div> -->
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash'
  import { reactive } from 'vue'
  // const { proxy } = getCurrentInstance() as any

  const props = defineProps<{
    operation: any
    value: any
  }>()
  const state: any = reactive({
    checkboxType: false,
    value: false,
    list: []
  })
  const init = () => {
    let arr = [
      { name: '公式1', value: 'a+b+c+f+b', explain: 'e:铺布长度' },
      { name: '公式1', value: 'a+b+c+f+b', explain: 'e:铺布长度' },
      { name: '公式1', value: 'a+b+c+f+b', explain: 'e:铺布长度' },
      { name: '公式1', value: 'a+b+c+f+b', explain: 'e:铺布长度' },
      { name: '公式1', value: 'a+10086', explain: 'e:铺布长度+9999' }
    ]
    if (!isEmpty(arr)) {
      arr.map((item: any) => {
        item.type = false
      })
      state.list = arr
    }

    //选中回显
    let value = props.value.value
    state.list.map((item: any) => {
      if (item.value === value) {
        item.type = true
      } else {
        item.type = false
      }
    })
  }
  init()
  const setStyle = (index: any) => {
    state.list.map((v: any, inx: any) => {
      if (inx === index) {
        v.type = !v.type
      } else {
        v.type = false
      }
    })
  }
  //确认、子组件数据
  const preservation = () => {
    let arr = state.list.filter((item: any) => item.type)
    if (!isEmpty(arr)) {
      props.operation({ type: 'true', data: arr[0] })
    } else {
      props.operation({ type: 'false', data: {} })
    }
  }

  // 取消
  const cancel = () => {
    props.operation({ type: 'false', data: {} })
  }
</script>

<style lang="less" scoped>
  .dialogBottom {
    width: 100%;
    height: 30px;
    /* background: red; */
    display: flex;

    flex-direction: row-reverse;
  }
  .preservation {
    margin-left: 10px;
  }

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
  .dialog-formula-container {
    height: 300px;
    overflow: auto;
    padding: 20px;
  }

  .dialog-formula-top {
    cursor: pointer;
    border: 1px solid #cecece;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    line-height: 38px;
    justify-content: space-between;
  }
  .dialog-formula-content {
    border: 1px solid #cecece;
    border-top: 0;
    padding: 10px;
    padding-top: 15;
    padding-bottom: 15;
    height: 40px;
    background: #039af90f;
  }
  .dialog-formula-content-no {
    border: 1px solid #cecece;
    border-top: 0;
    padding: 10px;
    padding-top: 15;
    padding-bottom: 15;
    height: 40px;
    background: #eaeaea85;
  }

  //效果0
  .dialog-formula-bottom {
    margin-top: 10px;
    height: 50px;
    opacity: 1;
    transition: all 0.4s;
  }
  .dialog-formula-bottom-no {
    margin-top: 10px;
    height: 0px;
    overflow: hidden;
    opacity: 0;
    transition: all 0.4s;
  }
</style>
