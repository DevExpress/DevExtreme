<template>
  <div
    id="form-container"
    class="form-container"
  >
    <DxForm
      ref="formRef"
      :form-data="formData"
      :col-count="3"
      label-location="top"
      :ai-integration="aiIntegration"
      @option-changed="onOptionChanged"
    >
      <DxSimpleItem
        v-for="field in formFields"
        :key="field.dataField"
        :data-field="field.dataField"
        :label="field.label"
        :editor-type="field.editorType"
        :editor-options="field.editorOptions"
        :ai-options="field.aiOptions"
      />
      <DxButtonItem
        name="Save"
        :col-span="3"
        css-class="save-button"
        :button-options="saveButtonOptions"
      />
    </DxForm>
  </div>

  <DxToast
    ref="toastRef"
    :display-time="600"
    :close-on-click="true"
    message="Form data is saved."
    type="success"
  >
  <DxPosition
    of="#form-container"
    :at="bottomCenterPosition"
    :my="bottomCenterPosition"
    offset="0 -20"
  />
  </DxToast>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxForm, DxSimpleItem, DxButtonItem } from 'devextreme-vue/form';
import type { DxFormTypes } from 'devextreme-vue/form';
import { DxPosition, DxToast, type DxToastTypes } from 'devextreme-vue/toast';
import type { AIIntegration } from 'devextreme-vue/common/ai-integration';
import { employee, formFieldsConfig } from './data.ts';
import type { Employee } from './data.ts';

defineProps<{ aiIntegration: AIIntegration }>();

const formRef = ref<InstanceType<typeof DxForm>>();
const toastRef = ref<InstanceType<typeof DxToast>>();

const formData: Employee = { ...employee };
const formFields = formFieldsConfig;

const bottomCenterPosition = { x: 'center', y: 'bottom' } as const;

const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: '120px',
  onClick: () => toastRef.value?.instance.show(),
};

function onOptionChanged(e: DxFormTypes.OptionChangedEvent): void {
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

<style>
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
