<template>
  <div class="dict-management">
    <div class="page-header">
      <h2>字典管理</h2>
    </div>

    <div class="page-content">
      <!-- 左侧：字典类型列表 -->
      <div class="left-panel">
        <DictTypeList
          :types="dictTypes"
          :selected-id="selectedType ? selectedType.id : null"
          @select="handleSelectType"
          @add-type="showTypeForm(null)"
        />
      </div>

      <!-- 右侧：字典数据列表 -->
      <div class="right-panel">
        <DictDataList
          :current-type="selectedType"
          :items="dictItems"
          @add-data="showDataForm"
          @edit-data="showDataForm"
          @delete-data="handleDeleteItem"
        />
      </div>
    </div>

    <!-- 字典类型表单弹窗 -->
    <DictTypeForm
      :visible="typeFormVisible"
      :edit-data="typeFormEditData"
      @save="handleSaveType"
      @cancel="typeFormVisible = false"
    />

    <!-- 字典数据表单弹窗 -->
    <DictDataForm
      :visible="dataFormVisible"
      :edit-data="dataFormEditData"
      @save="handleSaveData"
      @cancel="dataFormVisible = false"
    />
  </div>
</template>

<script>
import DictTypeList from './components/DictTypeList.vue'
import DictDataList from './components/DictDataList.vue'
import DictTypeForm from './components/DictTypeForm.vue'
import DictDataForm from './components/DictDataForm.vue'
import { dictTypeApi, dictItemApi } from '@/api/mock/dict-management/dictMock.js'

export default {
  name: 'DictManagement',
  components: {
    DictTypeList,
    DictDataList,
    DictTypeForm,
    DictDataForm,
  },
  data() {
    return {
      dictTypes: [],
      dictItems: [],
      selectedType: null,
      // 字典类型表单
      typeFormVisible: false,
      typeFormEditData: null,
      // 字典数据表单
      dataFormVisible: false,
      dataFormEditData: null,
      currentTypeCode: '',
    }
  },
  mounted() {
    this.loadTypes()
  },
  methods: {
    // 加载字典类型列表
    async loadTypes() {
      const res = await dictTypeApi.getList()
      if (res.code === 200) {
        this.dictTypes = res.data.records
      }
    },

    // 选中字典类型，加载数据
    async handleSelectType(type) {
      this.selectedType = type
      await this.loadItems(type.code)
    },

    // 加载字典数据
    async loadItems(typeCode) {
      this.currentTypeCode = typeCode
      const res = await dictItemApi.getList(typeCode)
      if (res.code === 200) {
        this.dictItems = res.data
      }
    },

    // 显示字典类型表单
    showTypeForm(editData) {
      this.typeFormEditData = editData
      this.typeFormVisible = true
    },

    // 保存字典类型
    async handleSaveType(formData) {
      let res
      if (formData.id) {
        res = await dictTypeApi.update(formData.id, formData)
      } else {
        res = await dictTypeApi.create(formData)
      }

      if (res.code === 200) {
        this.typeFormVisible = false
        await this.loadTypes()
      } else {
        alert(res.msg)
      }
    },

    // 显示字典数据表单
    showDataForm(item, type) {
      if (item) {
        // 编辑模式
        this.dataFormEditData = item
      } else {
        // 新增模式 - 保存当前类型信息
        this.dataFormEditData = null
        if (type && type.code) {
          this.currentTypeCode = type.code
        }
      }
      this.dataFormVisible = true
    },

    // 保存字典数据
    async handleSaveData(formData) {
      // 清理 formData，只保留字典数据的字段（排除 id, name, code, status 等字典类型的字段）
      const cleanData = {
        label: formData.label,
        value: formData.value,
        sort: formData.sort,
        remark: formData.remark,
      }
      // 编辑模式才传 id
      if (formData.id) {
        cleanData.id = formData.id
      }

      let res
      if (formData.id) {
        res = await dictItemApi.update(formData.id, cleanData)
      } else {
        res = await dictItemApi.create(this.currentTypeCode, cleanData)
      }

      if (res.code === 200) {
        this.dataFormVisible = false
        await this.loadItems(this.currentTypeCode)
      } else {
        alert(res.msg)
      }
    },

    // 删除字典数据
    async handleDeleteItem(item) {
      const res = await dictItemApi.remove(item.id)
      if (res.code === 200) {
        await this.loadItems(this.currentTypeCode)
      } else {
        alert(res.msg)
      }
    },
  },
}
</script>

<style scoped>
.dict-management {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.page-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 300px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.right-panel {
  flex: 1;
  overflow-y: auto;
}
</style>
