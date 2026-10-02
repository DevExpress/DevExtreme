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
        v-for="field in formFieldsConfig"
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
    v-model:visible="isToastVisible"
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
import { DxPosition, DxToast } from 'devextreme-vue/toast';
import type { AIIntegration } from 'devextreme-vue/common/ai-integration';
import { employee, formFieldsConfig } from './data.ts';
import type { Employee } from './data.ts';

defineProps<{ aiIntegration: AIIntegration }>();

const formRef = ref<InstanceType<typeof DxForm>>();
const isToastVisible = ref(false);

const formData: Employee = { ...employee };

const bottomCenterPosition = { x: 'center', y: 'bottom' } as const;

const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: '120px',
  onClick: () => {
    formRef.value?.instance.reset(formData);
    isToastVisible.value = true;
  },
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
  border: 1px solid var(--dx-color-border);
  padding: 16px;
  background-color: var(--dx-component-color-bg);
}

.dx-layout-manager .dx-field-item.save-button {
  padding-bottom: 0;
}
</style>
