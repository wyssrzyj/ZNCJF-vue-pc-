<template>
  <!-- 打印预览 -->
  <div style="margin-bottom: 10px">
    <el-button type="primary" @click="printTicket()">打印</el-button>
  </div>
  <!--不带标签 -->
  <div id="winprint" ref="ticketRef">
    <div :style="getContentCss ? state.csscontent : ''" style="overflow: hidden">
      <div v-for="ticket in state.dataR" :key="ticket" class="ticket-box" :style="'max-height:' + ticketHeight + 'cm;'" style="page-break-after: always; overflow: hidden">
        <div class="ticket">
          <div class="items">
            <div v-for="item in state.ticketConfig" :key="item" :class="item.name == 'serial_number' ? { show: Boolean(!state.showSerialNumber) } : '1'">
              <div v-if="ticket[toHump(item.name)]" :style="'font-size:' + item.size + 'px;'">
                {{ item.label }}{{ toHump(item.name).includes('createDate') ? ticket[toHump(item.name)].substring(0, 10) : ticket[toHump(item.name)] }}
              </div>
            </div>
            <div v-if="state.showRemark && ticket.memoItem" class="remark" style="font-size: 10px; border-top: 2px dotted rgb(102, 102, 102); width: 100%">
              <div :style="'font-size:' + state.remarkSize + 'px'">{{ ticket.memoItem }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, getCurrentInstance, onMounted, computed, ref } from 'vue'
  import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
  import qrImage from '@/components/img/jack.png'
  import { getCache } from '@/utils/cache'
  import { IObject } from '@/types/interface'
  import { ElMessage } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'

  const { proxy } = getCurrentInstance() as any
  const route = useRoute()
  const ticketRef = ref()
  const router = useRouter()
  const state: any = reactive({
    remarkSize: 16,
    accessId: '',
    qrImage: qrImage,
    testText: '测试二维码',
    loading: false,
    paper: 1 as any,
    dragItemField: '',
    resizeItemField: '',
    showRemark: false,
    oldConfig: {},
    csscontent: {
      width: '12cm',
      display: 'grid',
      'grid-template-columns': '1fr 1fr'
    },
    demo: {
      style_no: 'K00088',
      bill_no: 'K00088-1',
      ticket_no: 'CJ002-1',
      color: '白色',
      size: 'M',
      num: '20件',
      ticket_num: '100扎',
      cut_num: '500件',
      package_no: '8',
      create_date: '2022-01-02',
      qr_code: 'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
      remark: '前片'
    },
    defaultConfig: [
      {
        selected: false,
        name: 'style_no',
        label: '款号：',
        value: 'K00088',
        size: 16,
        x: 0 * 24,
        y: 0,
        w: 172,
        h: 24
      },
      {
        selected: false,
        name: 'ticket_no',
        label: '工票：',
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
        value: '20件',
        size: 16,
        x: 0,
        y: 5 * 24,
        w: 172,
        h: 24
      },
      {
        selected: false,
        name: 'ticket_num',
        value: '100扎',
        label: '总扎数：',
        size: 16,
        x: 0,
        y: 6 * 24,
        w: 172,
        h: 24
      },
      {
        selected: false,
        name: 'cut_num',
        value: '500件',
        label: '总裁数：',
        size: 16,
        x: 0,
        y: 7 * 24,
        w: 172,
        h: 24
      },
      {
        selected: false,
        name: 'package_no',
        value: '8',
        label: '扎号：',
        size: 16,
        x: 0,
        y: 8 * 24,
        w: 172,
        h: 24
      },
      {
        selected: false,
        name: 'create_date',
        value: '2022-01-02',
        label: '时间：',
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
        value: 'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
        tip: 'qr_code',
        size: 140,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    ],
    qrCodeSize: 0,
    ticketConfig: [],
    cutId: '' as any,
    ticketId: '' as any,
    ticketIds: '' as any,
    parms: {
      size: 1,
      mono: '',
      looporrepeat: '',
      sort: '',
      num: ''
    },
    dataR: [] as any,
    data: [] as any,
    showQrcode: false,
    showSerialNumber: 0,
    baseSetting: [
      {
        selected: true,
        name: 'ticket_no',
        label: '工票：',
        value: 'CJ002-1',
        size: 16,
        x: 0,
        y: 48,
        w: 172,
        h: 24,
        realName: '工票'
      },
      {
        selected: true,
        name: 'color',
        label: '颜色：',
        value: '白色',
        size: 16,
        x: 0,
        y: 72,
        w: 172,
        h: 24,
        realName: '颜色'
      },
      {
        selected: true,
        name: 'size',
        label: '尺码：',
        value: 'M',
        size: 16,
        x: 0,
        y: 96,
        w: 172,
        h: 24,
        realName: '尺码'
      },
      {
        selected: true,
        name: 'num',
        label: '件数：',
        value: '20件',
        size: 16,
        x: 0,
        y: 120,
        w: 172,
        h: 24,
        realName: '件数'
      },
      {
        selected: true,
        name: 'ticket_num',
        value: '100扎',
        label: '总扎数：',
        size: 16,
        x: 0,
        y: 144,
        w: 172,
        h: 24,
        realName: '总扎数'
      },
      {
        selected: true,
        name: 'cut_num',
        value: '500件',
        label: '总裁数：',
        size: 16,
        x: 0,
        y: 168,
        w: 172,
        h: 24,
        realName: '总裁数'
      },
      {
        selected: true,
        name: 'package_no',
        value: '8',
        label: '扎号：',
        size: 16,
        x: 0,
        y: 192,
        w: 172,
        h: 24,
        realName: '扎号'
      },
      {
        selected: true,
        name: 'create_date',
        value: '2022-01-02',
        label: '时间：',
        size: 16,
        x: 0,
        y: 216,
        w: 172,
        h: 24,
        realName: '时间'
      },
      {
        selected: true,
        name: 'bed_no',
        value: '1',
        label: '床号：',
        size: 16,
        x: 0,
        y: 0,
        w: 172,
        h: 24,
        realName: '床号'
      },
      {
        selected: true,
        name: 'batch_no',
        value: '1',
        label: '缸号：',
        size: 16,
        x: 0,
        y: 0,
        w: 172,
        h: 24,
        realName: '缸号'
      }
    ]
  })

  onMounted(() => {
    state.showSerialNumber = 1
    init()
    // 判断二维码
    // debugger;
  })
  const getContentCss = computed(() => {
    if (state.paper) {
      return state.paper > 2
    }
  })

  const init = () => {
    proxy.$baseService.get(`/jack-ics-api/ticket/listSetting`).then((res: any) => {
      if (res.code !== 0) {
        return ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
      let orignSetting = res.data
      state.accessId = res.data.id
      state.showRemark = res.data.remarks
      orignSetting.forEach((o:any) => {
        if (o.name == 'qr_code' && o.selected == true) {
          state.showQrcode = true
          state.qrCodeSize = o.size
        }
        if (o.name == 'customer_remark') {
          state.remarkSize = o.size
        }
      })
      state.ticketConfig = orignSetting.filter((x:any) => x.selected == true && x.name != 'qr_code')
      state.ticketConfig.forEach((o:any, index:any) => {
        o.y = index * 24
        o.h = 24
      })
      // 初始化数据格式(倒序，成倍，排列)
      state.paper = router.currentRoute.value.query.paper
      state.cutId = router.currentRoute.value.query.cutId
      state.ticketId = router.currentRoute.value.query.ticketId
      state.ticketIds = router.currentRoute.value.query.ticketIds

      //****获取数据
      let ids: any = [route.query.idList].flat(Infinity)
      let data = { idList: ids }
      proxy.$baseService.post(`/jack-ics-api/ticket/listTicket`, data).then((res: any) => {
        if (res.code !== 0) {
          router.push('/ycgp/setprint/setprint?_mt=打印配置')
          return ElMessage({
            message: res.msg,
            type: 'error'
          })
        }

        let list = res.data
        res.data.forEach((item: any) => {
          state.data.push(item)
        })
        if (state.data) {
          if (getCache(`${router.currentRoute.value.query.uuflag}`, { isParse: true, isSessionStorage: true }, '123')) {
            state.parms = getCache(`${router.currentRoute.value.query.uuflag}`, { isParse: true, isSessionStorage: true }, '123')
            state.paper = router.currentRoute.value.query.paper
          }

          if (state.parms.sort == 'desc') {
            reversearr(state.data)
          }
          let dataR = [] as IObject
          if (state.parms.mono) {
            let addMemo = state.parms.mono.split(',')
            //循环状态的备注添加
            if (state.parms.looporrepeat == 'xh') {
              for (let i = 1; i <= Number(state.parms.num); i++) {
                for (let n = 0; n < addMemo.length; n++) {
                  state.data.forEach(function (x: any) {
                    let copy = JSON.parse(JSON.stringify(x))
                    let temp = addMemo[n]
                    copy.memoItem = temp
                    dataR.push(copy)
                  })
                }
              }
            } else {
              for (let i = 0; i < Number(state.parms.num); i++) {
                state.data.forEach(function (x: any) {
                  for (let n = 0; n < addMemo.length; n++) {
                    let copy = JSON.parse(JSON.stringify(x))
                    let temp = addMemo[n]
                    copy.memoItem = temp
                    dataR.push(copy)
                  }
                })
              }
            }
          } else {
            // 没有备注
            if (state.parms.looporrepeat == 'xh') {
              state.data.forEach(function (x: any) {
                for (let i = 0; i < Number(state.parms.num); i++) {
                  dataR.push(x) //push引用类型是否需要深拷贝
                }
              })
            } else {
              for (let i = 0; i < Number(state.parms.num); i++) {
                state.data.forEach(function (x: any) {
                  dataR.push(x)
                })
              }
            }
          }

          //添加备注
          if (route.query.addmonolist) {
            state.showRemark = true
            let addmonolist: any = route.query.addmonolist //备注的数据
            list.map((item: any) => {
              item.memoItem = addmonolist
            })
          }
          state.dataR = list
        }
      })
    })
  }

  //倒序和顺序
  const reversearr = (arr: any) => {
    for (let i = 0; i < arr.length / 2; i++) {
      let temp = arr[i]
      arr[i] = arr[arr.length - 1 - i]
      arr[arr.length - 1 - i] = temp
    }
    return arr //Array对象中的方法返回了一个数组。
  }

  const printTicket = () => {
    const el = document.getElementById('winprint')
    const iframe: any = document.createElement('IFRAME')
    let doc = null
    //让iframe结构隐藏不显示
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;')
    document.body.appendChild(iframe)
    doc = iframe.contentWindow.document
    doc.write(el.innerHTML)
    doc.close()
    //++点，从iframe开始打印
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
  }
  //下划线转驼峰
  const toHump = (str: string) => {
    // let str = str
    return str.replace(/\_(\w)/g, function (match, letter) {
      return letter.toUpperCase().replace(/\s*/g, '')
    })
  }
  const ticketHeight = computed(() => {
    let height = 400
    switch (state.paper) {
      case '1':
      case '3':
        height = 6
        break
      default:
        height = 8
        break
    }
    return height
  })
</script>
<style lang="less" scoped>
  .previewmain1 {
    flex-wrap: wrap;
  }

  .previewmain2 {
    flex-wrap: nowrap;
  }

  .ticketNo {
    position: absolute;
    // top: 0;
    right: 0;
    -webkit-transform: rotate(90deg);
  }

  //  新工票
  .item-box {
    width: 360px;
    //overflow-y: auto;
    margin-right: 16px;
  }

  .row-other {
    //padding-left: 10px;
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
    margin: 5px 10px;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .ticket-header {
    height: 1cm;
  }
  .ticket-header .ticket-hole {
    border: #999 0px solid;
    height: 40px;
    width: 80px;
    border-radius: 20px;
    //margin: 20px auto 0 auto;
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
    //height: 100%;
    overflow-y: hidden;
    flex-direction: column;
  }
  //.ticket-item {
  //  position: absolute;
  //  font-size: 16px;
  //  line-height: 22px;
  //}
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
    font-size: 14px;
    //height: 40px;
    //line-height: 40px;
    border-top: 2px dotted #666;
  }
  .ticketBorder {
    margin: 5px 2px;
  }
  .show {
    display: none;
  }
</style>
