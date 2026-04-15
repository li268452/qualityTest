<template>
  <div v-if="visible" class="modal-mask">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑优惠券' : '新增优惠券' }}</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-item">
          <label><span class="required">*</span> 优惠券名称</label>
          <input v-model="form.name" placeholder="请输入优惠券名称" />
        </div>
        <div class="form-item">
          <label><span class="required">*</span> 优惠券类型</label>
          <select v-model="form.typeCode" placeholder="请选择优惠券类型">
            <option value="">请选择类型</option>
            <option v-for="item in couponTypes" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label><span class="required">*</span> 面额（元）</label>
          <input v-model.number="form.amount" type="number" placeholder="请输入面额" />
        </div>
        <div class="form-item">
          <label>使用门槛（元）</label>
          <input v-model.number="form.threshold" type="number" placeholder="请输入使用门槛" />
        </div>
        <div class="form-item">
          <label>有效期</label>
          <div class="date-range">
            <input v-model="form.startDate" type="date" />
            <span>至</span>
            <input v-model="form.endDate" type="date" />
          </div>
        </div>
        <div class="form-item">
          <label>备注</label>
          <textarea v-model="form.remark" placeholder="请输入备注" rows="3"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSubmit">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dictQueryApi } from '@/api/mock/dict-management/dictMock.js'

export default {
  name: 'CouponForm',
  props: {
    visible: { type: Boolean, default: false },
    editData: { type: Object, default: null },
  },
  emits: ['close', 'submit'],
  data() {
    return {
      couponTypes: [],
      form: {
        name: '',
        typeCode: '',
        amount: '',
        threshold: '',
        startDate: '',
        endDate: '',
        remark: '',
      },
    }
  },
  computed: {
    isEdit() {
      return !!this.editData
    },
  },
  watch: {
    editData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val }
        } else {
          this.resetForm()
        }
      },
    },
  },
  mounted() {
    this.loadCouponTypes()
  },
  methods: {
    async loadCouponTypes() {
      const res = await dictQueryApi.getByCode('coupon_type')
      if (res.code === 200) {
        this.couponTypes = res.data
      }
    },
    resetForm() {
      this.form = {
        name: '',
        typeCode: '',
        amount: '',
        threshold: '',
        startDate: '',
        endDate: '',
        remark: '',
      }
    },
    handleClose() {
      this.resetForm()
      this.$emit('close')
    },
    handleSubmit() {
      if (!this.form.name) {
        alert('请输入优惠券名称')
        return
      }
      if (!this.form.typeCode) {
        alert('请选择优惠券类型')
        return
      }
      if (!this.form.amount || this.form.amount <= 0) {
        alert('面额必须大于0')
        return
      }
      if (this.form.threshold && this.form.threshold < this.form.amount) {
        alert('使用门槛不能小于面额')
        return
      }
      this.$emit('submit', { ...this.form, typeName: this.getTypeName(this.form.typeCode) })
    },
    getTypeName(code) {
      const found = this.couponTypes.find(t => t.value === code)
      return found ? found.label : ''
    },
  },
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
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
.required {
  color: #f56c6c;
}
.form-item input,
.form-item textarea,
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
.form-item input:focus,
.form-item textarea:focus,
.form-item select:focus {
  outline: none;
  border-color: #409eff;
}
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.date-range input {
  flex: 1;
}
.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.btn-primary:hover {
  background: #66b1ff;
}
.btn-cancel:hover {
  color: #409eff;
  border-color: #c6e2ff;
}
</style>
