<template>
  <div v-loading="state.loading">
    <div class="content-title">
      <el-breadcrumb>
        <el-breadcrumb-item>
          <span style="color: var(--color-primary); font-size: 1.3rem">打印设置</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-tooltip content="工票标签打印效果设置" effect="dark" placement="top">
        <i class="mix mix-help mix-help-tips"></i>
      </el-tooltip>
    </div>
    <div class="content-body">
      <div class="form-content">
        <div class="item-box">
          <div class="tableItem">
            <div class="mi-table__row" style="margin: 5px 0px">
              <div>操作</div>
              <div>内容：</div>
              <div>前缀：</div>
              <div>字号大小：</div>
            </div>
            <draggable :list="state.defaultConfig" handle=".move">
              <div
                v-for="item in state.defaultConfig"
                :key="item.name"
                class="mi-table__row"
                :class="item.name === 'serial_number' ? { show: Boolean(!state.showSerialNum) } : id"
              >
                <div class="move moveItem">
                  <div></div>
                </div>

                <div style="display: flex">
                  <!-- <span>  选中： </span> -->
                  <el-checkbox v-model="item.selected" :label="item.realName" size="large" @change="selItem(item)" />
                </div>
                <div>
                  <!-- <span>  前缀： </span> -->
                  <el-input v-model="item.label" />
                </div>
                <div>
                  <!-- <span>  字号大小 </span> -->
                  <el-input v-model="item.size" oninput="value=Number(value.replace(/[^\d]/g,''))" />
                </div>
              </div>
            </draggable>
          </div>
        </div>
        <div class="paper">
          <div class="paper-select">
            <div class="paper-label">
              默认纸张
              <el-tooltip content="带孔标签不算孔位置的高度" effect="dark" placement="top">
                <i class="mix mix-help mix-help-tips"></i>
              </el-tooltip>
            </div>
            <el-select v-model="state.paper" placeholder="选择默认纸张" style="width: 180px">
              <el-option v-for="item in state.paperOptions" :key="item" :value="item.value" :label="item.comment" />
            </el-select>
          </div>
          <div id="winprint">
            <div class="ticket-box" :style="'height:' + ticketHeight + 'cm;'" style="overflow: hidden">
              <div class="ticket-header">
                <div class="ticket-hole"></div>
              </div>
              <div class="ticket">
                <div class="items">
                  <div v-for="item in newConfig" :key="item" class="itemContent">
                    <div
                      v-if="item.field !== 'qr_code' && item.field !== 'customer_remark'"
                      style="width: 172px"
                      :style="'height:' + item.h + 'px;' + 'font-size:' + item.size + 'px;'"
                    >
                      {{ item.label }}{{ state.demo[item.field] }}
                    </div>

                    <!--                    </ticket-item>-->
                  </div>
                </div>

                <!-- 隐藏 -->
                <!-- <div v-if="showQrcode" class="qrcode">
                  <vue-qr
                    :logo-src="qrImage"
                    :text="state.testText"
                    :size="state.qrCodeSize"
                    margin="0"
                    logo-scale="0.25"
                    binarize="255"
                  />
                </div> -->
                <div v-if="state.showRemark" class="remark" :style="'font-size:' + state.remarkSize + 'px;'">
                  {{ state.demo.remark }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" @click="savePrintSetting">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup >
  import { ElMessage } from 'element-plus'
  import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
  import { VueDraggableNext } from 'vue-draggable-next'
  import {  reactive,  onMounted, computed, getCurrentInstance } from 'vue'
    import qrImage from '@/components/img/jack.png'
import { paperOptions,defaultConfig,demo } from './modules/conifgs'

  const draggable=VueDraggableNext
      const { proxy }: any = getCurrentInstance()
    const state = reactive({
        showSerialNum: 0,
        remarkSize: 16,
        accessId: '',
        qrImage: qrImage,
        testText: '测试二维码',
        loading: false,
        paper: 1,
        dragItemField: '',
        resizeItemField: '',
        showRemark: false,
        oldConfig: {},
        paperOptions: paperOptions,
        demo: demo,
        //**左侧数据**
        defaultConfig: defaultConfig,
        qrCodeSize: 0
      })
    onMounted(() => {
        state.showSerialNum = 1
        // init()
        newInit()
      })
      //打印纸显示数据
      const newConfig = computed(() => {
        let items = state.defaultConfig
        let tmpConfig:any = []
        items.forEach(m => {
          if (m.selected === true) {
            let tmpItem = {
              label: m.label,
              size: m.size,
              x: m.x,
              // y: items[field].y,
              y: m.y,
              w: m.w,
              h: m.h,
              field: m.name
              // h: items[field].h
            }
            if (tmpItem.field != 'qr_code') tmpConfig.push(tmpItem)

            //二维码尺寸失效修复
            if (m.name === 'qr_code') {
              state.qrCodeSize = m.size
            }
          }

          if (m.name == 'customer_remark') {
            state.showRemark = m.selected
            state.remarkSize = m.size
          }
        })
        tmpConfig.forEach((o:any, index:any) => {
          o.y = index * 24
        })
        return tmpConfig
      })

      const ticketHeight = computed(() => {
        let height = 400
        switch (state.paper) {
          case 1:
          case 3:
            height = 6
            break
          default:
            height = 10
            break
        }
        return height
      })

      const newInit =()=>{
        proxy.$baseService.get('/jack-ics-api/ticket/listSetting').then((res: any) => {
        if (res.code === 0) {
        state.defaultConfig=res.data
        }
      })
      }

      //选择
      const selItem = (e:any) => {
        // console.log("当前",e);
        // console.log("所有数据",state.defaultConfig);

        let len = JSON.parse(JSON.stringify(newConfig.value)).length
        let size = 140
        let baseLine = state.showRemark ? 5 : 7
        let line = state.paper == 2 || state.paper == 4 ? baseLine + 2 : baseLine
        if (len >= line) {
          size = 140 - (len - line) * 22
        }
        if (size < 96) {
          size = 96
        }
        state.qrCodeSize = size
        state.defaultConfig.forEach(element => {
          if (element.name == 'qr_code') {
            element.size = size
          }
        })

      }

      //保存
      const savePrintSetting = () => {
        let data ={ticketSettingList:state.defaultConfig}
        proxy.$baseService.post('/jack-ics-api/ticket/updateSetting',data).then((res: any) => {
          // console.log(res);
        if (res.code === 0) {
          ElMessage({
              message: '操作成功',
              grouping: true,
              type: 'success'
            })
        }else{
         ElMessage({
                message: res.msg,
                grouping: true,
                type: 'warning'
              })
        }
      })
    }
     

 
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content-title {
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;
  }
  .content-title > span {
    display: inline-block;
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
  }

  .content-body {
    height: calc(100% - 60px);
    padding: 15px 15px 30px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    display: flex;
    flex-direction: row;
  }
  .form-footer {
    margin-top: 30px;
    padding-left: 120px;
  }

  .mi-table__row {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 2fr;
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px dotted rgba(0, 0, 0, 0.5);
    line-height: 42px;
    //text-align: center;
    :deep(.el-input__inner) {
      width: 100px;
    }
  }

  .item-box {
    width: 360px;
    //overflow-y: auto;
    margin-right: 16px;
  }

  .row-other {
    //padding-left: 10px;
    margin-left: 14.2%;
    border-bottom: 1px solid #ebeef5;
    height: 45px;
    line-height: 45px;
  }
  .row-other:hover {
    background-color: #f5f7fa;
  }

  .paper {
    display: flex;
    flex-direction: column;
  }
  .paper-label {
    height: 22px;
    line-height: 22px;
  }

  .paper-select {
    margin-bottom: 6px;
  }

  .ticket-box {
    border: #999 1px dotted;
    border-radius: 2px;
    width: 180px;
    height: 424px;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .ticket-header {
    height: 70px;
  }
  .ticket-header .ticket-hole {
    border: #999 1px solid;
    height: 40px;
    width: 80px;
    border-radius: 20px;
    margin: 20px auto 0 auto;
  }
  .ticket {
    border-radius: 2px;
    width: 172px;
    height: 100%;
    user-select: none;
    margin: 0 4px;
    display: flex;
    flex-direction: column;
  }
  .ticket .items {
    position: relative;
    width: 100%;
    //height: 100%;
    display: flex;
    flex-direction: column;
    //height: 100%;
    overflow-y: hidden;
  }
  .ticket-item {
    position: absolute;
    font-size: 16px;
    line-height: 22px;
  }
  .ticket .qrcode {
    width: 100%;
    //height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .ticket .qrcode img {
    max-width: 176px;
    max-height: 176px;
  }
  .ticket .remark {
    border-top: 2px dotted #666;
    margin-top: 10px;
    font-size: 13px;
    //height: 40px;
    //line-height: 40px;
    border-top: 2px dotted #666;
  }
  .moveItem {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-image: url('https://ycpg-setting.oss-cn-hangzhou.aliyuncs.com/image/move.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto;
      cursor: move;
    }
  }
  .show {
    display: none;
  }
</style>
