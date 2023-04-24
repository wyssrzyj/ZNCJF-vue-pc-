<template>
  <div class="content">
    <!-- 床次信息 -->
    <div class="content-top">
      <div class="content-title">
        <div class="content-title-left"></div>
        床次信息
      </div>
      <div class="content-content-bottom">
        <div class="top-left">
          <div class="top-left-title">款图</div>
          <img v-if="state.initData.data.styleImage" class="top-left-img" :src="state.initData.data.styleImage" alt="" />
          <img v-if="!state.initData.data.styleImage" class="top-left-img" :src="jackZw" alt="" />
        </div>

        <div class="top-centre">
          <div v-for="item in state.initData.content" :key="item.name">
            {{ item.name }}
            <el-tooltip class="box-item" effect="dark" :content="state.initData.data[item.value]" placement="top">
              {{ state.initData.data[item.value] }}
            </el-tooltip>
          </div>
          <div>主/辅料： <span>主料</span></div>
        </div>
        <div><leftTable :data="state.initData.table" :width="40" /></div>
      </div>
    </div>
    <!-- 分扎信息 -->
    <div>
      <div class="content-title">
        <div class="content-title-left"></div>
        分扎信息
      </div>
      <div>
        <el-button :type="state.fenestration.type === 1 ? 'primary' : ''" @click="fenestration(1)">按铺布分扎</el-button>
        <el-button :type="state.fenestration.type === 2 ? 'primary' : ''" @click="fenestration(2)">自定义分扎 </el-button>
      </div>
      <tableCloth v-if="state.fenestration.type === 1" :data="state.fenestration" :set-data="setData" />
      <tableCustom v-if="state.fenestration.type === 2" :data="state.fenestration" :set-data="setData" />
    </div>
    <!-- 分扎明细 -->
    <div class="print">
      <div class="content-title">
        <div class="content-title-left"></div>
        分扎明细
      </div>
      <bottomTable :data="state.bottomData" />
    </div>
    <div class="save">
      <el-button @click="cancellation()">返回 </el-button>
      <el-button type="primary" @click="save(1)">保存 </el-button>
      <el-button type="primary" @click="save(2)">保存并打印 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  import jackZw from '@/components/img/zw.jpg'
  import { isEmpty } from 'lodash'

  import leftTable from './modules/leftTable.vue'
  import tableCloth from './modules/tableCloth.vue' //铺布
  import tableCustom from './modules/tableCustom.vue' //自定义分扎
  import bottomTable from './modules/bottomTable.vue'
  import { EMitt } from '@njpCommon/constants/enum'
  import emits from '@njpCommon/utils/emits'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const state: any = reactive({
    // 信息
    initData: {
      content: [
        { name: '生产订单号：', value: 'produceOrderCode' },
        { name: '客户：', value: 'customName' },
        { name: '面料：', value: 'fabricName' },
        { name: '层数：', value: 'spreadClothLevel' },
        { name: '款号：', value: 'styleCode' },
        { name: '款名：', value: 'styleName' },
        { name: '床次：', value: 'styleBedNo' }
      ],
      data: {}, //基础数据
      table: {} //表格数据
    },
    // 分扎
    fenestration: {
      type: 1, //分扎类型
      size: [],
      color: [],
      data: []
    },
    bottomData: [],
    saveData: [] //保存数据
  })
  const { proxy }: any = getCurrentInstance()
  // 分扎信息
  const setHeaderTable = (e: any) => {
    state.fenestration.top = e
    let data = { bedPlanId: route.query.id }
    proxy.$baseService.get(`/jack-ics-api/separate/getDetail`, data).then((res: any) => {
      //分扎详情
      if (!isEmpty(res.data)) {
        let list = res.data
        state.fenestration.data = list //表格数据
      }
    })
  }
  //初始获取数据
  const init = () => {
    let data = { id: route.query.id }
    proxy.$baseService.get(`jack-ics-api/bedPlan/get`, data).then((res: any) => {
      if (res.code === 0) {
        state.initData.data = res.data
        //表格回显
        let tableData = { sizeList: res.data.sizeList, shelfList: res.data.shelfList }
        state.initData.table = tableData
        // 分扎信息
        setHeaderTable(res.data)
      }
    })
  }
  init()
  //按钮分扎
  const fenestration = (type: any) => {
    state.fenestration.type = type
    //切换清空数据
    state.bottomData = []
  }

  const setData = (e: any, size: any) => {
    let newSize: any = []
    size.forEach((item: any) => {
      newSize.push(item.size)
    })

    e.map((item: any) => {
      item.size = newSize
    })
    state.saveData = e
    // tiehao 扎号
    // scale 比例
    // quantity 件数 层数*比例
    //格式转换
    let data: any = []
    if (!isEmpty(size)) {
      if (!isEmpty(e)) {
        e.forEach((item: any) => {
          newSize.forEach((v: any, index: any) => {
            if (item[v]) {
              let arr = item[v]
              data.push({
                zh: arr.tiehao ? arr.tiehao : index + 1,
                color: item.fabricColor,
                size: v,
                sum: arr.quantity,
                lsSet: '',
                lsEnd: ''
              })
            }
          })
        })
      }
    }
    //处理位置
    if (!isEmpty(data)) {
      let list = data.sort((a: any, b: any) => {
        return a.zh - b.zh
      })
      list.map((item: any, index: any) => {
        if (index === 0) {
          item.lsSet = 1
          item.lsEnd = 1 + item.sum
        } else {
          item.lsSet = list[index - 1].lsEnd + 1
          item.lsEnd = item.lsSet + item.sum
        }
      })
      state.bottomData = list
    }
  }
  const cancellation = () => {
    emits.emit(EMitt.OnCloseCurrTab) //关闭当前页
    router.push('/daFei/cutting') //跳转到列表
  }
  const save = async (type: any) => {
    // shelfScale:"绿:w:4"
    if (!isEmpty(state.saveData)) {
      let data: any = []
      state.saveData.forEach((item: any) => {
        let sum = ''
        item.size.forEach((e: any) => {
          sum = `${item.fabricColor}:${e}:${item[e].scale},`
        })
        data.push({
          bedPlanId: route.query.id,
          clothNo: item.clothNo,
          vatNo: item.vatNo,
          clothNoStart: item.clothNoStart,
          clothNoEnd: item.clothNoEnd,
          fabricColor: item.fabricColor,
          spreadClothLevel: item.spreadClothLevel,
          shelfScale: sum
        })
      })

      proxy.$baseService.post(`jack-ics-api/separate/save`, { separateDetailList: data }).then((res: any) => {})
    }
    if (!isEmpty(state.bottomData)) {
      let data: any = []
      state.bottomData.forEach((item: any) => {
        data.push({
          bedPlanId: route.query.id,
          packageNo: item.zh,
          size: item.size,
          color: item.color,
          num: item.sum,
          serialNumber: `${item.lsSet}-${item.lsEnd}`
        })
      })
      proxy.$baseService.post(`jack-ics-api/ticket/savePage`, { ticketDTOList: data }).then((res: any) => {
        if (res.code === 0) {
          ElMessage({
            message: '保存成功',
            type: 'success'
          })
          if (type === 1) {
            cancellation()
          } else {
            proxy.$routerToView({
              path: `/daFei/cutting/view-dialog-cuttingPreview`,
              query: {
                _mt: '裁剪打印',
                type: 'init',
                id: route.query.id
              }
            })
          }
        } else {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #fff;
    .style {
      margin-bottom: 20px;

      .styleInfo {
        margin-left: 5px;
        display: flex;
        flex-direction: row;

        .left {
          width: 200px;

          .image {
            width: 180px;
            height: 180px;

            :deep(.el-image) {
              width: 100%;
              height: 100%;
            }
          }

          .images {
            width: 120px;
            height: 30px;
            display: flex;
            flex-direction: row;
            margin-top: 2px;

            :deep(.el-image) {
              width: 30px;
              height: 30px;
              margin-right: 5px;
              cursor: pointer;
            }
          }
        }

        .right {
          width: 100%;
          padding: 0 20px;

          .rigthtlable {
            color: #8c8c8c;

            .text {
              color: #292929;
            }
          }

          :deep(.el-row) {
            margin-bottom: 15px;
          }

          .ticket_detail :deep(.el-table::before) {
            display: none;
          }
        }
      }
    }

    .print {
      :deep(.el-col) {
        display: flex;
        // 文字垂直居中
        align-items: center;
        white-space: nowrap;
      }

      .radio :deep(.el-radio) {
        margin: 5px;
      }

      .addMono :deep(.el-input) {
        width: auto;
      }

      .addMono :deep(.el-input__inner) {
        width: 100%;
      }

      .addMono :deep(.el-input--small) {
        width: auto;
      }

      .commonlymono :deep(.el-tag--small) {
        margin: 3px;
      }

      .monoCard {
        z-index: 9;
        background-color: #fff;
        position: absolute;
        border: 1px solid hsl(222, 17%, 88%);
        padding: 3px;
        width: 100%;
      }

      .monoinput {
        width: 100%;
        min-height: 32px;
        border: 1.3px solid hsl(222, 17%, 88%);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        //overflow: hidden;
        border-radius: 5px;
        padding: 0 5px;
      }
    }
  }
  .save {
    width: 200px;
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 5vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .content-top {
    width: 100%;
    margin-bottom: 10px;
  }
  .content-title {
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
    display: flex;
    font-weight: bold;
  }
  .content-title-left {
    margin-right: 10px;
    width: 4px;
    height: 20px;
    background: #3e8ff7;
  }
  .content-content {
    padding: 10px;
    padding-left: 20px;
  }

  .flexCenter {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
  .largeAndBack {
    display: flex;
    flex-wrap: wrap;
    :deep(.el-check-tag) {
      margin: 3px;
    }
  }
  .content-content-bottom {
    padding: 10px;
    padding-bottom: 0;
    padding-left: 20px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
  }
  .top-left {
    width: 200px;
    display: flex;
    flex-direction: column;
    transform: translate(0px, -17px);
    margin-right: 100px;
  }
  .top-centre {
    width: 280px;
    display: flex;
    flex-direction: column;
    margin-right: 50px;
    color: #9e9e9e;
    line-height: 20px;
    div {
      width: 280px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    // justify-content: center;
    // align-items: center;
  }
  .top-left-img {
    width: 150px;
    height: 150px;
    border-radius: 5px;
  }
  .top-left-title {
    transform: translate(0px, -5px);
  }
</style>
