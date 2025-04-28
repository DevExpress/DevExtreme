<template>
  <p>
    Select your check-in and check-out dates. If your dates are flexible, include that information in Additional Requests. We will do our best to suggest best pricing options, depending on room availability.
  </p>
  <DxForm
    :form-data="formData"
    :validation-group="validationGroup"
  >
    <DxSimpleItem
      :is-required="true"
      data-field="dates"
      editor-type="dxDateRangeBox"
      :editor-options="dateRangeBoxOptions"
      :label="labelOptions"
    />
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem } from 'devextreme-vue/form';
import 'devextreme/ui/date_range_box';
import type { BookingFormData } from './types.ts';
import { initialFormData } from './data.ts';

const props = withDefaults(defineProps<{
  formData: BookingFormData;
  validationGroup?: string;
}>(), {
  formData: () => initialFormData,
  validationGroup: () => undefined,
});

const labelOptions = {
  visible: false,
};

const dateRangeBoxOptions = {
  startDatePlaceholder: 'Check-in',
  endDatePlaceholder: 'Check-out',
  elementAttr: { id: 'datesPicker' },
};
</script>
