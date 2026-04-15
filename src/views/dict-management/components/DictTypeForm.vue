<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑字典类型' : '新增字典类型' }}</h3>
        <button class="close-btn" @click="handleCancel">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-item">
          <label class="required">字典名称</label>
          <input v-model="formData.name" type="text" placeholder="请输入字典名称" />
        </div>

        <div class="form-item">
          <label class="required">字典编码</label>
          <input
            v-model="formData.code"
            type="text"
            placeholder="请输入字典编码"
            :disabled="isEdit"
          />
        </div>

        <div class="form-item">
          <label>备注</label>
          <textarea v-model="formData.remark" placeholder="请输入备注" rows="3"></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-default" @click="handleCancel">取消</button>
        <button class="btn btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DictTypeForm',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        code: '',
        remark: '',
      },
    }
  },
  computed: {
    isEdit() {
      return this.editData !== null && this.editData !== undefined
    },
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.editData) {
          this.formData = { ...this.editData }
        } else {
          this.formData = { name: '', code: '', remark: '' }
        }
      }
    },
  },
  methods: {
    handleSave() {
      if (!this.formData.name) {
        alert('字典名称不能为空')
        return
      }
      if (!this.formData.code) {
        alert('字典编码不能为空')
        return
      }
      this.$emit('save', { ...this.formData })
    },
    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 480px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

.form-item label.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item input:focus,
.form-item textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.form-item input:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 5px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-default {
  color: #333;
  background: #fff;
}

.btn-primary {
  color: #fff;
  background: #1890ff;
  border-color: #1890ff;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style>
