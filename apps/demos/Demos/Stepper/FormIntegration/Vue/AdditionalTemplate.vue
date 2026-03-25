<template>
  <div>
    Please let us know if you have any other requests.
  </div>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="additionalRequest"
      editor-type="dxTextArea"
      :editor-options="textAreaOptions"
      :label="labelOptions"
    />
  </DxForm>
</template>

<script setup lang="ts">
import { DxForm, DxSimpleItem } from 'devextreme-vue/form';
import 'devextreme-vue/text-area';
import type { BookingFormData } from './types.ts';
import { initialFormData } from './data.ts';

const props = withDefaults(defineProps<{
  formData?: BookingFormData;
}>(), {
  formData: () => initialFormData,
});

const labelOptions = {
  visible: false,
};

const textAreaOptions = {
  height: 160,
  elementAttr: { id: 'additionalRequest' },
};
</script>
