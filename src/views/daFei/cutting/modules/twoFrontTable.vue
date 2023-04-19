<template>
  <div
    class="frontTable"
    :style="{ maxWidth: tableWidth + 'px', overflow: auto, height: tableHeight + 'px', top: topPosition + 'px' }"
  >
    <table>
      <thead style="">
        <tr>
          <th>颜色\尺码</th>
          <th v-for="item in baseSize" :key="item" class="sizeItem">
            {{ item }}
          </th>
          <th>小计</th>
        </tr>
      </thead>
      <tbody :style="{ width: tableWidth + 'px', overflow: auto }">
        <tr
          v-for="(item, index) in nowTableData"
          :key="index"
          :style="index === nowTableData.length - 1 ? { borderBottom: none } : {}"
        >
          <td class="colorItem">
            {{ item.color }}
          </td>
          <td v-for="size in baseSize" :key="size"  class="sizeValItem">{{ item[size] ? item[size] : 0 }}</td>
          <td class="colorItem">
            {{ getColorSum(item) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed, watch } from 'vue'
  const props = defineProps({
    tableData: {
      type: Array,
      default: () => []
    },
    tableWidth: {
      type: Number,
      default: () => 0
    },
    tableHeight: {
      type: Number,
      default: () => 0
    },
    sizes: {
      type: String,
      default: () => ''
    },
    topPosition: {
      type: Number,
      default: () => 0
    }
  })
  const tableWidth = computed(() => {
    return props.tableWidth
  })
  const tableHeight = computed(() => {
    return props.tableHeight
  })
  const topPosition = computed(() => {
    return props.topPosition
  })
  const nowTableData = computed(() => {
    let arr = []
    let sizeArray = []
    let nowData = JSON.parse(JSON.stringify(props.tableData))
    props.tableData.forEach(item => {
      for (let i in item) {
        if (i !== 'color' && sizeArray.indexOf(i) < 0) {
          sizeArray.push(i)
        }
      }
    })
    let sizeNow = data.sizeModel.replace('[', '').replace(']', '')

    let baseSize = sizeNow.replace(/\"/g, '').split(',')
    baseSize.forEach(item => {
      if (sizeArray.includes(item)) {
        arr.push(item)
      }
    })
    let obj = { color: '总计' }
    baseSize.forEach(item => {
      // eslint-disable-next-line no-eval
      obj[item] = getSum(props.tableData, item)
      // eval(props.tableData.map(s => s[item]).join('+'))
    })
    nowData.push(obj)
    return nowData
  })
  const baseSize = computed(() => {
    // let baseData = props.tableData
    let arr = []
    let sizeArray = []
    props.tableData.forEach(item => {
      for (let i in item) {
        if (i !== 'color' && sizeArray.indexOf(i) < 0) {
          sizeArray.push(i)
        }
      }
    })
    if (props.sizes) {
      let baseSize = props.sizes.replace('[', '').replace(']', '').replace(/\"/g, '').split(',')
      baseSize.forEach(item => {
        if (sizeArray.includes(item)) {
          arr.push(item)
        }
      })
      // console.log(arr)
      return arr
    } else {
      return []
    }
  })
  const data = reactive({
    sizeModel: ''
  })
  const getSum = (a, b) => {
    let sum = 0
    a.forEach(item => {
      for (let i in item) {
        if (i === b) {
          sum += item[i]
        }
      }
    })
    return sum
  }
  const getColorSum = data => {
    let sum = 0
    for (let i in data) {
      if (i != 'color') {
        sum += data[i]
      }
    }
    return sum
  }
  onBeforeMount(() => {
    //console.log('2.组件挂载页面之前执行----onBeforeMount')
  })
  onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
  })
  watch(
    () => props.sizes,
    (newVal, oldVal) => {
      if (newVal) {
        data.sizeModel = newVal
      }
    },
    {
      deep: true,
      immediate: true
    }
  )
  watchEffect(() => {})
  // 使用toRefs解构
  // let { } = { ...toRefs(data) }
  defineExpose({
    ...toRefs(data)
  })
</script>
<style scoped lang="less">
  table {
    width: 100%;
    border: 1px solid #dcdcdc;
    border-spacing: 0;
  }
  //tbody tr:last-child td {
  //  border-bottom: none;
  //}
  th,
  td {
    border-right: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    text-align: center;
  }
  th:last-child,
  td:last-child {
    border-right: none;
  }
  .frontTable {
    height: 250px;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
  }
  .colorItem {
    min-width: 100px;
    width: 100px;
  }
  .sizeItem {
    min-width: 50px;
  }
  .sizeValItem {
    min-width: 50px;
  }
</style>
