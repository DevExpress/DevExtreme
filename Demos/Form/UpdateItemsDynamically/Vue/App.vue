<template>
  <div>
    <div class="long-title"><h3>Personal details</h3></div>
    <div id="form-container">
      <DxForm
        id="form"
        :col-count="2"
        :form-data="employee"
      >
        <DxGroupItem>
          <DxGroupItem caption="Personal Data">
            <DxSimpleItem data-field="FirstName"/>
            <DxSimpleItem data-field="LastName"/>
            <DxSimpleItem
              :editor-options="checkBoxOptions"
              editor-type="dxCheckBox"
            />
          </DxGroupItem>
          <DxGroupItem>
            <DxGroupItem
              :visible="isHomeAddressVisible"
              caption="Home Address"
              name="HomeAddress"
            >
              <DxSimpleItem data-field="Address"/>
              <DxSimpleItem data-field="City"/>
            </DxGroupItem>
          </DxGroupItem>
        </DxGroupItem>
        <DxGroupItem
          caption="Phones"
          name="phones-container"
        >
          <DxGroupItem
            item-type="group"
            name="phones"
          >
            <DxSimpleItem
              v-for="(phone, index) in phoneOptions"
              :key="'Phone' + (index + 1)"
              :data-field="'Phones[' + index + ']'"
              :editor-options="phone"
            >
              <DxLabel :text="'Phone ' + (index + 1)"/>
            </DxSimpleItem>
          </DxGroupItem>
          <DxButtonItem
            :button-options="addPhoneButtonOptions"
            css-class="add-phone-button"
            horizontal-alignment="left"
          />
        </DxGroupItem>
      </DxForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxForm,
  DxSimpleItem,
  DxGroupItem,
  DxButtonItem,
  DxLabel,
} from 'devextreme-vue/form';
import service from './data.ts';

const employee = service.getEmployee();
const phoneOptions = ref(getPhonesOptions(employee.Phones));
let isHomeAddressVisible = true;

const checkBoxOptions = {
  text: 'Show Address',
  value: true,
  onValueChanged: (e) => {
    isHomeAddressVisible = e.component.option('value');
  },
};
const addPhoneButtonOptions = {
  icon: 'add',
  text: 'Add phone',
  onClick: () => {
    employee.Phones.push('');
    phoneOptions.value = getPhonesOptions(employee.Phones);
  },
};

function getPhonesOptions(phones) {
  const options = [];
  for (let i = 0; i < phones.length; i += 1) {
    options.push(generateNewPhoneOptions(i));
  }
  return options;
}
function generateNewPhoneOptions(index) {
  return {
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[01-9]/ },
    buttons: [{
      name: 'trash',
      location: 'after',
      options: {
        stylingMode: 'text',
        icon: 'trash',
        onClick: () => {
          employee.Phones.splice(index, 1);
          phoneOptions.value = getPhonesOptions(employee.Phones);
        },
      },
    }],
  };
}
</script>
<style scoped>
#form-container {
  margin: 10px 10px 30px;
}

.long-title h3 {
  font-family:
    'Segoe UI Light',
    'Helvetica Neue Light',
    'Segoe UI',
    'Helvetica Neue',
    'Trebuchet MS',
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.add-phone-button {
  margin-top: 10px;
}
</style>
