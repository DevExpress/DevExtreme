<template>
  <p>
    Enter the number of adults, children, and pets staying in the room. This information help us suggest suitable room types, number of beds, and included amenities.
  </p>
  <DxForm
    :form-data="formData"
    :validation-group="validationGroup"
    :col-count="3"
  >
    <DxSimpleItem
      :is-required="true"
      data-field="adultsCount"
      editor-type="dxNumberBox"
      :editor-options="numberBoxOptions"
      :label="adultsLabelOptions"
    >
      <DxRangeRule :min="1"/>
    </DxSimpleItem>
    <DxSimpleItem
      data-field="childrenCount"
      editor-type="dxNumberBox"
      :editor-options="numberBoxOptions"
      :label="childrenLabelOptions"
    />
    <DxSimpleItem
      data-field="petsCount"
      editor-type="dxNumberBox"
      :editor-options="numberBoxOptions"
      :label="petsLabelOptions"
    />
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxRangeRule, DxSimpleItem } from 'devextreme-vue/form';
import 'devextreme/ui/number_box';
import { BookingFormData } from './types.ts';
import { initialFormData } from './data.ts';

const props = withDefaults(defineProps<{
  formData: BookingFormData;
  validationGroup?: string;
}>(), {
  formData: () => initialFormData,
  validationGroup: () => undefined,
});

const adultsLabelOptions = {
  text: 'Adults',
  location: 'top',
};

const childrenLabelOptions = {
  text: 'Children',
  location: 'top',
};

const petsLabelOptions = {
  text: 'Pelts',
  location: 'top',
};

const numberBoxOptions = {
  min: 0,
  max: 5,
  showSpinButtons: true,
};
</script>
