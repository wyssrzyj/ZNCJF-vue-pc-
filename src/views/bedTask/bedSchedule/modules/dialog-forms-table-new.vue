<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2023-02-21 15:00:29
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-button class="setSize" type="primary" :disabled="disable(false)" @click="newSize">新增尺码</el-button>
  <el-button class="setSize" type="primary" :disabled="disable(false)" @click="newColor">新增颜色</el-button>

  <el-table height="350" style="width: 100%" :data="state.tableData" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
    <el-table-column label="颜色" prop="color" fixed="left" width="150">
      <template #default="{ row }">
        <el-select v-model="row.color" :disabled="disable(false)" class="m-2" placeholder="请选择颜色" size="large">
          <el-option v-for="v in state.selectData" :key="v.value" :label="v.label" :value="v.value" />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column v-for="(item, i) in state.size" :key="i" min-width="200">
      <template #header>
        <div class="tableHeader">
          <span class="close" @click="close(item)">x</span>
          <el-input v-model="item.number" :disabled="disable(false)" size="small" class="newInput" placeholder="尺码" @change="handleTop" />
        </div>
      </template>
      <template #default="{ row }">
        <el-input-number v-model="row[item.number]" :disabled="disable(false)" :min="0" class="newInput" :controls="false" placeholder="数量" @change="handleChange(row)" />
      </template>
    </el-table-column>

    <el-table-column label="铺布层数" prop="spreadClothLevel" fixed="right" width="150">
      <template #default="{ row }">
        <el-input-number v-model="row.spreadClothLevel" :disabled="disable(false)" :min="0" class="newInput" :controls="false" placeholder="数量" @change="handleChange(row)" />
      </template>
    </el-table-column>
    <el-table-column label="床次总件数" prop="bedSum" fixed="right" width="150" />
  </el-table>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { formsTable } from './conifgs'
  import './index.less'
  import { isEmpty } from 'lodash'

  const { tableColumns } = formsTable

  const props: any = defineProps<{
    data: any
    type: any
    getData: any
  }>()
  const state: any = reactive({
    type: props.type,
    tableColumns: tableColumns,
    //-------------
    selectData: [], //颜色
    tableData: [],
    size: [] //动态尺码
  })

  //处理 后端排唛比例的保存字段，且用于回显
  const setSizeAndAmountList = (data: any) => {
    if (!isEmpty(state.size)) {
      let arr: any = []
      state.size.forEach((item: any) => {
        arr.push({ size: item.number, levelClothSum: data[item.number] })
      })
      return arr
    }
  }
  //传递给父级
  const backData = (e: any) => {
    if (!isEmpty(e)) {
      e.map((item: any) => {
        item.sizeAndAmountList = setSizeAndAmountList(item)
      })
    }
    props.getData(e)
  }

  //获取新的数据
  const setData = (size: any, shelfIdList: any) => {
    let list = shelfIdList
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
        } else {
        }
      }
    })
    // 添加新的数据
    if (!isEmpty(difference)) {
      difference.map((item: any, index: any) => {
        list.push({
          unique: `${item + index}`,
          color: item, //颜色
          size: '', //尺码
          spreadClothLevel: 0, //铺布层数
          bedSum: 0 //床次总件数
        })
      })
    }

    return list
  }
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

  // 处理数据格式
  const setTableData = (data: any) => {
    let list: any = []
    if (!isEmpty(data)) {
      data.forEach((item: any) => {
        if (!isEmpty(item.sizeAndAmountList)) {
          list.push({ ...item, ...conversion(item.sizeAndAmountList, 'size', 'levelClothSum') })
        } else {
          //新增的数据添加尺码字段
          list.push({ ...item, ...conversion(state.size, 'number', '') })
        }
      })
    }

    return list
  }
  //床次总合
  const totalBedTimes = (v: any) => {
    let sum = 0
    if (!isEmpty(state.size)) {
      state.size.forEach((item: any) => {
        if (v[item.number] > 0) {
          sum += v[item.number]
        }
      })
    }
    return sum
  }
  //计算床次总件数
  const setSpreadClothLevel = (data: any) => {
    if (!isEmpty(data)) {
      data.map((v: any) => {
        v.bedSum = v.spreadClothLevel * totalBedTimes(v)
      })
    }
    return data
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
            value: item
          })
        }
      })
    }
    return selectData
  }

  const init = () => {
    // 面料颜色数据更新->使用面料颜色的最新数据
    const fabricColor = props.data.fabricColor
    let shelfIdList = props.data.shelfList //上次保存的数据||接口数据
    //铺布层数
    const size = props.data.sizeList
    setSize(size)

    let fabricColorAll = fabricColor.replaceAll(',', '，')
    let sizeList = fabricColorAll.split('，')
    let selectData: any = [] //下拉颜色
    let newList: any = [] //最新的数据+

    //回显数据
    if (!isEmpty(shelfIdList)) {
      //编辑
      const newListClone = setData(sizeList, shelfIdList)
      newListClone.map((item: any, index: any) => {
        item.unique = `${item.name + index}`
      })
      selectData = setColor(newListClone)
      newList = newListClone
    } else {
      //新增
      if (fabricColor) {
        sizeList.forEach((item: any, index: any) => {
          selectData.push({
            label: item,
            value: item
          })

          if (item !== '') {
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

        state.size.push({ number: '', indexId: new Date() })
      }
    }

    // 总件数
    if (!isEmpty(newList)) {
      newList.map((item: any) => {
        item.total = item.levelClothSum * item.spreadClothLevel
      })
    }

    // 处理数据格式
    let list = setTableData(newList)
    //计算床次总件数
    let bedSumData = setSpreadClothLevel(list)
    state.selectData = selectData //下拉颜色
    //赋值
    state.tableData = bedSumData
    backData(bedSumData)
  }

  init()

  //输入框处理
  const handleChange = (e: any) => {
    state.tableData = setSpreadClothLevel(state.tableData)
    backData(state.tableData)
  }

  //  尺码防止重复
  const handleTop = (e: any) => {
    //不能添加相同的
    let numberList: any = []
    state.data.forEach((item: any) => {
      numberList.push(item.number)
    })
    //删除最后一项
    let arr: any = []
    numberList.forEach((item: any, index: any) => {
      let length = numberList.length - 1
      if (length !== index) {
        arr.push(item)
      }
    })

    if (arr.includes(e)) {
      ElMessage({
        message: '不能输入相同尺码',
        type: 'warning'
      })

      state.data[state.data.length - 1].number = ''
    }
  }

  //新增尺码
  const newSize = () => {
    if (!isEmpty(state.size)) {
      if (state.size[state.size.length - 1].number) {
        state.size.push({ number: '', indexId: new Date() })
      } else {
        ElMessage({
          message: '请输入尺码',
          type: 'warning'
        })
      }
    } else {
      state.size.push({ number: '', indexId: new Date() })
    }
  }

  //新增颜色
  const newColor = () => {
    let sum = {}
    let list: any = []

    state.size.forEach((item: any) => {
      sum[item.size] = 0
      list.push({ size: item.size, levelClothSum: 0 })
    })

    let arr = {
      color: '',
      spreadClothLevel: 0,
      bedSum: 0,
      sizeAndAmountList: list,
      ...sum
    }
    state.tableData.push(arr)
  }
  //删除
  const close = (e: any) => {
    if (!state.type) {
      let list = state.size.filter((item: any) => item.indexId !== e.indexId)
      //indexId 唯一值
      if (list.length > 0) {
        //删除表头
        state.size = list
        //删除数据字段
        state.tableData.map((item: any) => {
          delete item[e.number]
        })
        backData(state.tableData)
      } else {
        ElMessage({
          message: '至少保留一项',
          type: 'warning'
        })
      }
    }
  }
  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }
</script>

<style lang="less" scoped>
  .tableHeader {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .close {
      display: none;
    }
  }
  .tableHeader:hover {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 16vw !important;
    position: relative;
    .close {
      display: block;
      position: absolute;
      right: 10px;
      top: -7px;
      color: red;
      font-size: 20px;
    }
  }
  .newInput {
    width: 100px !important;
    /deep/ .el-input__inner {
      text-align: center !important; //输入框左对齐
    }
  }
  .setSize {
    margin-bottom: 10px;
  }
</style>
