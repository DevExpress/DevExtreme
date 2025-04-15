<template>
  <p>
    Review room types that can accommodate your group size and make your selection. You can also choose a meal plan, whether it's breakfast only or full board.
  </p>
  <DxForm
    :form-data="formData"
    :validation-group="validationGroup"
    :col-count="2"
  >
    <DxSimpleItem
      :is-required="true"
      data-field="roomType"
      editor-type="dxSelectBox"
      :editor-options="roomSelectBoxOptions"
      :label="roomLabelOptions"
    >
      <DxRequiredRule/>
    </DxSimpleItem>

    <DxSimpleItem
      :is-required="true"
      data-field="mealPlan"
      editor-type="dxSelectBox"
      :editor-options="mealSelectBoxOptions"
      :label="mealLabelOptions"
    >
      <DxRequiredRule/>
    </DxSimpleItem>
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxRequiredRule, DxSimpleItem } from 'devextreme-vue/form';
import 'devextreme/ui/select_box';
import { BookingFormData } from './types.ts';
import { roomTypes, mealPlans, initialFormData } from './data.ts';

const props = withDefaults(defineProps<{
  formData: BookingFormData;
  validationGroup?: string;
}>(), {
  formData: () => initialFormData,
  validationGroup: () => undefined,
});

const roomLabelOptions = {
  text: 'Room Type',
  location: 'top',
};

const roomSelectBoxOptions = {
  items: roomTypes,
};

const mealLabelOptions = {
  text: 'Meal Plan',
  location: 'top',
};

const mealSelectBoxOptions = {
  items: mealPlans,
};
</script>
