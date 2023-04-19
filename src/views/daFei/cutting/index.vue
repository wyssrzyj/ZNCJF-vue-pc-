<template>
  <div class="container">
    <!-- 新增 -->
    <div class="top">
    </div>
    <!-- 查询 -->
    <el-form ref="rightFormRef" :model="state.form" :inline="true" label-width="auto">
      <el-form-item label="生产订单:" prop="sn">
        <el-input v-model="state.form.produceOrderCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="款式编号:" prop="name">
        <div class="form-input">
          <el-input v-model="state.form.styleCode" placeholder="请输入" clearable />
        </div>
      </el-form-item>
      <el-button type="primary" class="about" @click="search">搜索</el-button>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table ref="cutTable" :data="state.dataList" border style="width: 100%" height="750">
        <el-table-column label="图片" width="130" align="center">
          <template #default="scope">
            <ImgModular :img="scope.row.styleImage" />
          </template>
        </el-table-column>

        <el-table-column prop="info" label="床次信息" header-align="center" align="center" width="250">
          <template #default="scope">
            <div class="top-centre">
              <div v-for="item in state.content" :key="item.name">
                {{ item.name }}
                <el-tooltip class="box-item" effect="dark" :content="scope.row[item.value]" placement="top">
                  {{ scope.row[item.value] }}
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop label="床次件数" header-align="center" align="center">
          <template #default="scope">
            <div class="leftTable-center">
              <leftTable :data="scope.row" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="ticket" label="裁剪进度" header-align="center" align="center" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.statu" class="ml-2" :type="tagType.get(scope.row.statu)"> {{ bedScheduleType.get(scope.row.statu) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="ticket" label="操作" header-align="center" align="left" width="150">
          <template #default="scope">
            <div class="table_click">
              <el-button link type="primary" @click="handleClick(1, scope.row)">编辑</el-button>
              <el-button link type="primary" @click="handleClick(2, scope.row)">打印</el-button>
              <el-button link type="primary" @click="handleClick(3, scope.row)">非票列表</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.form.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, onActivated, reactive, ref } from 'vue'
  import { bedScheduleType, tagType } from '@/components/conifgs'
  import ImgModular from '@/components/imgModular/index.vue'

  import leftTable from './modules/leftTable.vue'

  const { proxy }: any = getCurrentInstance()

  const cutTable = ref(null)
  onActivated(() => {
    state.nowTableWidth = window.innerWidth
  })
  const state = reactive({
    content: [
      { name: '生产订单号：', value: 'produceOrderCode' },
      { name: '款号：', value: 'styleCode' },
      { name: '款名：', value: 'styleName' },
      { name: '客户：', value: 'customName' },
      { name: '床次：', value: 'styleBedNo' },
      { name: '面料：', value: 'fabricName' },
      { name: '主/辅料：', value: 'styleName' },
      { name: '层数：', value: 'spreadClothLevel' }
    ],
    form: {
      produceOrderCode: '',
      styleCode: '',
      limit: 10,
      page: 1,
      total: 0
    },
    nowTableWidth: 0,
    limit: 5,
    dataList: []
  })

  const init = () => {
    let data = state.form
    proxy.$baseService.get(`/jack-ics-api/separate/pageBedPlan`, data).then((res: any) => {
      if (res.code === 0) {
        state.form.total = res.data.total
        let list = res.data.list
        state.dataList = list
      }
    })
  }
  init()
  //查询
  const search = () => {
    state.form.page = 1
    init()
  }
  const handleClick = (type: any, e: any) => {
   
    if (type === 1) {
      proxy.$routerToView({
        path: `/daFei/cutting/view-dialog-edit`,
        query: {
          _mt: '裁剪编辑',
          id: e.id
        }
      })
    }
    if (type === 2) {
      proxy.$routerToView({
        path: `/daFei/cutting/view-dialog-cuttingPreview`,
        query: {
          _mt: '裁剪打印',
          type:"init",
          id: e.id
        }
      })
    }
    if (type === 3) {
      proxy.$routerToView({
        path: `/daFei/cutting/view-dialog-ticketList`,
        query: {
          _mt: '非票列表',
          id: e.id
        }   
      })
    }
  }
  //分页
  const handleCurrentChange = (e: any) => {
    state.form.page = e
    init()
  }

  const handleSizeChange = (e: any) => {
    state.form.limit = e
    state.form.page = 1
    init()
  }
</script>
<style lang="less" scoped>
  .container {
    padding: 10px;
  }
  .top {
    margin-bottom: 10px;
  }
  .form {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .about {
    transform: translate(10px, -9px);
  }
  .top-centre {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #9e9e9e;
    text-align: left;
    div {
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .table_cutTable {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5px;
    padding-left: 10px;
    div {
      width: 180px;
      text-align: left;
    }
  }
  .leftTable-center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table_click {
    height: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }
  .form-input {
    width: 200px;
  }
</style>
