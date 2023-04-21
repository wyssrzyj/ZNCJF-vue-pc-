<template>
  <div>
    <!-- 头部 -->
    <div class="top">
      <img :src="logo" alt="" class="top-log" />
      <div class="top-txt">裁铺管理系统看板</div>
      <img :src="top" alt="" class="top-title" />
      <img :src="qh" alt="" class="top-right-log" />
      <div class="top-right-time">{{ state.time }}</div>
    </div>
    <!-- 内容 -->
    <div class="mainBody">
      <!-- 左侧 -->
      <div class="mainBody-left">
        <div class="left-top-content">
          <div class="left-top">
            <div class="left-top-title"></div>
            <div>今日床次</div>
          </div>
          <div>
            <topTable />
          </div>
        </div>
        <div class="left-bottom-content">
          <div class="left-top">
            <div class="left-top-title"></div>
            <div>今日达成率</div>
          </div>
          <broken />
        </div>
      </div>
      <!-- 右侧 -->
      <div class="mainBody-right">
        <div class="right-top">
          <div class="left-top-title"></div>
          <div class="right-top-content">
            <div v-for="(item, index) in state.rightList" :key="item.only" class="right-top-txt">
              <div :class="item.type ? 'segmentation-y' : 'segmentation'">
                {{ item.name }}
              </div>
              <div v-if="index !== state.rightList.length - 1">//</div>
            </div>
          </div>
        </div>
        <div class="right-container">
          <div>
            <div class="right-title">1号铺布机</div>
            <histogram :data="state.histogram.data1" />
          </div>

          <div>
            <div class="right-title">2号铺布机</div>
            <histogram :data="state.histogram.data2" />
          </div>
          <div>
            <div class="right-title">3号铺布机</div>
            <histogram :data="state.histogram.data3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import moment from 'moment'
  import logo from './modules/img/logo.png'
  import qh from './modules/img/qh.png'
  import top from './modules/img/top.png'
  import topTable from './modules/topTable.vue'
  import broken from './modules/broken.vue'
  import histogram from './modules/histogram.vue'
  const state: any = reactive({
    rightList: [
      {
        name: '1号铺布线',
        only: '1',
        type: true
      },
      {
        name: '2号铺布线',
        only: '2',
        type: false
      },
      {
        name: '3号铺布线',
        only: '3',
        type: false
      },
      {
        name: '4号铺布线',
        only: '4',
        type: false
      }
    ],
    time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    histogram: {
      data1: {
        data1: [90, 10, 60, 25, 120, 79, 113, 80, 71, 10],
        data2: [30, 80, 120, 95, 19, 28, 15, 40, 62, 98]
      },

      data2: {
        data1: [35, 12, 27, 47, 123, 120, 95, 98, 79, 118],
        data2: [79, 95, 69, 85, 41, 19, 21, 10, 14, 120]
      },
      data3: {
        data1: [75, 130, 98, 16, 25, 32, 17, 24, 72, 92],
        data2: [20, 17, 52, 94, 71, 12, 54, 16, 32, 20]
      }
    }
  })
  //时间
  const setTime = () => {
    setInterval(() => {
      state.time = moment(Date.now()).format('YYYY年MM月DD日 HH:mm:ss')
    }, 1000)
  }
  setTime()
</script>
<style lang="less" scoped>
  .content {
    background: #010640;
  }
  .top {
    width: 96vw;
    background: #010640;
    position: relative;
    display: flex;
    color: #94d2ff;
    font-size: 38px;
    font-weight: bold;
    height: 10vh;
  }
  .top-log {
    position: absolute;
    left: calc(1vw - 10px);
    top: 2vh;
  }
  .top-right-log {
    position: absolute;
    right: calc(2vw - 10px);
    top: 2vh;
  }
  .top-right-time {
    width: 300px;
    line-height: 25px;
    font-size: 20px;
    color: #409eff;
    position: absolute;
    right: 13vw;
    top: 2vh;
  }
  .top-txt {
    position: absolute;
    left: 40vw;
    top: 2vh;
  }
  .top-title {
    width: 96vw;
    height: 10vh;
  }
  .mainBody {
    padding-top: 20px;
    width: 96vw;
    height: 85vh;
    background: #010640;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mainBody-left {
    width: 50vw;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .mainBody-right {
    flex: 1;
    height: 100%;
    background: #010640;
  }
  .left-top {
    display: flex;
    width: 100%;
    height: 50px;
    line-height: 42px;
    font-size: 20px;
    font-weight: bold;
    color: #94d2ff;
  }
  .right-top {
    margin-left: 11vw;
    display: flex;
    height: 50px;
    line-height: 42px;
    font-size: 20px;
    font-weight: bold;
    color: #4d748c;
  }
  .right-top-content {
    transform: translate(0, -7px);
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .right-top-txt {
    cursor: pointer;
    width: 120px;
    margin-right: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .segmentation {
    color: #4d748c;
    margin-right: 10px;
  }
  .segmentation-y {
    color: #95bff4;
    margin-right: 10px;
  }
  .left-top-title {
    width: 7px;
    height: 37px;
    margin-right: 10px;
    margin-left: 10px;
    background: #94d2ff;
    border-radius: 5px;
  }
  .left-top-content {
    flex: 1;
    width: 100%;
    padding: 10px;
  }
  .left-bottom-content {
    height: 40vh;
    width: 100%;
    padding: 10px;
  }
  .right-title {
    width: 100px;
    color: #94d2ff;
    font-size: 20px;
    transform: translate(20vw, 1vw);
  }
  .right-container {
    // width: 100%;
    // background: red;
  }
</style>
