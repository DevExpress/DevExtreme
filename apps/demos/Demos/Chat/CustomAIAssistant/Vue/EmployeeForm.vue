<template>
  <div
    id="form-container"
    class="form-container"
  >
    <DxForm
      ref="formRef"
      :formData="formData"
      :colCount="3"
      labelLocation="top"
      :aiIntegration="aiIntegration"
      :onOptionChanged="onOptionChanged"
    >
      <DxSimpleItem
        v-for="field in formFields"
        :key="field.dataField"
        :dataField="field.dataField"
        :label="field.label"
        :editorType="field.editorType"
        :editorOptions="field.editorOptions"
        :aiOptions="field.aiOptions"
      />
      <DxButtonItem
        name="Save"
        :colSpan="3"
        cssClass="save-button"
        :buttonOptions="saveButtonOptions"
      />
    </DxForm>
  </div>

  <DxToast
    ref="toastRef"
    :displayTime="600"
    :closeOnClick="true"
    message="Form data is saved."
    type="success"
    :position="toastPosition"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxForm, DxSimpleItem, DxButtonItem } from 'devextreme-vue/form';
import type { DxFormTypes } from 'devextreme-vue/form';
import { DxToast } from 'devextreme-vue/toast';
import type { AIIntegration } from 'devextreme-vue/common/ai-integration';
import { employee, formFieldsConfig } from './data.ts';
import type { Employee } from './types';

defineProps<{ aiIntegration: AIIntegration }>();

const formRef = ref<InstanceType<typeof DxForm>>();
const toastRef = ref<InstanceType<typeof DxToast>>();

const formData: Employee = { ...employee };
const formFields = formFieldsConfig;

const toastPosition = {
  of: '#form-container',
  at: 'bottom center',
  my: 'bottom center',
  offset: '0 -20',
};

const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: '120px',
  onClick: () => toastRef.value?.instance.show(),
};

function onOptionChanged(e: DxFormTypes.OptionChangedEvent) {
  if (e.name === 'isDirty') {
    e.component?.getButton('Save')?.option('disabled', !e.value);
  }
}

defineExpose({
  get instance() {
    return formRef.value!.instance;
  },
});
</script>

<style scoped>
#form-container {
  border: 1px solid #e0e0e0;
  padding: 16px;
  background-color: var(--form-background-color, #fff);
}

.dx-color-scheme-dark #form-container {
  --form-background-color: var(--dx-component-color-bg);
}

.dx-layout-manager .dx-field-item.save-button {
  padding-bottom: 0;
}
</style>
