<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-26 15:20:20
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
            :min="0"
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
            :min="0"
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
    // 总件数
    if (!isEmpty(newList)) {
      newList.map((item: any) => {
        item.total = item.levelClothSum * item.spreadClothLevel
      })
    }
    return newList
  }

  //获取新的数据
  const setData = (size: any, list: any) => {
    let colorList: any = [] //老数据的颜色合计
    let difference: any = [] //新数据

    list.forEach((item: any) => {
      if (colorList.indexOf(item.color) === -1) {
        colorList.push(item.color)
      }
    })
    //用户输入和老数据对比 输入新的才添加
    size.forEach((item: any) => {
      if (item !== '') {
        let arr = colorList.findIndex((v: any) => v === item)
        if (arr === -1) {
          difference.push(item)
        }
      }
    })
    // 添加新的数据
    if (!isEmpty(difference)) {
      difference.forEach((item: any, index: any) => {
        list.push({
          unique: `${item + index}`,
          color: item,
          size: '',
          levelClothSum: 1,
          spreadClothLevel: 1,
          total: 0
        })
      })
    }
    return list
  }
  //下拉颜色处理
  const setColor = (data: any) => {
    let sum: any = []
    let selectData: any = []
    data.forEach((item: any) => {
      if (sum.indexOf(item.color) === -1) {
        sum.push(item.color)
      }
    })

    if (!isEmpty(sum)) {
      sum.forEach((item: any, index: any) => {
        if (item !== '') {
          selectData.push({
            label: item,
            value: index
          })
        }
      })
    }
    return selectData
  }

  const init = () => {
    const fabricColor = props.data.fabricColor
    const shelfIdList = props.data.shelfList //上次保存的数据||接口数据
    let sizeList = fabricColor.split('，')
    let selectData: any = [] //下拉颜色
    let newList: any = [] //最新的数据+

    //先判断老数据是否有有值
    if (!isEmpty(shelfIdList)) {
      //是否新增
      const newListClone = setData(sizeList, shelfIdList)
      newListClone.map((item: any, index: any) => {
        item.unique = `${item + index}`
      })

      selectData = setColor(newListClone)
      newList = dataReuse(shelfIdList, newListClone) //唯一值是 名字+下标
    } else {
      if (fabricColor) {
        sizeList.forEach((item: any, index: any) => {
          if (item !== '') {
            selectData.push({
              label: item,
              value: index
            })
            //假如在中间更改数据就会重置了 只能尾部添加-后期再优化9.2 15.09
            newList.push({
              unique: `${item + index}`,
              color: item,
              size: '',
              levelClothSum: 0,
              spreadClothLevel: 0,
              total: 0
            })
          }
        })
      }
    }

    // 总件数
    if (!isEmpty(newList)) {
      newList.map((item: any) => {
        item.total = item.levelClothSum * item.spreadClothLevel
      })
    }
    state.selectData = selectData
    //赋值
    state.tableData = newList
    backData(newList)
  }

  init()
  //选择框
  const change = (e: any, row: any) => {
    let current = state.selectData.filter((item: any) => item.value === e)

    row.color = current[0].label
    row.unique = `${row.color + row.unique.charAt(row.unique.length - 1)}`

    let data = state.tableData.filter((item: any) => item.color === row.color)
    row.spreadClothLevel = data[0].spreadClothLevel

    row.total = Number(row.levelClothSum) * Number(row.spreadClothLevel)
  }

  //输入框处理
  const handleChange = (e: any, row: any, type: any) => {
    let cloneData = cloneDeep(state.tableData)
    //铺布层数 颜色一样   铺布层数一样  返回父级：颜色不同总合
    if (!isEmpty(cloneData)) {
      if (type === 'spreadClothLevel') {
        cloneData.map((item: any) => {
          if (item.color === row.color && item.color != '') {
            item.spreadClothLevel = e
            item.total = item.spreadClothLevel * item.levelClothSum
          } else {
            item.total = item.spreadClothLevel * item.levelClothSum
          }
        })
        state.tableData = cloneData
      }

      // 单层件数 尺寸一样  单层值一样   返回父级：尺寸不同的总合
      if (type === 'levelClothSum') {
        cloneData.map((item: any) => {
          if (item.size === row.size && item.size != '') {
            item.levelClothSum = e
            item.total = item.levelClothSum * item.spreadClothLevel
          } else {
            item.total = item.spreadClothLevel * item.levelClothSum
          }
        })
        state.tableData = cloneData
      }
    }

    if (type === 'size') {
      row.size = e
      let data = state.tableData.filter((item: any) => item.size === e)
      row.levelClothSum = data[0].levelClothSum
      row.total = Number(row.levelClothSum) * Number(row.spreadClothLevel)
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
      let arr = {
        unique: setNewUnique(tail.unique),
        type: 'select',
        color: '',
        size: '',
        levelClothSum: 0,
        spreadClothLevel: 0,
        total: 0
      }

      state.tableData.push(arr)
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
