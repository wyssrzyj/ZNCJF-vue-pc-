<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-21 13:44:18
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="leftTable">
    <el-table :data="state.tableData" border show-summary style="width: 100%" height="340" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
      <el-table-column prop="color" label="颜色" align="center" />
      <el-table-column prop="layers" label="层数" align="center" />

      <!-- 动态尺码  -->
      <el-table-column v-for="(item, i) in state.size" :key="i" min-width="50" :prop="item.number" align="center">
        <template #header>
          <div class="tableHeader">
            <span>{{ item.number }}</span>
          </div>
        </template>
        <template #default="{ row }">
          <span>{{ row[item.number] }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="number" label="件数" align="center" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue'
  import { isEmpty } from 'lodash'

  // import type { TableColumnCtx } from 'element-plus'
  // const { proxy } = getCurrentInstance() as any
  // const props = defineProps<{
  // }>()
  const state: any = reactive({
    tableData: [],
    //测试
    size: [], //动态尺码
    shelfList: [] //尺码数据
  })

  //处理尺码格式问题
  const setSize = (size: any) => {
    let sizeData: any = []
    if (!isEmpty(size)) {
      size.forEach((item: any, index: any) => {
        try {
          if (item.size) {
            sizeData.push({ number: item.size, indexId: index })
          }
        } catch (error) {}
      })
    }
    state.size = sizeData
  }

  //处理显示尺码字段
  const conversion = (data: any[], size: any, value: any) => {
    //处理显示尺码字段
    const obj: any = {}
    data.map((e: any) => {
      //键名=建值
      obj[e[size]] = e[value]
    })
    return obj
  }

  const setTableData = (data: any) => {
    let list: any = []
    if (!isEmpty(data)) {
      data.forEach((item: any) => {
        if (!isEmpty(item.sizeAndAmountList)) {
          list.push({ ...item, ...conversion(item.sizeAndAmountList, 'size', 'levelClothSum') })
        }
      })
    }

    return list
  }

  const init = () => {
    //动态尺码
    let sizeList: any = [{ size: 's' }]
    setSize(sizeList)
    // 格式处理
    let shelfIdList = [
      {
        color: '红色',
        layers: '1',
        sizeAndAmountList: [
          {
            size: 's',
            levelClothSum: 10
          }
        ],
        number: 100
      },
      {
        color: '绿色',
        layers: '2',
        sizeAndAmountList: [
          {
            size: 's',
            levelClothSum: 20
          }
        ],
        number: 200
      }
    ]
    let list = setTableData(shelfIdList)

    state.tableData = list
  }
  init()
  // 生产任务订单查询
  const getPageList = () => {}
  onMounted(() => {
    getPageList()
  })
</script>
<style lang="less" scoped>
  .leftTable {
    width: 34vw;
    float: left;
  }
</style>
