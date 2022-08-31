vue
<!--
 * @Author: lyj
 * @Date: 2022-08-24 17:37:15
 * @LastEditTime: 2022-08-30 09:20:58
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-tag v-for="tag in state.title" :key="tag" :disabled="props.type" class="mx-1" closable :disable-transitions="false" @close="handleClose(tag)">
    {{ tag.label }}
  </el-tag>

  <!-- 弹窗 -->
  <el-button class="relatedFabric-btn" :disabled="props.type" size="small" @click="open"> +选择关联面料</el-button>
  <el-dialog v-model="dialogVisible" title="关联面料" width="30%">
    <div style="display: inline-block">
      <span style="margin-left: 10px">关联面料：</span>
      <el-select v-model="data" :disabled="props.type" multiple placeholder="请选择关联面料" style="width: 240px">
        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" />
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
  import { isEmpty } from 'lodash'
  import { ref, reactive } from 'vue'

  const dialogVisible: any = ref(false)

  const props = defineProps<{
    setFabric: any
    type: any
  }>()

  const data: any = ref([]) //选中项
  const state = reactive({
    title: [{}], //面料的 tag
    options: [{}] //总数据
  })

  //初始
  const init = () => {
    let res = [
      {
        value: '11',
        label: '小心'
      },
      {
        value: '22',
        label: '咪咪'
      },
      {
        value: '33',
        label: '糯米'
      }
    ]

    state.title = res
  }

  init()

  const handleClose = (tag: string) => {
    state.title.splice(state.title.indexOf(tag), 1)
  }

  const open = () => {
    //  调取总数据接口
    let res = [
      {
        value: '11',
        label: '小心'
      },
      {
        value: '22',
        label: '咪咪'
      },
      {
        value: '33',
        label: '糯米'
      },
      {
        value: '44',
        label: '梅鲁'
      },
      {
        value: '1',
        label: '葫芦娃1'
      },
      {
        value: '2',
        label: '葫芦娃2'
      },
      {
        value: '3',
        label: '葫芦娃3'
      },
      {
        value: '5',
        label: '葫芦娃4'
      },
      {
        value: '5',
        label: '葫芦娃5'
      }
    ]

    state.options = res

    //回显
    let ids: any = []
    state.title.forEach((item: any) => {
      ids.push(item.value)
    })
    data.value = ids
    dialogVisible.value = true
  }
  //确认
  const confirm = () => {
    dialogVisible.value = false

    let checkValues: any = [] //选中所有值
    if (!isEmpty(data.value)) {
      data.value.map((v: any) => {
        let current = state.options.filter((item: any) => item.value === v)
        checkValues.push(current[0])
      })
    }
    state.title = checkValues
    // 暴露出去
    props.setFabric(checkValues)
  }
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
  .relatedFabric-btn {
    margin-top: 5px;
    margin-left: 5px;
  }
</style>
