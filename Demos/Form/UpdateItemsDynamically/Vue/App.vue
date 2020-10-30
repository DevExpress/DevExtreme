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
<script>
import {
  DxForm,
  DxSimpleItem,
  DxGroupItem,
  DxButtonItem,
  DxLabel
} from 'devextreme-vue/form';
import service from './data.js';

export default {
  components: {
    DxForm,
    DxSimpleItem,
    DxGroupItem,
    DxButtonItem,
    DxLabel
  },
  data() {
    const employee = service.getEmployee();
    let isHomeAddressVisible = true;

    let phoneOptions = this.getPhonesOptions(employee.Phones);

    return {
      employee,
      isHomeAddressVisible,
      phoneOptions,
      checkBoxOptions: {
        text: 'Show Address',
        value: true,
        onValueChanged: (e) => {
          this.isHomeAddressVisible = e.component.option('value');
        }
      },
      addPhoneButtonOptions: {
        icon: 'add',
        text: 'Add phone',
        onClick: () => {
          this.employee.Phones.push('');
          this.phoneOptions = this.getPhonesOptions(this.employee.Phones);
        }
      }
    };
  },
  methods: {
    getPhonesOptions(phones) {
      let options = [];
      for (let i = 0; i < phones.length; i++) {
        options.push(this.generateNewPhoneOptions(i));
      }
      return options;
    },
    generateNewPhoneOptions(index) {
      return {
        mask: '+1 (X00) 000-0000',
        maskRules: { 'X': /[01-9]/ },
        buttons: [{
          name: 'trash',
          location: 'after',
          options: {
            stylingMode: 'text',
            icon: 'trash',
            onClick: () => {
              this.employee.Phones.splice(index, 1);
              this.phoneOptions = this.getPhonesOptions(this.employee.Phones);
            }
          }
        }]
      };
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

.add-phone-button {
    margin-top: 10px;
}
</style>
