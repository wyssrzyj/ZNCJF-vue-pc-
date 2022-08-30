<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-29 11:03:26
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>tableDome</div>
  <el-table :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" :data="state.tableData" border style="width: 100%">
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" width="150" />

    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <div class="dome">
          <el-button type="primary" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="primary" @click="handleClick(scope.row)">修改</el-button>
          <el-button type="primary" @click="handleClick(scope.row)">下发任务</el-button>
          <el-button type="primary" @click="handleClick(scope.row)">生成贴标任务</el-button>
          <el-button type="primary" @click="handleClick(scope.row)">生成裁床任务</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!-- 弹窗 -->
  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="铺布任务" width="1000px">
    <DialogContent />
  </el-dialog>
</template>

<script>
  import { reactive, defineComponent } from 'vue'
  import { tableColumns } from './conifgs'
  import './index.css'
  import DialogContent from './dialogContent/index.vue'
  export default defineComponent({
    components: {
      DialogContent
    },
    props: {},
    setup(props) {
      // const dialogTableVisible = ref(false);
      // const dialogFormVisible = ref(false);
      const state = reactive({
        name: '',
        dialogTableVisible: false,
        tableColumns: tableColumns,

        tableData: [
          {
            id: '1554641305288114177',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '裁剪',
            sectionValue: '1',
            shopName: 'aps裁剪车间',
            teamId: '1549951343408574465',
            teamName: 'aps裁剪班组',
            productionAmount: 8000,
            planStartTime: 1660348800000,
            planEndTime: 1660406400000,
            auditStatus: -1
          },
          {
            id: '1554641305288114178',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '后整',
            sectionValue: '3',
            shopName: 'aps包装车间',
            teamId: '1549952017592610817',
            teamName: 'aps包装班组',
            productionAmount: 8000,
            planStartTime: 1660780800000,
            planEndTime: 1661011200000,
            auditStatus: -1
          },
          {
            id: '1554641305288114179',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '包装',
            sectionValue: '4',
            shopName: 'aps包装车间',
            teamId: '1549952017592610817',
            teamName: 'aps包装班组',
            productionAmount: 8000,
            planStartTime: 1660953600000,
            planEndTime: 1661270400000,
            auditStatus: -1
          },
          {
            id: '1554670684588277762',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
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
            planStartTime: 1660492801000,
            planEndTime: 1660665600000,
            auditStatus: -1
          },
          {
            id: '1554670684588277763',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '缝制',
            sectionValue: '2',
            shopName: 'aps缝制车间2',
            teamId: '1549951512040566786',
            teamName: 'aps缝制班组3',
            productionAmount: 2000,
            planStartTime: 1660579201000,
            planEndTime: 1660752000000,
            auditStatus: -1
          },
          {
            id: '1554670684588277764',
            externalProduceOrderId: '1553264920554987521',
            externalProduceOrderNum: 'PD20220730142291013',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '缝制',
            sectionValue: '2',
            shopName: 'aps缝制车间1',
            teamId: '1549951461956382721',
            teamName: 'aps缝制班组2',
            productionAmount: 4000,
            planStartTime: 1660665600000,
            planEndTime: 1660838400000,
            auditStatus: -1
          },
          {
            id: '1553921699875454978',
            externalProduceOrderId: '1553276347181260802',
            externalProduceOrderNum: 'PD20220730150760903',
            sewingPlanTaskId: null,
            shopTaskId: '1553968267536719874',
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '裁剪',
            sectionValue: '1',
            shopName: 'aps裁剪车间',
            teamId: '1549951343408574465',
            teamName: 'aps裁剪班组',
            productionAmount: 8000,
            planStartTime: 1659751200000,
            planEndTime: 1659780000000,
            auditStatus: -1
          },
          {
            id: '1553921699879649281',
            externalProduceOrderId: '1553276347181260802',
            externalProduceOrderNum: 'PD20220730150760903',
            sewingPlanTaskId: null,
            shopTaskId: '1553975977581830145',
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '后整',
            sectionValue: '3',
            shopName: 'aps后整车间',
            teamId: '1549951965813927938',
            teamName: 'aps后整班组',
            productionAmount: 8000,
            planStartTime: 1660887180000,
            planEndTime: 1660966380000,
            auditStatus: -1
          },
          {
            id: '1553921699879649282',
            externalProduceOrderId: '1553276347181260802',
            externalProduceOrderNum: 'PD20220730150760903',
            sewingPlanTaskId: null,
            shopTaskId: null,
            productName: 'aps测试产品20220721',
            productClientNum: 'aps测试产品20220721',
            productNum: 'aps测试产品20220721',
            factoryName: 'aps工厂',
            section: '包装',
            sectionValue: '4',
            shopName: 'aps包装车间',
            teamId: '1549952017592610817',
            teamName: 'aps包装班组',
            productionAmount: 8000,
            planStartTime: 1660966380000,
            planEndTime: 1661131980000,
            auditStatus: -1
          },
          {
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
          }
        ]
      })

      const handleClick = e => {
        state.dialogTableVisible = true
      }
      return { state, handleClick }
    }
  })
</script>

<style></style>
