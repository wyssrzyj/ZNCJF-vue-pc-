<template>
  <div v-loading="loading">
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
            <draggable :list="defaultConfig" handle=".move">
              <div
                v-for="item in defaultConfig"
                :key="item.name"
                class="mi-table__row"
                :class="item.name === 'serial_number' ? { show: Boolean(!showSerialNum) } : id"
              >
                <div class="move moveItem">
                  <div></div>
                </div>

                <div style="display: flex">
                  <el-checkbox v-model="item.selected" :label="item.realName" size="large" @change="selItem" />
                </div>
                <div>
                  <el-input v-model="item.label" />
                </div>
                <div>
                  <el-input v-model="item.size" oninput="value=Number(value.replace(/[^\d]/g,''))" />
                </div>
              </div>
            </draggable>
          </div>

          <!-- <div class="row-other">
            <el-checkbox v-model="showRemark" label="备注" size="large" />
          </div> -->
        </div>
        <div class="paper">
          <div class="paper-select">
            <div class="paper-label">
              默认纸张
              <el-tooltip content="带孔标签不算孔位置的高度" effect="dark" placement="top">
                <i class="mix mix-help mix-help-tips"></i>
              </el-tooltip>
            </div>
            <el-select v-model="paper" placeholder="选择默认纸张" style="width: 180px">
              <el-option v-for="item in paperOptions" :key="item" :value="item.value" :label="item.comment" />
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
                    <!--                    <ticket-item-->
                    <!--                      v-if="item.field !== 'qr_code'"-->
                    <!--                      :key="item.name"-->
                    <!--                      :x="item.x"-->
                    <!--                      :y="item.y"-->
                    <!--                      :init-w="item.w"-->
                    <!--                      :init-h="item.h"-->
                    <!--                      :h="item.h"-->
                    <!--                      :style="'font-size:' + item.size + 'px;'"-->
                    <!--                      :resizable="true"-->
                    <!--                      :parent="true"-->
                    <!--                      class="ticket-item"-->
                    <!--                      @drag-start="dragStart(index)"-->
                    <!--                      @drag-end="dragEnd"-->
                    <!--                      @resize-start="resizeStart(index)"-->
                    <!--                      @resize-end="resizeEnd"-->
                    <!--                    >-->
                    <div
                      v-if="item.field !== 'qr_code' && item.field !== 'customer_remark'"
                      style="width: 172px"
                      :style="'height:' + item.h + 'px;' + 'font-size:' + item.size + 'px;'"
                    >
                      {{ item.label }}{{ demo[item.field] }}
                    </div>

                    <!--                    </ticket-item>-->
                  </div>
                </div>
                <div v-if="showQrcode" class="qrcode">
                  <vue-qr
                    :logo-src="qrImage"
                    :text="testText"
                    :size="qrCodeSize"
                    margin="0"
                    logo-scale="0.25"
                    binarize="255"
                  />
                </div>
                <div v-if="showRemark" class="remark" :style="'font-size:' + remarkSize + 'px;'">
                  {{ demo.remark }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" @click="savePrintSetting">保存</el-button>
          <!--          <el-button type="primary" @click="printTicket">打印</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import { getSysConfigAPI, saveSysConfigAPI } from '@/api/base/config'
  import useView from '@/hooks/useView'
  import { ElMessage } from 'element-plus'

  import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
  import { VueDraggableNext } from 'vue-draggable-next'
  import baseService from '@/service/baseService'
  import { defineComponent, reactive, toRefs, onMounted, computed, getCurrentInstance } from 'vue'
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
    import qrImage from '@/components/img/jack.png'
  import { useStore } from 'vuex'

  export default defineComponent({
    name: 'Print',
    components: {
      draggable: VueDraggableNext,

      vueQr
    },
    setup() {
      const store = useStore()
      const proxy = getCurrentInstance()
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
        paperOptions: [
          { name: 'ticket_size', comment: '4*6cm单排', value: 1, sort: 0, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm单排', value: 2, sort: 1, selected: 0 },
          { name: 'ticket_size', comment: '4*6cm双排', value: 3, sort: 2, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm双排', value: 4, sort: 3, selected: 0 }
        ],
        demo: {
          batch_no: '456',
          bed_no: '123',
          style_no: 'K00088',
          bill_no: 'K00088-1',
          ticket_no: 'CJ002-1',
          color: '白色',
          size: 'M',
          num: '20',
          ticket_num: '100',
          cut_num: '500',
          package_no: '8',
          create_date: '2022-01-02',
          serial_number: '1-20',
          qr_code:
            'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
          remark: '前片',
          style_name: '样名',
          customer_id: '样号',
          cuted_time: '2023-2-23'
        },
        defaultConfig: [
          {
            selected: false,
            name: 'customer_id',
            value: '样号',
            label: '客号：',
            realName: '客号',
            size: 16,
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'style_no',
            label: '款号：',
            value: 'K00088',
            realName: '款号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'style_name',
            value: '样款',
            label: '款名：',
            realName: '款名',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'bill_no',
            label: '单号：',
            size: 16,
            realName: '单号',
            value: 'K00088-1',
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'batch_no',
            label: '缸号：',
            value: '456',
            realName: '缸号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'bed_no',
            label: '床号：',
            value: 'K00088',
            realName: '床号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'package_no',
            value: '8',
            label: '扎号：',
            size: 16,
            realName: '扎号',
            x: 0,
            y: 8 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'serial_number',
            value: '1-9',
            label: '流水号：',
            size: 16,
            realName: '流水号',
            x: 0,
            y: 8 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'ticket_no',
            label: '工票：',
            realName: '工票',
            value: 'CJ002-1',
            size: 16,
            x: 0,
            y: 2 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'color',
            label: '颜色：',
            realName: '颜色',
            value: '白色',
            size: 16,
            x: 0,
            y: 3 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'size',
            label: '尺码：',
            realName: '尺码',
            value: 'M',
            size: 16,
            x: 0,
            y: 4 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'num',
            label: '件数：',
            realName: '件数',
            value: '20件',
            size: 16,
            x: 0,
            y: 5 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'cut_num',
            value: '500件',
            label: '总裁数：',
            realName: '总裁数',
            size: 16,
            x: 0,
            y: 7 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'ticket_num',
            value: '100扎',
            label: '总扎数：',
            realName: '总扎数',
            size: 16,
            x: 0,
            y: 6 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'create_date',
            value: '2022-01-02',
            label: '时间：',
            realName: '时间',
            size: 16,
            x: 0,
            y: 9 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'qr_code',
            label: '二维码：',
            realName: '二维码',
            value:
              'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
            tip: 'qr_code',
            size: 140,
            x: 0,
            y: 0,
            w: 0,
            h: 0
          },
          {
            selected: false,
            name: 'cuted_time',
            value: '2023-2-23',
            label: '裁剪时间：',
            realName: '裁剪时间',
            size: 16,
            x: 0,
            y: 6 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'customer_remark',
            value: '前片',
            label: '备注：',
            realName: '备注',
            size: 16,
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 0
          }
        ],
        qrCodeSize: 0
      })
      onMounted(() => {
        state.showSerialNum = store.state.user.setting.showSerialNumber
        init()
      })
      //计算属性
      const showQrcode = computed(() => {
        let showFlag = false
        state.defaultConfig.forEach(item => {
          if (item.name === 'qr_code') {
            showFlag = item.selected
            state.qrCodeSize = item.size
          }
        })
        return showFlag
      })
      const newConfig = computed(() => {
        let items = state.defaultConfig
        // console.log(items);
        let tmpConfig = []
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
              // console.log(state.qrCodeSize)
            }
          }

          if (m.name == 'customer_remark') {
            state.showRemark = m.selected
            state.remarkSize = m.size
          }
        })
        tmpConfig.forEach((o, index) => {
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
      //function
      const init = () => {
        baseService.get('/ycgp/tenantsetting/getSetting').then(res => {
          if (res.code !== 0) {
            return proxy.$message.error(res.msg)
          }

          res.data.print = JSON.stringify(
            JSON.parse(res.data.print).filter(element => {
              if (state.showSerialNum == 0 && element.name == 'serial_number') {
                element.selected = false
              }
              return element
            })
          )
          state.accessId = res.data.id
          state.showRemark = res.data.remarks
          // state.defaultConfig = JSON.parse(res.data.print)
          let tempReArray = JSON.parse(res.data.print).map(obj => obj.name)
          if (tempReArray.length >= state.defaultConfig.length) {
            state.defaultConfig = JSON.parse(res.data.print)
          } else {
            //默认配置中添加新配置之后，保持用户原来的默认配置顺序的基础上添加新的配置
            //判断是否是新用户
            if (tempReArray.length > 1) {
              let temp = JSON.parse(res.data.print)
              state.defaultConfig.forEach(item => {
                const flag = tempReArray.includes(item.name)
                if (flag === false) {
                  temp.push(item)
                }
              })
              state.defaultConfig = temp
            }
          }
          // JSON.parse(res.data.print).forEach((item)=>{
          //   for (let i of state.defaultConfig) {
          //     if (i.name === item.name) {
          //       i.selected = true
          //       i.size = item.size
          //       i.label = item.label
          //     }
          //   }
          // })
          JSON.parse(res.data.print).forEach(item => {
            if (item.selected == true) {
              for (let i of state.defaultConfig) {
                if (i.name === item.name) {
                  i.selected = true
                  i.size = item.size
                  i.label = item.label
                }
              }
            }
          })
          state.defaultConfig.forEach(x => {
            if (x.name == 'batch_no') {
              x.realName = '缸号'
            }
            if (x.name == 'style_no') {
              x.realName = '款号'
            }
            if (x.name == 'bill_no') {
              x.realName = '单号'
            }
            if (x.name == 'ticket_no') {
              x.realName = '工票'
            }
            if (x.name == 'color') {
              x.realName = '颜色'
            }
            if (x.name == 'size') {
              x.realName = '尺码'
            }
            if (x.name == 'num') {
              x.realName = '件数'
            }
            if (x.name == 'ticket_num') {
              x.realName = '总扎数'
            }
            if (x.name == 'cut_num') {
              x.realName = '总裁数'
            }
            if (x.name == 'package_no') {
              x.realName = '扎号'
            }
            if (x.name == 'create_date') {
              x.realName = '时间'
            }
            if (x.name == 'qr_code') {
              x.realName = '二维码'
            }
            if (x.name == 'bed_no') {
              x.realName = '床号'
            }
            if (x.name == 'style_name') {
              x.realName = '款名'
            }
            if (x.name == 'customer_id') {
              x.realName = '客号'
            }
          })
          JSON.parse(res.data.ticketSize).forEach(item => {
            if (item.selected == 1) {
              state.paper = item.value
            }
          })
          // eslint-disable-next-line no-console
        })
      }
      const resizeStart = () => {
        state.resizeItemField = val
      }
      const resizeEnd = () => {
        state.defaultConfig[state.resizeItemField].w = val.w
        state.defaultConfig[state.resizeItemField].h = val.h
      }
      const dragStart = () => {
        state.dragItemField = val
      }
      const dragEnd = () => {
        state.defaultConfig[state.dragItemField].x = val.x
        state.defaultConfig[state.dragItemField].y = val.y
      }
      const printTicket = () => {
        const el = document.getElementById('winprint')
        const iframe = document.createElement('IFRAME')
        let doc = null
        //让iframe结构隐藏不显示
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;')
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        doc.write(el.innerHTML)
        doc.close()
        // 获取iframe的焦点，从iframe开始打印
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      }
      //自动修改二维码的尺寸
      const selItem = () => {
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
      const savePrintSetting = () => {
        let tmpArr = JSON.parse(JSON.stringify(state.paperOptions))
        tmpArr.forEach(item => {
          if (item.value == state.paper) {
            item.selected = 1
          }
        })
        NotShowSerialNum()
        baseService
          .put('/ycgp/tenantsetting', {
            id: state.accessId,
            print: JSON.stringify(state.defaultConfig),
            remarks: state.showRemark,
            ticketSize: JSON.stringify(tmpArr),
            ticketSize0: state.paper
          })
          .then(res => {
            if (res.code !== 0) {
              return ElMessage({
                message: res.msg,
                grouping: true,
                type: 'warning'
              })
            }
            ElMessage({
              message: '操作成功',
              grouping: true,
              type: 'success'
            })
            init()
          })
      }
      const NotShowSerialNum = () => {
        state.defaultConfig.forEach(el => {
          if (el.name === 'serial_number') {
            if (store.state.user.setting.showSerialNumber == 0) {
              el.selected = false
            }
          }
        })
      }
      return {
        ...useView(state),
        ...toRefs(state),
        showQrcode,
        newConfig,
        ticketHeight,
        init,
        resizeStart,
        resizeEnd,
        dragStart,
        dragEnd,
        selItem,
        printTicket,
        savePrintSetting,
        NotShowSerialNum
      }
    }
  })
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
