<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2023-01-12 10:41:54
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="settings">
    <div class="settings-left">
      <div class="settings-left-top">
        <el-input v-model="state.name" :placeholder="`请输入款号`" type="text" />
        <div class="settings-type">
          <div v-for="item in state.choice.data" :key="item.name" :class="item.type ? 'settings-type-data1' : 'settings-type-data2'" @click="setType(item)">{{ item.name }}</div>
        </div>
        <div class="division"></div>
      </div>
      <!-- 全部数据 -->
      <div class="settings-list">
        <div class="settings-list-overflow">
          <div v-if="state.choice.type !== '未分派'">
            <div v-for="(item, index) in state.list.wholeData" :key="index" :class="item.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item, 1)">
              <div class="settings-list-title">款号1 : {{ item.name }}</div>
            </div>
          </div>

          <!-- 未分派 -->
          <div v-if="state.choice.type === '未分派'">
            <div v-for="(item, index) in state.list.wholeData" :key="index" @click="setLeftOperation(item, 2)">
              <div :class="item.type ? 'settings-list-item-true' : 'settings-list-item'">
                <div class="settings-list-title">
                  <span><img :src="top" alt="" :class="item.type ? 'settings-img' : 'settings-img-bottom'" /></span>
                  款号2 : {{ item.name }}
                </div>
              </div>
              <div :class="item.type ? 'demo-dh1' : 'demo-dh2'">测试8848</div>
            </div>
          </div>
        </div>
        <!-- 操作 -->
        <div class="settings-list-bottom">
          <div class="settings-list-bottom-btn">智能分版</div>
          <div class="settings-list-bottom-btn">保存分派</div>
        </div>
      </div>
    </div>
    <div class="settings-right">right</div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  // import { ElMessage } from 'element-plus'
  import { cloneDeep } from 'lodash'
  import './index.less'
  import top from '@/components/icon/top.png'
  // import { init } from 'echarts'
  // const { proxy }: any = getCurrentInstance()

  const state: any = reactive({
    name: '',

    choice: {
      data: [
        { name: '全部', type: true },
        { name: '未分派', type: false },
        { name: '已分派', type: false }
      ], //状态渲染根据type状态
      type: '全部' //选中那个【此状态不负责渲染】
    },
    list: {
      wholeData: [], //全部
      notData: [], //未分派
      alreadyData: [] //已分派
    }
  })
  // 处理左侧数据
  const setLeftData = (e: any) => {
    e.map((item: any) => {
      item.type = false
    })
    state.list.wholeData = e
  }
  const init = () => {
    let red = [
      { name: 'SEE3全部', id: 1 },
      { name: 'SEE33201156', id: 2 },
      { name: 'SEE33201157', id: 3 }
    ]
    setLeftData(red)
  }
  init()
  //状态选择
  const setType = (e: any) => {
    let data = cloneDeep(state.choice.data)
    data.map((item: any, index: any) => {
      if (item.name === e.name) {
        item.type = true
        state.choice.type = e.name
      } else {
        item.type = false
      }
    })
    state.choice.data = data
    if (e.name === '全部') {
      let red = [
        { name: 'SEE3全部', id: 1 },
        { name: 'SEE33201156', id: 21 },
        { name: 'SEE33201156', id: 22 },
        { name: 'SEE33201156', id: 23 },
        { name: 'SEE33201156', id: 24 },
        { name: 'SEE33201156', id: 25 },
        { name: 'SEE33201156', id: 26 },
        { name: 'SEE33201156', id: 27 },
        { name: 'SEE33201156', id: 28 },
        { name: 'SEE33201156', id: 29 },
        { name: 'SEE33201156', id: 210 },
        { name: 'SEE33201156', id: 211 },
        { name: 'SEE33201156', id: 212 },
        { name: 'SEE33201156', id: 213 },
        { name: 'SEE33201156', id: 214 },
        { name: 'SEE33201156', id: 215 },
        { name: 'SEE33201156', id: 216 },
        { name: 'SEE33201156', id: 217 },
        { name: 'SEE33201156', id: 218 },
        { name: 'SEE33201156', id: 219 },
        { name: 'SEE33201157', id: 320 }
      ]
      setLeftData(red)
    }
    if (e.name === '未分派') {
      let red = [
        {
          name: 'SEE3未分派',
          id: 1,
          children: [
            { name: '子1', id: '1001' },
            { name: '子1', id: '1001' },
            { name: '子1', id: '1001' }
          ]
        },
        { name: 'SEE33201156', id: 2 },
        { name: 'SEE33201157', id: 3 },
        { name: 'SEE33201157', id: 4 },
        { name: 'SEE33201157', id: 5 },
        { name: 'SEE33201157', id: 6 },
        { name: 'SEE33201157', id: 7 }
      ]

      red.map((item: any) => {
        item.type = false
      })
      state.list.notData = e
    }
    if (e.name === '已分派') {
      let red = [
        { name: 'SEE3已分派', id: 1 },
        { name: 'SEE33201156', id: 2 },
        { name: 'SEE33201157', id: 3 }
      ]
      setLeftData(red)
    }
    // console.log('选中那个', state.choice.type)
  }
  //左侧数据点击事件
  const setLeftOperation = (e: any, type: any) => {
    // console.log('当前选中的值', e)
    if (type === 1) {
      //选中项处理
      let data = cloneDeep(state.list.wholeData)
      data.map((item: any, index: any) => {
        if (item.id === e.id) {
          item.type = true
        } else {
          item.type = false
        }
      })
      state.list.wholeData = data
    }
    //未分派
    if (type === 2) {
      //选中项处理
      let data = cloneDeep(state.list.wholeData)
      data.map((item: any, index: any) => {
        if (item.id === e.id) {
          item.type = !item.type
        }
        //是否收齐其他
        //  else {
        //   item.type = false
        // }
      })
      state.list.wholeData = data
    }
  }

  // const confirmDelete = () => {
  //   proxy.$baseService.delete('/jack-ics-api/fabric/delete', state.ids).then((res: any) => {
  //     if (res.code === 0) {
  //       state.ids = [] //清空选中项
  //       onFormQuery()
  //       ElMessage({
  //         message: '删除成功',
  //         type: 'success'
  //       })
  //       state.dialogVisible = false
  //       refreshTable()
  //     } else {
  //       ElMessage({
  //         message: res.msg,
  //         type: 'warning'
  //       })
  //     }
  //   })
  // }
</script>
