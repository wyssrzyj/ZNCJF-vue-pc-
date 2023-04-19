<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-04-19 11:15:22
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <!-- 顶部 -->
    <div class="table-content-top">
      <el-tag v-for="item,index in state.topSize" :key="index" class="tag-x" @click="addData('x', item)">{{ item.size }}</el-tag>
    </div>
    <div class="table-content">
      <!-- 左侧 -->
      <div class="table-content-left">
        <el-tag v-for="item,index in state.leftColor" :key="index" class="tag-y" @click="addData('y', item)">{{ item.color }}</el-tag>
      </div>
      <!-- 拖拽表格 -->
      <div class="leftTable">
        <div class="app-container">
          <!-- 滚动 -->
          <div class="table-overflow">
            <table class="tableDraggable" :style="{ width: state.width + 'px' }">
              <!-- 表头 -->
              <div class="table-top-head">
                <div class="table-top">唛架配比</div>
                <!-- 动态尺码 -->
                <!-- <div class="table-top-size">
                <div v-for="item in state.size" :key="item.size" class="common operate-background">{{ item.size }}</div>
              </div> -->
              </div>
              <tr class="table-head">
                <div class="common-top operate-background">操作</div>
                <div class="common-top operate-background">颜色</div>
                <div class="common-top operate-background">缸号</div>
                <div class="common-top operate-background">匹号</div>
                <div class="common-top-two operate-background">位置</div>
                <div class="common-top operate-background">层数</div>
                <!-- 动态尺码 -->
                <div class="table-top-size">
                  <div v-for="item in state.size" :key="item" class="common-top-two">
                    <span class="close" @click="movSize(item)"><div class="close-title">x</div> </span>
                    {{ item.size }}
                  </div>
                </div>
              </tr>
              <!-- 数据 -->
              <draggable :list="state.list" handle=".handle" ghost-class="sortable-ghost">
                <tr v-for="(item, index) in state.list" :key="index" class="tableDraggable-body handle">
                  <td class="operate">
                    <img :src="mov" alt="" class="icon-drop" @click="movData(item)" />
                    <img :src="drop" alt="" class="icon-drop" />
                  </td>
                  <td class="common">
                    {{ item.fabricColor }}
                  </td>
                  <td class="common">
                    <div class="input-common">
                      <el-input v-model="item.vatNo" placeholder="缸号" @change="(e:any)=>change(item,2)" />
                    </div>
                  </td>
                  <td class="common">
                    <div class="input-common">
                      <el-input v-model="item.clothNo" placeholder="匹号" @change="(e:any)=>change(item,2)" />
                    </div>
                  </td>
                  <td class="common-two">
                    <div class="input-demo">
                      <el-input-number v-model="item.clothNoStart" :controls="false" placeholder="开始位置" @change="(e:any)=>change(item,3)" />
                      <el-input-number v-model="item.clothNoEnd" :controls="false" placeholder="结束位置" @change="(e:any)=>change(item,3)" />
                    </div>
                  </td>
                  <td class="common">
                    <div class="input-common">
                      <el-input-number v-model="item.spreadClothLevel" :controls="false" :min="1" placeholder="层数" @change="(e:any)=>change(item,1)" />
                    </div>
                  </td>
                  <!-- 动态尺码 -->
                  <td v-for="v in state.size" :key="v" class="common-two">
                    <div class="input-demo-top">
                      <div class="input-demo-tiehao">
                        <!-- <el-input v-model="item[v.color].tiehao" placeholder="扎号" /> -->
                        <el-input-number v-model="item[v.size].tiehao" :controls="false" :min="1" placeholder="扎号" @change="(e:any)=>change(item,2)" />
                      </div>
                      <div class="input-demo-size">
                        <el-input-number v-model="item[v.size].scale" :controls="false" :min="1" placeholder="比例" @change="(e:any)=>change(item,1)" />
                        <el-input-number v-model="item[v.size].quantity" :disabled="true" :controls="false" :min="1" dis placeholder="件数" />
                      </div>
                    </div>
                  </td>
                </tr>
              </draggable>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive,  watch } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { VueDraggableNext } from 'vue-draggable-next'
  import drop from '@/components/icon/drop.png'
  import mov from '@/components/icon/mov.png'
  import { ElMessage } from 'element-plus'
  const props = defineProps<{
    data: any
    setData: any
  }>()
  const draggable = VueDraggableNext
  const state: any = reactive({
    buttonType: 2,
    leftColor: [], //左侧颜色
    topSize: [], //顶部尺码

    size: [], //尺码数据

    width: 600, //表格的宽度
    list: [] //表格数据
  })
  //数据更新传递到父级
  const transmit = () => {
    props.setData(state.list, state.size)
  }
  //计算表格宽度
  const setWidth = (length: any) => {
    let width = 660 + length * 160
    state.width = width
  }

  //*** */ 回显ShelfScale字符串处理
  const setShelfScale = (e: any) => {
    let arr = e.shelfScale

    let topSize: any = []
    let sum: any = {}
    let arrSplit = arr.split(',')
    arrSplit.map((item: any) => {
      if (item !== '') {
        let index = item.indexOf(':')
        let value = item.slice(index + 1)
        //获取尺码
        let size = value.substring(0, value.indexOf(':'))
        topSize.push(size)
        //获取数据
        let data = value.slice(index + 1)
        // tiehao 扎号
        // scale 比例
        // quantity 件数 层数*比例
        sum[size] = { tiehao: '', scale: data, quantity: e.spreadClothLevel * data }
      }
    })
    //最终效果
    // {
    // "w": {
    //     "tiehao": "",
    //     "quantity": "",
    //     "scale": "4"
    // },
    // "s": {
    //     "tiehao": "",
    //     "quantity": "",
    //     "scale": "4"
    // }
    let data = { value: sum, size: topSize }
    return data
  }

  // 当行添加尺码字段
  const setRow = (e: any) => {
    let list = cloneDeep(state.list)
    list.map((item: any) => {
      //tiehao 扎号
      //scale 比例
      //quantity 件数
      item[e.size] = { tiehao: '', quantity: '', scale: '' }
    })
    state.list = list
  }
  //新增
  const addData = (type: any, e: any) => {
    if (type === 'x') {
      if (!isEmpty(state.list)) {
        let size = cloneDeep(state.size)
        let sizeList: any = []
        size.forEach((item: any) => {
          sizeList.push(item.size)
        })

        // 是否重复
        if (!sizeList.includes(e.size)) {
          let newSize = { size: e.size }
          //当前行添加尺码数据格式
          setRow(newSize)
          // 赋值
          size.push(newSize)
          state.size = size
          setWidth(state.size.length) //宽度
        } else {
          ElMessage({
            message: '请勿重复添加',
            type: 'warning'
          })
        }
      } else {
        ElMessage({
          message: '请先添加颜色',
          type: 'warning'
        })
      }
    }
    if (type === 'y') {
      let list = cloneDeep(state.list)
      //only 判断当前行的唯一标识
      if (isEmpty(list)) {
        if (isEmpty(state.size)) {
          let data = {
            only: `${e.color}${list.length + 1}`,
            fabricColor: e.color,
            vatNo: '',
            clothNo: '',
            clothNoStart: '',
            clothNoEnd: '',
            spreadClothLevel: ''
          }
          list.push(data)
          state.list = list
        } else {
          ElMessage({
            message: '请先删除尺码',
            type: 'warning'
          })
        }
      } else {
        let newList = cloneDeep(list[list.length - 1])

        let end = newList.clothNoEnd

        newList.fabricColor = e.color
        let id = new Date().valueOf()
        newList.only = `${e.color}${id}`
        newList.clothNoStart = end + 1
        newList.clothNoEnd = newList.clothNoStart + 1
        // 层数=结束-开始+1
        newList.spreadClothLevel = newList.clothNoEnd - newList.clothNoStart + 1
        list.push(newList)
        state.list = list
      }
    }

    transmit() //数据传递
  }
  //数据回显
  const dataEcho = (e: any) => {
    let size:any =[]
    let data: any = []
    let newSize: any = []
    e.forEach((item: any, index: any) => {
      if (index === 0) {
        newSize = setShelfScale(item).size
      }
      item.only=`${item.fabricColor}${index}`
      let value = setShelfScale(item).value
      value.size = newSize
      data.push({ ...item, ...value })
    })
    //数据回显
    state.list = data
    //尺码回显
    newSize.forEach((item: any) => {
      size.push({ size: item })
    })

    state.size = size
    setWidth(state.size.length) //宽度
  }
  const init = (e: any) => {
    if (!isEmpty(e.top)) {
      let sizeList = e.top.sizeList
      state.topSize = sizeList
      state.leftColor = e.top.shelfList
    }

    if (!isEmpty(e.data)) {
      setWidth([]) //宽度
      dataEcho(e.data)

      transmit()
    }
  }
  watch(
    () => props.data,
    item => {
      init(item)
    },
    { deep: true, immediate: true }
  )
  //删除行
  const movData = (e: any) => {
    let list = cloneDeep(state.list)
    const subscript = list.findIndex((item: any) => item.only === e.only)
    if (subscript !== -1) {
      list.splice(subscript, 1)
      state.list = list
    }
    transmit()
  }
  //删除尺码
  const movSize = (e: any) => {
    let size = cloneDeep(state.size)
    const subscript = size.findIndex((item: any) => item.color === e.color)
    if (subscript !== -1) {
      size.splice(subscript, 1)
      state.size = size
      let list = cloneDeep(state.list)

      //删除数据中的尺码数据
      list.map((item: any) => {
        delete item[e.color]
      })
      state.list = list
      setWidth(state.size.length) //宽度
    }
    transmit()
  }
  //件数计算【层数*比例=件数】
  const setQuantity = (e: any) => {
    let data = cloneDeep(e)
    let value = e.spreadClothLevel
    let size = state.topSize
    let newData = {}
    size.forEach((item: any) => {
      if (data[item.size]) {
        let scale = data[item.size].scale
        // 层数*比例=件数
        data[item.size].quantity = value * scale
        newData = data
      }
    })
    return newData
  }

  //数据更新
  const setList = (e: any) => {
    const list = cloneDeep(state.list)
    const subscript = list.findIndex((item: any) => item.only === e.only)
    if (subscript !== -1) {
      list.splice(subscript, 1, e)
      state.list = list
    }
  }
  //层数更新
  const change = (row: any, type: any) => {
    if (type === 1) {
      let e = setQuantity(row)
      setList(e)
    }
    if (type === 3) {
      let end = row.clothNoEnd
      let start = row.clothNoStart
      row.spreadClothLevel = end - start + 1
      setList(row)
    }

    transmit()
  }
</script>
<style lang="less" scoped>
  .table-head {
    display: flex;
  }
  .table-top-head {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #fff;
  }
  .table-top {
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #eaeaea !important;
  }
  .table-top-size {
    display: flex;
  }
  // 滚动
  .table-overflow {
    margin-top: 5px;
    // width: 1000px !important;
    height: 210px;
  }

  ::v-deep .tableDraggable {
    .sortable-ghost {
      //拖拽时样式
      opacity: 0.8;
      color: #fff !important;
      background: #039af9 !important;
    }
    display: block;
    width: 100%;

    .operate {
      width: 100px;
      text-align: center;
      border: 1px solid #eaeaea;
      height: 70px;
      line-height: 70px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .operate-background {
      background: #eaeaea;
      transform: translateX(-1px);
    }
    .common-top {
      width: 100px;
      text-align: center;
      border: 1px solid #eaeaea;
      height: 40px;
      line-height: 40px;
      position: relative;
    }
    .common {
      width: 100px;
      text-align: center;
      border: 1px solid #eaeaea;
      height: 70px;
      line-height: 70px;
      position: relative;
    }
    .common-top-two {
      width: 160px;
      text-align: center;
      border: 1px solid #eaeaea;
      height: 40px;
      line-height: 40px;
      position: relative;
    }
    .common-two {
      width: 160px;
      text-align: center;
      border: 1px solid #eaeaea;
      height: 70px;
      line-height: 70px;
      position: relative;
    }
    .handle {
      cursor: pointer;
    }
    &-header {
      display: flex;
      width: 100%;
      text-align: left;
      th {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-body {
      display: flex;
      width: 100%;
      // margin-top: 10px;
      td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // margin-top: 10px;
      }
    }
  }
  .icon-drop {
    width: 20px;
    height: 20px;
  }
  .tag-x {
    margin-right: 10px;
    cursor: pointer;
  }
  .tag-y {
    padding: 7px;
    margin-top: 10px;
    cursor: pointer;
  }

  .table-content {
    display: flex;
    width: 60vw !important;
    height: 220px;
    overflow: auto;
  }
  .table-content-left {
    width: 50px;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
  }
  .table-content-top {
    margin-top: 5px;
    margin-left: 71px;
  }

  .close {
    border-top: 15px solid transparent;
    border-bottom: 15px solid red;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    transform: rotate(46deg);
    position: absolute;
    right: -15px;
    top: -15px;
  }
  .close-title {
    transform: translate(-3px, -12px);
    color: #fff;
    font-weight: bold;
  }
  .input-demo {
    margin-top: 20px;
    display: flex;
    /deep/ el-input {
      margin-top: 1px;
      width: 30px;
    }
    /deep/ .el-input-number {
      width: 80px !important;
    }
    :deep(.el-input__inner) {
      padding: 0;
      text-align: center;
    }
  }
  .input-demo-top {
    display: flex;
    flex-direction: column;
  }
  .input-demo-size {
    margin-top: 2px;
    display: flex;

    /deep/ .el-input-number {
      width: 80px !important;
    }
    :deep(.el-input__inner) {
      padding: 0;
      text-align: center;
    }
  }
  .input-demo-tiehao {
    display: flex;
    /deep/ el-input {
      margin-top: 1px;
      width: 60px;
      height: 20px;
    }
    /deep/ .el-input-number .el-input__inner {
      text-align: left !important;
    }
    /deep/ .el-input-number {
      width: 160px !important;
    }
  }

  .input-common {
    width: 60px !important;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    border-radius: 10px;
    /deep/ el-input__wrapper {
      padding: 0;
    }
    :deep(.el-input__inner) {
      padding: 0;
      text-align: center;
    }
    :deep(.el-input__wrapper) {
      padding: 0 !important;
    }
  }
</style>
