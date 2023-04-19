<template>
  <div class="productProcess">
    
    <!-- 如果页面刷新数据比较频繁，可以将loading、showFlag的相关代码删除，防止过于频繁的出现加载动画 -->
    <div class="loading_div" v-show="!state.showFlag">
      <div>Loading...</div>  <!-- 这个loading自己写，代码没贴出来 -->
    </div>
 
    <div class="success_info_body" v-show="state.showFlag">
      <!-- 参数名称、列数根据实际情况调整 -->
      <div class="table_body">
        <div class="table_th">
          <div class="tr1 th_style">款号</div>
          <div class="tr2 th_style">款名</div>
          <div class="tr3 th_style">床次</div>
          <div class="tr4 th_style">面料</div>
          <div class="tr5 th_style">床次件数</div>
          <div class="tr6 th_style">铺布</div>
          <div class="tr7 th_style">贴标</div>
          <div class="tr8 th_style">裁剪</div>
        </div>
        <div class="table_main_body">
          <div class="table_inner_body" :style="{top: state.tableTop + 'px'}">
            <div class="table_tr" v-for="(item,index) in state.tableList" :key="index">
              <div class="tr1 tr">{{item.planNo}}</div>
              <div class="tr2 tr">{{item.type}}</div>
              <div class="tr3 tr">{{item.type}}</div>
              <div class="tr4 tr">{{item.type}}</div>
              <div class="tr5 tr">{{item.type}}</div>
              <div class="tr6 tr">{{item.type}}</div>
              <div class="tr7 tr">{{item.type}}</div>
              <div class="tr8 tr">{{item.type}}</div>
        
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts" setup>
  import { reactive, onMounted } from 'vue'

  const state:any = reactive(
    {
      showFlag: true,
      tableTimer: null,
      tableTop: 0,
      tableList: [],
      // tableList: //参考格式
      //   [{
      //     "process":0.0000,
      //     "planNo":"BP2022060701",
      //     "endDate":"2022-06-07",
      //     "type":"砌块1",
      //     "startDate":"2022-06-07"
      //   },
      //   {
      //     "process":0.0000,
      //     "planNo":"BP2022060701",
      //     "endDate":"2022-06-07",
      //     "type":"砌块2",
      //     "startDate":"2022-06-07"
      //   }],
      tableListSize: 0,
      componentTimer: null,//定时器
 
      //需要根据情况设置的参数
      title: "排产进度",
      visibleSize: 6, //容器内可视最大完整行数
      lineHeight: 49, //每行的实际高度（包含margin-top/bottom,border等）
      componentTimerInterval: 3600000, //刷新数据的时间间隔
      tableTimerInterval: 100 //向上滚动 1px 所需要的时间，越小越快，推荐值 100
    }
  )
  const  init=()=>{
   
  }
  init
   onMounted(() => {
        clearInterval(state.componentTimer);
      bsGetProductProcess();
      componentTimerFun();
  
  })
 
  // beforeDestroy() {
  //   clearInterval(componentTimer);
  //   clearInterval(tableTimer);
  // },

 
    //调用数据接口，获取列表数据，根据自己情况填接口url
     const bsGetProductProcess=()=> {
      clearInterval(state.tableTimer);
      state.tableTop = 0;

      let  data  =[
        {
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块3",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块4",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },
        {
          "process":0.0000,
          "planNo":"WP2022061301",
          "endDate":"2022-06-13",
          "type":"墙板",
          "startDate":"2022-06-13"
        }
      ]

      state.showFlag = false;
       state.tableList = data;
       state.showFlag = true;
       tableActionFun();
      // if (activeFactoryId != "") {
      //   showFlag = false;
      //   $ajax({
      //     method: "get",
      //     url: `` //根据自己情况填接口url
      //   })
      //     .then(res => {
           
      //     })
      //     .catch(function(err) {
      //       console.log("bsGetProductProcess error!");
      //     });
      // }
    }
    const tableActionFun=()=> {
      state.tableListSize = state.tableList.length;
      if (state.tableListSize > state.visibleSize) {
        state.tableList = state.tableList.concat(state.tableList);
        tableTimerFun();
      } else {
        fillTableList();
      }
    }
    //当数据过少时，不触发自动轮播事件，并填充没有数据的行，参数根据实际情况修改即可
    const fillTableList=()=> {
      var addLength = state.visibleSize - state.tableListSize;
      for (var i = 0; i < addLength; i++) {
        state.tableList.push({
          planNo: "-",
          type: "-",
          startDate: "-",
          endDate: "-",
          process: "-"
        });
      }
    }
    const tableTimerFun=()=> {
      var count = 0;
      state.tableTimer = setInterval(() => {
        if (count < (state.tableList.length / 2) * state.lineHeight) {
          state.tableTop -= 1;
          count++;
        } else {
          count = 0;
          state.tableTop = 0;
        }
      }, state.tableTimerInterval);
    }
    const componentTimerFun=() =>{
      state.componentTimer = setInterval(() => {
        bsGetProductProcess();
      }, state.componentTimerInterval);
    }
</script>
 
<style scoped>
.productProcess {
  width: 100%;
  height: 415px;
}
.loading_div {
  color: #eee;
  padding-top: 100px;
}
.title_div {
  width: 100%;
}
.table_body {
  width: 100%;
  margin-top: 15px;
}
.table_th {
  width: 100%;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.tr {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
  font-size: 14px;
}
.tr1 {
  flex:1
}
.tr2 {
  width: 10%;
}
.tr3 {
  width: 10%;
  font-size: 13px;
}
.tr4 {
  width: 10%;
}
.tr5 {
  width: 15%;
}
.tr6 {
  width: 10%;
}
.tr7 {
  width: 10%;
}
.tr8 {
  width: 10%;
}
 
.th_style {
  color: rgb(0, 221, 253);
  font-weight: bold;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
}
.table_main_body {
  width: 100%;
  height: 294px;
  overflow: hidden;
  position: relative;
}
.table_inner_body {
  width: 100%;
  position: absolute;
  left: 0;
}
.table_tr {
  display: flex;
  height: 40px;
  line-height: 40px;
  color: #eee;
  font-size: 15px;
  background: rgba(3, 145, 167, 0.1);
  border: 1px solid rgb(4, 114, 131);
  margin-top: 7px;
}
</style>