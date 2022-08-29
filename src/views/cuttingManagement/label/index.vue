<!-- eslint-disable prettier/prettier -->
<template>
  <span>报表666</span>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" :expand-row-keys="[]"
                    @expand-change="expandRow"
  >
    <template #queryFormItem>
      <el-form-item label="日期" prop="dateRange">
        <njp-daterange-picker :query-form-data="state.queryFormData" />
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-select v-model="state.queryFormData.brand" clearable filterable>
          <el-option v-for="item in store.state.selectOptions.selectBrand" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="季节" prop="season">
        <el-select v-model="state.queryFormData.season" clearable filterable>
          <el-option v-for="item in store.state.selectOptions.selectSeason" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="版型" prop="plateType">
        <el-select v-model="state.queryFormData.plateType" clearable filterable>
          <el-option v-for="item in store.state.selectOptions.selectPlateType" :key="item" :label="item"
                     :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="阶段" prop="stage">
        <el-select v-model="state.queryFormData.stage" clearable filterable>
          <el-option v-for="item in store.state.selectOptions.selectStage" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="样办" prop="ybType">-->
      <!--        <el-select v-model="state.queryFormData.ybType" clearable filterable>-->
      <!--          <el-option v-for="item in store.state.selectOptions.selectYbType" :key="item" :label="item" :value="item" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="款号" prop="styleNo">
        <el-input v-model="state.queryFormData.styleNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="品名" prop="productName">
        <el-input v-model="state.queryFormData.productName" placeholder="请输入" clearable />
      </el-form-item>
    </template>
    <template #actionExtBtn="{ row }">
      <div>
        <el-button type="primary" link @click="toView(row, 'opinionList')">编辑</el-button>
        <el-button class="mgt5" type="primary" link @click="toViewSample(row)">查看</el-button>
      </div>
    </template>

    <template #styleUrlList="{ row }">
      <el-image v-if="row.styleUrlList && row.styleUrlList.length" style="width: 75px; height: 75px"
                :src="find(row.styleUrlList, { topic: 1 }) ? find(row.styleUrlList, { topic: 1 }).url : row.styleUrlList[0].url"
                :preview-src-list="row.styleUrlList.map(item => item.url)" :preview-teleported="true"
      />
      <svg-icon v-else width="75px" height="75px" name="empty_table" />
    </template>
    <template #stage="{ row }">
      <el-button type="primary" link @click="handleClick(row)">{{ row.stage }}</el-button>
    </template>
    <template #expandSlot>
      <el-table-column type="expand">
        <template #default="{ row }">
          <div style="padding-left: 94px">
            <el-table :data="row.sampleList" border>
              <el-table-column align="center" label="阶段" prop="stage" />
              <el-table-column align="center" label="样办类型" prop="ybType" />
              <el-table-column align="center" label="打样批次" prop="batch" />
              <el-table-column align="center" label="打样通知时间" prop="createDate" />
              <el-table-column align="center" label="操作" prop="zip">
                <template #default="scope">
                  <el-button link type="primary" @click="toView(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </template>
  </njp-table-config>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import { useStore } from 'vuex'
  import { find } from 'lodash'
  import { ElMessage } from 'element-plus'

  const { proxy } = getCurrentInstance()
  const store = useStore()

  const styleLibListEl = ref()

  const state = reactive({
    queryFormData: {
      brand: '',
      plateType: '',
      stage: '',
      styleNo: '',
      // eslint-disable-next-line prettier/prettier
    productName: '',
      ybType: '',
      season: ''
    },
    dialogVisible: false
  })

  const toView = row => {
    proxy.$routerToView({
      path: `/data-assets/style-library-v2/view-style-library`,
      query: {
        _mt: `款式库详情`,
        id: row.id,
        dsrStyleId: row.dsrStyleId
      }
    })
  }

  const expandRow = (row: any) => {
    getSampleList(row)
  }

  const handleClick = (row: any) => {
    styleLibListEl.value.getTableEl().toggleRowExpansion(row)
    getSampleList(row)
  }

  const getSampleList = (row: any) => {
    row.sampleList = []
    proxy.$baseService
      .get('/njp-dsr-api/dsr/dsrproonotice/getHistoryStyleProoListByDsrStyleId', {
        dsrStyleId: row.id
      })
      .then(res => {
        if (res.code !== 0) return ElMessage.error(res.msg)
        row.sampleList = res.data || []
      })
  }
</script>
