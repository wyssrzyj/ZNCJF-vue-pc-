<template>
  <!-- 裁剪打印 -->

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
    <!-- 底部 -->
    <div class="print">
      <div class="content-title">
        <div class="content-title-left"></div>
        打印
      </div>
      <!-- 打印参数设置 -->
      <div style="display: flex">
        <div>
          <el-select v-model="state.form.selectValue" placeholder="请选择尺寸">
            <el-option v-for="item in state.sizeList" :key="item" :value="item.value" :label="item.comment" />
          </el-select>
        </div>
        <div class="flexCenter">
          <span style="width: 55px; margin: 0 3px">份数：</span>
          <el-input v-model="state.form.num" placeholder="默认值为1" />
        </div>
        <div class="flexCenter">
          <el-radio v-model="state.form.radiochoose" label="1">
            <span>循环</span>
          </el-radio>
          <el-tooltip class="box-item" effect="dark" content="循环打印打印样式  111-222-333" placement="bottom">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-radio v-model="state.form.radiochoose" label="2">
            <span>重复</span>
          </el-radio>
          <el-tooltip class="box-item" effect="dark" content="重复打印打印样式  123-123-123" placement="bottom">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-checkbox v-model="state.form.sort" label="倒序" size="small" style="margin: 0 5px" />
        </div>
        <div class="flexCenter">
          <span style="width: 55px; margin: 0 3px">备注：</span>
          <el-input v-model="state.form.addmonolist" placeholder="" />
        </div>
        <div>
          <el-button type="primary" style="margin: 0 5px" @click="print()">打印预览</el-button>
        </div>
        <div>
          <el-button @click="printSettings()">打印设置</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div style="margin-top: 35px" class="content-content">
        <!-- 表格处理 -->
        <el-row>
          <el-col :span="12">
            <div class="colorAndSize">
              <span>颜色：</span>
            </div>
            <!-- 处理数据时候给所有标签循环添加cheacked选中属性用来做选中判断（默认true全部展示） -->
            <div class="largeAndBack">
              <el-check-tag v-for="item in state.table.color" :key="item" :checked="item.checked" @click="setChecked(item)">
                <el-badge is-dot :hidden="!item.checked">{{ item.color }}</el-badge>
              </el-check-tag>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 5px 0">
          <el-col :span="12">
            <div class="colorAndSize">
              <span>尺码：</span>
            </div>
            <!-- 使用增加flag来做状态判断显示 -->
            <div class="largeAndBack">
              <el-check-tag v-for="item in state.table.size" :key="item" :checked="item.checked" @click="setChecked(item)">
                <el-badge is-dot :hidden="!item.checked">{{ item.size }}</el-badge>
              </el-check-tag>
            </div>
          </el-col>
          <!-- 选中多少使用计算属性 -->
          <el-col :span="2">选中：{{ state.table.length }}扎</el-col>
        </el-row>
        <!-- 表格结构 -->
        <el-row>
          <!-- 这里渲染的数据源使用计算属性再次过滤 -->
          <el-table
            ref="multipleTable"
            border
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :data="state.table.list"
            height="300"
            :default-sort="{ prop: 'packageNo', order: 'ascending' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" header-align="center" align="center" width="50" />
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="工票编号" prop="ticketNo" />
            <el-table-column label="颜色" prop="color" />
            <el-table-column label="尺码" prop="size" />
            <el-table-column label="扎号" prop="packageNo" />
            <el-table-column label="件数" prop="num" />
            <el-table-column label="缸号" prop="batchNo">
              <template #default="scope">{{ scope.row.batchNo ? scope.row.batchNo : '无' }}</template>
            </el-table-column>
            <el-table-column label="流水号" prop="serialNumber">
              <template #default="scope">{{ scope.row.serialNumber ? scope.row.serialNumber : '无' }}</template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance,  } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'

  import { IObject } from '@/types/interface'
  import jackZw from '@/components/img/zw.jpg'
  import leftTable from './modules/leftTable.vue'

  const route = useRoute()

  const state: any = reactive({
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
    sizeList: [
      { name: 'ticket_size', comment: '4*6cm单排', value: 1, sort: 0, deleteData: 0 },
      { name: 'ticket_size', comment: '>4*6cm单排', value: 2, sort: 1, deleteData: 0 },
      { name: 'ticket_size', comment: '4*6cm双排', value: 3, sort: 2, deleteData: 0 },
      { name: 'ticket_size', comment: '>4*6cm双排', value: 4, sort: 3, deleteData: 0 }
    ] as IObject,
    form: {
      selectValue: 1, //选择
      num: 1, //分数
      radiochoose: '1', //循环、重复
      sort: false, //倒叙
      addmonolist: '' //备注
    },
    table: {
      list: [],
      initList: [], //后端数据
      color: [],
      size: [],
      length: 0, //选中的长度
      select: [] //选中的id
    }
  })
  const { proxy }: any = getCurrentInstance()

  const setData = (list: any) => {
    state.table.list = list
    state.table.initList = list
    //获取颜色和尺码数据
    if (!isEmpty(list)) {
      let size: any = []
      let color: any = []
      list.forEach((item: any) => {
        if (!size.includes(item.size)) {
          size.push(item.size)
        }
        if (!color.includes(item.color)) {
          color.push(item.color)
        }
      })

      let sizeData: any = []
      let colorData: any = []
      if (!isEmpty(size)) {
        size.forEach((item: any) => {
          sizeData.push({
            size: item,
            checked: true
          })
        })
      }
      if (!isEmpty(color)) {
        color.forEach((item: any) => {
          colorData.push({
            color: item,
            checked: true
          })
        })
      }
      state.table.size = sizeData
      state.table.color = colorData
    }
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
      }
    })

    let type: any = route.query.type
    if (type === 'init') {
      let api = '/jack-ics-api/ticket/listTicketByBed'
      let data = { bedPlanId: route.query.id }
      proxy.$baseService.get(api, data).then((res: any) => {
        if (res.code === 0) {
          let list = res.data
          setData(list)
        }
      })
    }
    if (type === 'idList') {
      let api = '/jack-ics-api/ticket/listTicket'
      let data = { idList: route.query.idList }
      proxy.$baseService.post(api, data).then((res: any) => {
        if (res.code === 0) {
          let list = res.data
          setData(list)
        }
      })
    }
  }
  init()
  //表格选中
  const handleSelectionChange = (e: any) => {
    let ids: any = []
    if (!isEmpty(e)) {
      e.forEach((item: any) => {
        ids.push(item.id)
      })
    } else {
      ids = []
    }

    state.table.length = ids.length
    state.table.select = ids
  }
  //打印
  const print = () => {
    let select = state.table.select
    if (!isEmpty(select)) {
      let data: any = select
      proxy.$routerToView({
        path: `/daFei/cutting/view-dialog-preview`,
        query: {
          _mt: '打印预览',
          idList: data,
          addmonolist: state.form.addmonolist
        }
      })
    } else {
      ElMessage({
        message: '请选择工票',
        type: 'warning'
      })
    }
  }

  //打印设置
  const printSettings = () => {
    proxy.$routerToView({
      path: `/daFei/setprint`,
      query: {
        _mt: '打印设置'
      }
    })
  }
  //选择数据处理
  const setList = (data: any) => {
    let list = cloneDeep(data)
    // 颜色
    let colorData: any = [] //**颜色不可用 */
    let colorList = state.table.color
    colorList.forEach((item: any) => {
      if (!item.checked) {
        colorData.push(item.color)
      }
    })

    // 尺码
    let sizeData: any = [] //**尺码不可用 */
    let sizeList = state.table.size
    sizeList.forEach((item: any) => {
      if (!item.checked) {
        sizeData.push(item.size)
      }
    })

    //添加状态
    list.map((item: any) => {
      //颜色是否有数据
      if (!isEmpty(colorData)) {
        if (colorData.includes(item.color)) {
          item.type = true
        } else {
          //1.不包含当前颜色的
          //2 当前的是否包含尺码
          if (sizeData.includes(item.size)) {
            item.type = true
          } else {
            item.type = false
          }
        }
      } else {
        //1.颜色没数据
        // 2.判断尺码是否有数据
        if (sizeData.includes(item.size)) {
          item.type = true
        } else {
          item.type = false
        }
      }
    })

    let newList = list.filter((item: any) => item.type !== true)
    state.table.list = newList
  }

  //尺码颜色 操作
  const setChecked = (item: any) => {
    item.checked = !item.checked
    let list = cloneDeep(state.table.initList)
    setList(list)
  }
</script>
<style lang="less" scoped>
  .content {
    display: flex;
    flex-direction: column;
    background: #fff;
    // 款式
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
  .content-top {
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
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
    width: 200px;
    display: flex;
    flex-direction: column;
    margin-right: 100px;
    color: #9e9e9e;
    line-height: 20px;
    // justify-content: center;
    // align-items: center;
  }
  .top-left-img {
    width: 150px;
    height: 150px;
  }
  .top-left-title {
    transform: translate(0px, -5px);
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
</style>
