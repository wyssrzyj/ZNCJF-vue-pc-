vue
<!--
 * @Author: lyj
 * @Date: 2022-08-24 17:37:15
 * @LastEditTime: 2022-11-02 15:13:04
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 提示 -->
  <Tips title="【请先选择面料类型、填写面料克重】" />
  <el-tag v-for="tag in state.title" :key="tag" :closable="state.tagType" class="mx-1" :disable-transitions="false" @close="handleClose(tag)">
    {{ tag.name }}
  </el-tag>

  <!-- 按钮 -->
  <div>
    <div v-if="state.btnType === false" class="fabricCutting-btn" @click="open">
      <el-icon class="fabricCutting-icon"><CirclePlus /></el-icon> <span>选择关联面料</span>
    </div>
    <div v-if="state.btnType === true" class="fabricCutting-false">
      <el-icon class="fabricCutting-icon"><CirclePlus /></el-icon> <span>选择关联面料</span>
    </div>
  </div>

  <!-- 弹窗 -->
  <el-dialog v-model="dialogVisible" :draggable="false" title="关联面料" width="30%">
    <div style="display: inline-block">
      <span style="margin-left: 10px">关联面料：</span>
      <el-select v-model="data" :disabled="props.type" multiple placeholder="请选择关联面料" style="width: 240px">
        <el-option v-for="item in state.options" :key="item.value" :label="item.name" :value="item.id" />
      </el-select>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { isEmpty, cloneDeep } from 'lodash'
  import { ref, reactive, getCurrentInstance, watch } from 'vue'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import Tips from '@/components/tips/index.vue'
  const { proxy } = getCurrentInstance() as any

  const dialogVisible: any = ref(false)

  const props = defineProps<{
    form: any
    setFabric: any
    type: any
  }>()

  const data: any = ref([]) //选中项
  const state: any = reactive({
    title: [], //面料的 tag
    options: [], //总数据
    type: props.type,
    tagType: false, //是否可用
    btnType: true //是否可用
  })

  //初始-回显
  const setTitle = (e: any) => {
    let data: any = []
    if (!isEmpty(e)) {
      if (e[0] !== null) {
        e.forEach((item: any) => {
          data.push({
            value: item.id,
            name: item.name,
            id: item.id
          })
        })
        state.title = data
      }
    }
  }
  watch(
    () => props.form,
    item => {
      if (!isEmpty(item.templateDTO)) {
        if (!isEmpty(item.templateDTO.relationFabricList)) {
          setTitle(item.templateDTO.relationFabricList)
        } else {
          state.title = []
        }
      } else {
        state.title = []
      }

      let type = item.fabricType
      let right = item.fabricWeight.right

      if (type !== undefined && right > 0) {
        disable(true)
      } else {
        disable(false)
      }
    }
  )

  const handleClose = (tag: string) => {
    state.title.splice(state.title.indexOf(tag), 1)
    let title = cloneDeep(state.title)
    //深拷贝一次 用于watch监听
    state.title = title
  }

  const open = () => {
    let sum = {
      page: 1,
      limit: 99,
      type: props.form.fabricType,
      fabricWeightMin: props.form.fabricWeight.left,
      fabricWeightMax: props.form.fabricWeight.right,
      templateType: '3',
      templateId: props.form.templateDTO ? props.form.templateDTO.id : null
    }
    proxy.$baseService.get('/jack-ics-api/fabric/noParamFabricList', sum).then((res: any) => {
      if (res.code === 0) {
        let list = res.data
        if (!isEmpty(list)) {
          let fabricList: any = []
          list.forEach((item: any) => {
            fabricList.push({ name: item.name, id: item.id })
          })
          state.options = fabricList
        }
      }
    })

    //选中回显
    let ids: any = []
    state.title.forEach((item: any) => {
      ids.push(item.id)
    })
    data.value = ids
    dialogVisible.value = true
  }

  // 是否可用
  const disable = (type: any) => {
    if (!state.type) {
      //编辑/新增
      if (type) {
        ;(state.tagType = true), //是否可用
          (state.btnType = false) //是否可用
      } else {
        ;(state.tagType = false), //是否可用
          (state.btnType = true) //是否可用
      }
    } else {
      //查看
      ;(state.tagType = false), //是否可用
        (state.btnType = true) //是否可用
    }
  }

  //确认
  const confirm = () => {
    let checkValues: any = [] //选中所有值
    if (!isEmpty(data.value)) {
      data.value.map((v: any) => {
        let current = state.options.filter((item: any) => item.id === v)
        checkValues.push(current[0])
      })
    }
    state.title = checkValues
    dialogVisible.value = false
  }

  //数据更新传递给父级
  watch(
    () => state.title,
    item => {
      props.setFabric(item)
    }
  )
</script>

<style>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  .mx-1 {
    margin-left: 10px;
  }

  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .fabricCutting-btn {
    margin-top: 5px;
    margin-left: 5px;
  }
</style>
