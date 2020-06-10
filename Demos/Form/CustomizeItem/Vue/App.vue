<template>
  <div>
    <div class="long-title"><h3>Employee Details</h3></div>
    <div id="form-container">
      <DxForm
        id="form"
        :on-content-ready="validateForm"
        :col-count="2"
        :form-data="employee"
      >
        <DxItem
          :editor-options="{disabled: true}"
          data-field="FirstName"
        />
        <DxItem
          :editor-options="{value: '', searchEnabled: true, items: positions}"
          :validation-rules="validationRules.position"
          data-field="Position"
          editor-type="dxSelectBox"
        />
        <DxItem
          :editor-options="{disabled: true}"
          data-field="LastName"
        />
        <DxItem
          :editor-options="{value: null, width: '100%'}"
          :validation-rules="validationRules.hireDate"
          data-field="HireDate"
          editor-type="dxDateBox"
        />
        <DxItem
          :editor-options="{disabled: true, width: '100%'}"
          data-field="BirthDate"
          editor-type="dxDateBox"
        />
        <DxItem
          data-field="Address"
        />
        <DxItem
          :col-span="2"
          :editor-options="{height: 90}"
          data-field="Notes"
          editor-type="dxTextArea"
        />
        <DxItem
          :editor-options="{mask: '+1 (X00) 000-0000', maskRules: { 'X': /[02-9]/ } }"
          data-field="Phone"
        />
        <DxItem
          data-field="Email"
        />
      </DxForm>
    </div>
  </div>
</template>
<script>
import { DxForm, DxItem } from 'devextreme-vue/form';
import service from './data.js';
import 'devextreme-vue/text-area';

export default {
  components: {
    DxForm,
    DxItem
  },
  data() {
    const employee = service.getEmployee();
    const positions = service.getPositions();
    return {
      employee,
      positions,
      validationRules: {
        position: [
          { type: 'required', message: 'Position is required.' },
        ],
        hireDate: [
          { type: 'required', message: 'Hire Date is required.' }
        ]
      }
    };
  },
  methods: {
    validateForm(e) {
      e.component.validate();
    }
  }
};
</script>
<style scoped>
#form-container {
    margin: 10px 10px 30px;
}

.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
