<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-01-29 17:14:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="rightTable">
    <el-table :data="state.tableData" border  style="width: 100%" height="245">
    <el-table-column prop="color" label="工序"  align="center">
         <template #default="{ row }">
        <div :class="row.style">
        </div>
        <div class="table-txt">{{row.title}}</div>
      </template>

    </el-table-column>
    <el-table-column prop="layers" label="设备"  align="center">
   <template #default="{ row }">
       <el-select  placeholder="请选择"  v-model="row.cropping" filterable  >
         <el-option v-for="item in state.cropping" :key="item.value" :label="item.label" :value="item.value" />
       </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="setTime"  label="计划开始时间" align="center" width="400px">
   <template #default="{ row }">
      <el-date-picker
       v-model="row.time"
       :change="setTime"
      format="YYYY-MM-DD HH:mm"
      type="datetimerange"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    />
      </template>
    </el-table-column>
  </el-table>
   <el-button v-if="props.type==='已分派'" class="schedulingSettings-btn" @click="btn"   type="primary"  >确定修改</el-button>
  </div>

</template>

<script lang="ts" setup>
  import { reactive,onMounted} from 'vue'
  // import moment from 'moment' 
  // import type { TableColumnCtx } from 'element-plus'
  // const { proxy } = getCurrentInstance() as any
  const props = defineProps<{
    type:any
  }>()
  const state: any = reactive({
    tableData:  [
  {
    title: '铺布',
    style:"cloth",
    time:"",//组件需要的格式
    
    cropping:1
  },
   {
    title: '贴标',
    style:"labelling",
    time:"",

    cropping:2

  },
   {
    title: '裁剪',
    time:"",

    style:"cropping",
    cropping:3

  },
],
cropping:[{label:"设备1",value:1},{label:"设备2",value:2},{label:"设备3",value:3},]
  })

  // 生产任务订单查询
  const getPageList = () => {
 
  }
 onMounted(() => {
    getPageList()
  })
  const setTime=(e:any)=>{
  }
  const btn=()=>{
    // let e= state.tableData[0].time
    // console.log(e[0]);
    // console.log(moment(e[0]).valueOf());

  }
 

 
</script>
<style lang="less" scoped>
  .rightTable{
    width: 33vw;
  float: right;

  }
.cloth{
width: 16px;
height: 28px;
background: #566ED6;
transform: translate(25px, 10px);  
}

.labelling{
width: 16px;
height: 28px;
background: #56AED6;
transform: translate(25px, 10px);  
}
.cropping{
width: 16px;
height: 28px;
background: #56D6BE;
transform: translate(25px, 10px);  
}

.table-txt{
transform: translate(5px, -16px);  

}
.schedulingSettings-btn{
  float: right;
  margin-top: 20px;
  margin-right: 10px;
}
</style>
