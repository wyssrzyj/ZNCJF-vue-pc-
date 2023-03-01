<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2023-03-01 16:07:46
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="settings">
    <div class="settings-left">
      <div class="settings-left-top">
        <el-input v-model="state.name" :placeholder="`请输入款号`" type="text" clearable @blur="setBlur" />
        <div class="settings-type">
          <div v-for="item in state.choice.data" :key="item.name" :class="item.type ? 'settings-type-data1' : 'settings-type-data2'" @click="setType(item)">{{ item.name }}</div>
        </div>
        <div class="division"></div>
      </div>

      <div class="settings-list">
        <div class="settings-list-overflow">
          <!-- 全部、已分派 -->
          <div v-if="state.choice.type !== '未分派'">
            <div v-for="(item, index) in state.typeList.wholeData" :key="index" :class="item.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item, 1)">
              <div class="settings-list-title">款号 : {{ item.style.name }}</div>
            </div>
          </div>

          <!-- 未分派 -->
          <div v-if="state.choice.type === '未分派'">
            <div v-for="(item, index) in state.typeList.notData" :key="index">
              <div :class="item.style.type ? 'settings-list-item-true' : 'settings-list-item'" @click="setLeftOperation(item, 2)">
                <div class="settings-list-title">
                  <span><img :src="top" alt="" :class="item.style.type ? 'settings-img' : 'settings-img-bottom'" /></span>
                  款号-未 : {{ item.style.name }}
                </div>
              </div>
              <!-- 子项 -->
              <div :class="item.style.type ? 'demo-dh1' : 'demo-dh2'">
                <div v-for="(v, index) in item.style.children" :key="index">
                  <div class="settings-checkbox">
                    <el-checkbox :label="v.name" size="large" @change="(e:any)=>{setCheckbox(e,v)}" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作 -->
        <div v-show="state.choice.type === '未分派'" class="settings-list-bottom">
          <div class="settings-list-bottom-btn" @click="setAssignment">智能分版</div>
          <div class="settings-list-bottom-btn">保存分派</div>
        </div>
      </div>
    </div>
    <div class="settings-right">
      <div>
        <Gannt :data="state.dhtml" />
      </div>

      <div class="settings-right-table">
        <!-- 全部 -->
        <div v-if="state.choice.type === '全部'">
          <HomeTable :row="state.selectData" />
        </div>
        <!-- 未分派已分派 -->
        <div v-if="state.choice.type !== '全部'">
          <div class="bottomTable-schedulingSettings">
            <leftTable />
            <rightTable :type="state.choice.type" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 弹窗 -->
  <el-dialog v-if="state.assignmentType" v-model="state.assignmentType" :draggable="false" :close-on-click-modal="false" title="智能分派" width="850px">
    <Assignment :close="close" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  // import { ElMessage } from 'element-plus'
  import { cloneDeep, isEmpty } from 'lodash'
import moment from 'moment' 

  import top from '@/components/icon/top.png'


  import Gannt from './modules/gannt.vue'
  import HomeTable from './modules/table.vue'
  import Assignment from './modules/dialog-assignment.vue'
  import leftTable from './modules/leftTable.vue'
  import rightTable from './modules/rightTable.vue'
  import './index.less'

  import { content } from './modules/conifgs'

const {choice,typeList}=content
  const { proxy }: any = getCurrentInstance()

  const state: any = reactive({
    name: '', //款号查询条件
    choice: choice,
    typeList: typeList,//状态数据
    assignmentType: false, //分派弹窗
    selectData:{},//选中项【左侧、甘特图】
    dhtml: {
      list:[],
      x:35,
      y:35,
      id:""
    },
  })

  //未分派 数据结构处理
  const setNotData = (data: any) => {
    //添加子项
    data.map((item: any) => {
      if (!isEmpty(item.styleBedList)) {
        item.styleBedList.map((v: any) => {
          v.name = v.styleCode
        })
        item.style.children = item.styleBedList
      }
    })
 
    state.typeList.notData = data
  }

  // 处理左侧数据
  const setLeftData = (e: any, type: any) => {
    e.map((item: any) => {
      item.style.name = item.style.styleCode //款号
      item.style.type = false
    })
    if (type === '') {
      state.typeList.wholeData = e

      //子项处理暂时测试
      setNotData(e)
    }
    if (type === 1) {
      setNotData(e)
    }
    if (type === 2) {
      state.typeList.alreadyData = e
    }
  }
  //获取左侧列表数据
  const setList = (type: any) => {
    let data = { distributeStatu: type, styleCode: state.name }
    // 空是全部
    // 1 未分派
    // 2 已分派
    proxy.$baseService.get('/jack-ics-api/productionScheduling/listStyleAndBed', { ...data }).then((res: any) => {
      if (res.code === 0) {
        setLeftData(res.data, type)
      }
    })
  }
  //款号查询
  const setBlur = () => {
    if (state.choice.type === '全部') {
      setList('')
    }
    if (state.choice.type === '未分派') {
      setList(1)
    }
    if (state.choice.type === '已分派') {
      setList(2)
    }
  }

  //获取甘特图数据
  const setGanntData = (type: any, api: any) => {
    proxy.$baseService.get(api).then((res: any) => {
      if(res.code===0){
        res.data.map((item:any)=>{
          if(item.startDate){
          item.start_date=moment(item.startDate).format('YYYY-MM-DD-HH')
          }
          if(item.endDate){
          item.end_date=moment(item.endDate).format('YYYY-MM-DD-HH')
          }
        })
        
      state.dhtml.data=res.data
      }
    })
  }

  const init = () => {
    setList('')
    setGanntData('', '/jack-ics-api/productionScheduling/styleGantt')
  }
    init()

  //状态选择
  const setType = (e: any) => {
    let data = cloneDeep(state.choice.data)
    data.map((item: any) => {
      if (item.name === e.name) {
        item.type = true
        state.choice.type = e.name
      } else {
        item.type = false
      }
    })
    state.choice.data = data
    if (e.name === '全部') {
      setList('')

      setGanntData('', '/jack-ics-api/productionScheduling/styleGantt')
    }
    if (e.name === '未分派') {
      // setList(1)

      setList('')
      setGanntData(1, '')
    }
    if (e.name === '已分派') {
      setList(2)
      setGanntData(2, '')
    }
  }
  //左侧数据点击事件
  const setLeftOperation = (e: any, type: any) => {
    if (type === 1) {
      //选中项处理
      let data = cloneDeep(state.typeList.wholeData)
      data.map((item: any) => {
        if (item.style.id === e.style.id) {
          item.style.type = true
        } else {   
          item.style.type = false
        }
      })
      state.selectData = e
      state.typeList.wholeData = data

      
      //甘特图
      state.dhtml = { name: 123 }
    }
    //未分派
    if (type === 2) {
      //选中项处理
      let data = cloneDeep(state.typeList.notData)
      data.map((item: any) => {
        if (item.style.id === e.id) {
          item.style.type = !item.style.type
        }
        //是否收齐其他
        else {
          // item.style.type = false
        }
      })

      state.typeList.notData = data
      state.dhtml = { name: 456 }
    }
  }

  //子项选中
  const setCheckbox = (type: any, e: any) => {
    if (type === true) {
      state.choice.notDataCheckbox.push(e)
    } else {
      let data = cloneDeep(state.choice.notDataCheckbox)

      let subscript = data.findIndex((item: any) => item.id === e.id)
      data.splice(subscript, 1)

      state.choice.notDataCheckbox = data
    }
  }
  //分派弹窗
  const setAssignment = () => {
    state.assignmentType = true
  }
  const close = (type: string) => {
    if (type == 'preservation') {
      state.assignmentType = false
    } else {
      state.assignmentType = false
    }
  }

</script>
