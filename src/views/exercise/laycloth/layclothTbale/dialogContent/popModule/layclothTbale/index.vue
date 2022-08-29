<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-29 13:06:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table ref="table" :data="state.tableData" height="100%" border stripe style="width: 100%" @selection-change="handleSelectionChange" @select="dialogCheck">
    <el-table-column align="center" type="selection" width="50" />
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" />

    <!-- <el-table :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" :data="state.tableData" border style="width: 100%">
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" />
  </el-table> -->
  </el-table>
</template>

<script>
  import { reactive, defineComponent } from 'vue'
  import { tableColumns } from './conifgs'
  import './index.css'
  export default defineComponent({
    components: {},
    props: {
      // form: {},
      select: {
        type: Function,
        default: () => {}
      }
    },
    setup(props) {
      const state = reactive({
        selectioned: {},
        dialogTableVisible: false,
        tableColumns: tableColumns,

        tableData: [
          {
            radio: '1',
            id: '1553925557754331137',
            externalProduceOrderId: '1553276347181260802',
            externalProduceOrderNum: 'PD20220730150760903',
            sewingPlanTaskId: null,
            shopTaskId: '1553976406629769218',
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '缝制',
            sectionValue: '2',
            shopName: 'aps缝制车间1',
            teamId: '1549951412589424641',
            teamName: 'aps缝制班组1',
            productionAmount: 2000,
            planStartTime: 1659916800000,
            planEndTime: 1660887180000,
            auditStatus: -1
          },
          {
            radio: '2',
            id: '1553925557754331138',
            externalProduceOrderId: '1553276347181260802',
            externalProduceOrderNum: 'PD20220730150760903',
            sewingPlanTaskId: null,
            shopTaskId: '1553976406629769218',
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '缝制',
            sectionValue: '2',
            shopName: 'aps缝制车间1',
            teamId: '1549951412589424641',
            teamName: 'aps缝制班组1',
            productionAmount: 2000,
            planStartTime: 1659916800000,
            planEndTime: 1660887180000,
            auditStatus: -1
          }
        ]
      })

      // watch(
      //   () => [props.form],
      //   value => {
      //     console.log('条件', value)
      //   }
      // )

      //选中项传递给父级
      const selectedChange = e => {
        props.select(e)
      }
      return { state, selectedChange }
    },
    methods: {
      /*实现单选*/
      dialogCheck: function (selection, row) {
        this.$refs.table.clearSelection()
        if (selection.length === 0) {
          // 判断selection是否有值存在
          return
        }
        if (row) {
          this.selectedChange(row)
          this.selectioned = row
          this.$refs.table.toggleRowSelection(row, true)
        }
      }
    }
  })
</script>

<style>
  /* .checkTable > .el-table__header-wrapper > table > thead > tr > th:first-child > div {
    display: none !important;
  } */
  .el-table__header-wrapper .el-checkbox {
    display: none;
  }
</style>
