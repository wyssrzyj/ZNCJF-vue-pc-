<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-05 08:47:14
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table
    ref="table"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    :data="state.tableData"
    height="100%"
    stripe
    style="width: 100%"
    @selection-change="handleSelectionChange"
    @select="dialogCheck"
  >
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed">
      <template #default="scope">
        <div v-if="item.dataIndex === 'color'">
          <div v-if="scope.row.type !== 'select'">{{ scope.row.color }}</div>
          <div v-if="scope.row.type === 'select'">
            <el-select
              v-model="scope.row.value"
              :disabled="disable(false)"
              class="m-2"
              placeholder="请选择颜色"
              size="large"
              @change="
                e => {
                  change(e, scope.row)
                }
              "
            >
              <el-option v-for="v in state.selectData" :key="v.value" :label="v.label" :value="v.value" />
            </el-select>
          </div>
        </div>
        <div v-if="item.dataIndex === 'size'">
          <el-input
            v-model="scope.row.size"
            :disabled="disable(false)"
            placeholder="请输入尺码"
            @change="
              e => {
                handleChange(e, scope.row, 'size')
              }
            "
          />
        </div>
        <div v-if="item.dataIndex === 'levelClothSum'">
          <el-input-number
            v-model="scope.row.levelClothSum"
            :disabled="disable(false)"
            :min="1"
            controls-position="right"
            placeholder="请输入入"
            @change="
              e => {
                handleChange(e, scope.row, 'levelClothSum')
              }
            "
          />
        </div>
        <div v-if="item.dataIndex === 'spreadClothLevel'">
          <el-input-number
            v-model="scope.row.spreadClothLevel"
            :disabled="disable(false)"
            :min="1"
            controls-position="right"
            placeholder="请输入入"
            @change="
              e => {
                handleChange(e, scope.row, 'spreadClothLevel')
              }
            "
          />
        </div>
      </template>
    </el-table-column>

    <!-- 自定义头部 -->
    <el-table-column align="right">
      <template #header>
        <el-button :disabled="disable(false)" type="text" size="small" @click="taskHandle('increase', {})">
          <el-icon class="proportionsRight" :size="20"><CirclePlus /></el-icon>
        </el-button>
      </template>
      <template #default="scope">
        <el-popconfirm :disabled="disable(false)" title="是否删除?" @confirm="taskHandle('delete', scope.row)">
          <template #reference>
            <el-icon class="proportionsDelete" :size="20"><Remove /></el-icon>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  import { formsTable } from './conifgs'
  import './index.less'
  import { isEmpty, cloneDeep } from 'lodash'

  const { tableColumns } = formsTable
  const emit = defineEmits(['getData'])
  //传递给父级
  const backData = (e: any) => {
    emit('getData', e)
  }
  const props = defineProps<{
    data: any
    type: any
  }>()
  // console.log(props.type)

  const state: any = reactive({
    type: props.type,
    data: props.data,
    tableColumns: tableColumns,
    tableData: [],
    selectData: []
  })

  // 旧===新 数据后复用
  const dataReuse = (shelfIdList: any, newList: any) => {
    shelfIdList.forEach((item: any) => {
      const subscript = newList.findIndex((v: any) => v.unique === item.unique)
      if (subscript !== -1) {
        newList.splice(subscript, 1, item)
      }
    })
    return newList
  }

  const init = () => {
    const fabricColor = props.data.fabricColor
    // console.log(props.data)

    const shelfIdList = props.data.shelfList //上次保存的数据
    // console.log('保存过的~~~~~~~~', shelfIdList)

    let selectData: any = []

    if (fabricColor) {
      let data = fabricColor.split('，')
      let newList: any = [] //最新的数据
      data.forEach((item: any, index: any) => {
        selectData.push({
          label: item,
          value: index
        })

        //假如在中间更改数据就会重置了 只能尾部添加-后期再优化9.2 15.09
        newList.push({
          unique: `${item + index}`,
          color: item,
          size: '',
          levelClothSum: 1,
          spreadClothLevel: props.data.spreadClothLevel,
          total: 0
        })
      })
      // 总件数
      if (!isEmpty(data)) {
        newList.map((item: any) => {
          item.total = item.levelClothSum * item.spreadClothLevel
        })
      }

      //有数据 - 旧===新 数据后复用
      if (!isEmpty(shelfIdList)) {
        const newListClone = cloneDeep(newList) //防止被污染
        state.tableData = dataReuse(shelfIdList, newListClone) //唯一值是 名字+下标
      } else {
        //没数据
        state.tableData = newList
        backData(newList)
      }
    }
    state.selectData = selectData
    backData(state.tableData)
  }

  init()
  //选择框
  const change = (e: any, row: any) => {
    let current = state.selectData.filter((item: any) => item.value === e)
    row.color = current[0].label
    row.unique = `${row.color + row.unique.charAt(row.unique.length - 1)}`
    backData(state.tableData)
  }
  //输入框处理
  const handleChange = (e: any, row: any, type: any) => {
    if (type === 'spreadClothLevel' || type === 'levelClothSum') {
      row.total = row.spreadClothLevel * row.levelClothSum
    }
    if (type === 'size') {
      row.size = e
    }
    backData(state.tableData)
  }

  //  id+1
  const setNewUnique = (e: any) => {
    let quantity = Number(e.charAt(e.length - 1)) + 1
    let clone = cloneDeep(e)
    let title = clone.slice(0, e.length - 1)

    return `${title}${quantity}`
  }

  // 自定义头部操作
  const taskHandle = (type: any, row: any) => {
    if (type === 'increase') {
      let tail: any = cloneDeep(state.tableData[state.tableData.length - 1])

      tail.unique = setNewUnique(tail.unique)
      tail.type = 'select'
      state.tableData.push(tail)
    }
    if (type === 'delete') {
      state.tableData = state.tableData.filter((item: any) => item.unique !== row.unique)
    }

    backData(state.tableData)
  }

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }
</script>

<style></style>
