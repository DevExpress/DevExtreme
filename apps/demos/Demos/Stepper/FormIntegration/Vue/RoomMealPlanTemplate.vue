<template>
  <p>
    Review room types that can accommodate your group size and make your selection.
    You can also choose a meal plan, whether it's breakfast only or full board.
  </p>
  <DxForm
    :form-data="formData"
    :validation-group="validationGroup"
    :col-count="2"
    ref="formRef"
  >
    <DxSimpleItem
      :is-required="true"
      data-field="roomType"
      editor-type="dxSelectBox"
      :editor-options="roomSelectBoxOptions"
      :label="roomLabelOptions"
    />

    <DxSimpleItem
      :is-required="true"
      data-field="mealPlan"
      editor-type="dxSelectBox"
      :editor-options="mealSelectBoxOptions"
      :label="mealLabelOptions"
    />
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem } from 'devextreme-vue/form';
import 'devextreme-vue/select-box';
import { watch, ref } from 'vue';
import type { BookingFormData } from './types.ts';
import { roomTypes, mealPlans, getInitialFormData } from './data.ts';

const formRef = ref<DxForm>();

const props = withDefaults(defineProps<{
  formData: BookingFormData;
  validationGroup?: string;
}>(), {
  formData: getInitialFormData,
  validationGroup: () => '',
});

watch(() => props.formData, (value) => {
  formRef.value?.instance?.reset(value);
});

const roomLabelOptions = {
  text: 'Room Type',
  location: 'top',
};

const roomSelectBoxOptions = {
  items: roomTypes,
  elementAttr: { id: 'roomType' },
};

const mealLabelOptions = {
  text: 'Meal Plan',
  location: 'top',
};

const mealSelectBoxOptions = {
  items: mealPlans,
  elementAttr: { id: 'mealPlan' },
};
</script>
