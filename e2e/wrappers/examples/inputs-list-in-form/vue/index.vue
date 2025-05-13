<template>
    <div>
      <div class="long-title"><h3>Personal details</h3></div>
      <div class="form-container">
        <DxForm
          :col-count="2"
          id="form"
          :form-data="formData"
        >
          <DxGroupItem>
            <DxGroupItem>
              <DxGroupItem caption="Personal Data">
                <DxSimpleItem data-field="FirstName" />
                <DxSimpleItem data-field="LastName" />
                <DxSimpleItem 
                  editor-type="dxCheckBox"
                  :editor-options="checkBoxOptions"
                />
              </DxGroupItem>
            </DxGroupItem>
            <DxGroupItem>
              <DxGroupItem
                name="HomeAddress"
                caption="Home Address"
                :visible="isHomeAddressVisible"
              >
                <DxSimpleItem data-field="Address" />
                <DxSimpleItem data-field="City" />
              </DxGroupItem>
            </DxGroupItem>
          </DxGroupItem>
  
          <DxGroupItem caption="Phones" name="phones-container">
            <DxGroupItem name="phones">
              <DxSimpleItem
                v-for="(phone, index) in phones"
                :key="`phone-${index}`"
                :data-field="`Phones[${index}]`"
                :editor-options="phoneEditorOptions(index)"
              >
                <DxLabel :text="`Phone ${index + 1}`" />
              </DxSimpleItem>
            </DxGroupItem>
            <DxButtonItem
              horizontal-alignment="left"
              css-class="add-phone-button"
              :button-options="phoneButtonOptions"
            />
          </DxGroupItem>
        </DxForm>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import DxForm, {
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxButtonItem
  } from 'devextreme-vue/form';
  
  const employeeCore = {
    FirstName: 'John',
    LastName: 'Heart',
    Address: '351 S Hill St., Los Angeles, CA',
    City: 'Atlanta',
    Phones: [],
  };
  
  export default {
    components: {
      DxForm,
      DxGroupItem,
      DxSimpleItem,
      DxLabel,
      DxButtonItem
    },
    setup() {
      const phones = ref([...employeeCore.Phones]);
      const isHomeAddressVisible = ref(true);
  
      const formData = computed(() => ({
        ...employeeCore,
        Phones: phones.value,
      }));
  
      const checkBoxOptions = computed(() => ({
        text: 'Show Address',
        value: isHomeAddressVisible.value,
        onValueChanged(e) {
          isHomeAddressVisible.value = e.component.option('value');
        },
      }));
  
      const phoneEditorOptions = (index) => ({
        mask: '+1 (X00) 000-0000',
        maskRules: { X: /[01-9]/ },
        buttons: [{
          name: 'trash',
          location: 'after',
          options: {
            stylingMode: 'text',
            icon: 'trash',
            onClick() {
              phones.value.splice(index, 1);
            },
          },
        }],
      });
  
      const phoneButtonOptions = {
        icon: 'add',
        text: 'Add phone',
        onClick() {
          phones.value.push('');
        },
      };
  
      return {
        formData,
        phones,
        isHomeAddressVisible,
        checkBoxOptions,
        phoneEditorOptions,
        phoneButtonOptions,
      };
    },
  };
  </script>
  
  <style>
  .long-title h3 {
    margin: 0 0 20px;
  }
  .form-container {
    padding: 20px;
  }
  </style>
  