<template>
  <DxStepper
    :items="items"
    v-model:selected-index="selectedIndex"
    @selection-changing="onSelectionChanging"
  />
  <div class="content">
    <DxMultiView
      v-model:selected-index="selectedIndex"
      :animation-enabled="false"
      :swipe-enabled="false"
      :height="300"
    >
      <DxItem>
        <template #default>
          <DatesTemplate
            :form-data="formData"
            :validation-group="validationGroups[0]"
          />
        </template>
      </DxItem>
      <DxItem>
        <template #default>
          <GuestsTemplate
            :form-data="formData"
            :validation-group="validationGroups[1]"
          />
        </template>
      </DxItem>
      <DxItem>
        <template #default>
          <RoomMealPlanTemplate
            :form-data="formData"
            :validation-group="validationGroups[2]"
          />
        </template>
      </DxItem>
      <DxItem>
        <template #default>
          <AdditionalTemplate :form-data="formData"/>
        </template>
      </DxItem>
      <DxItem>
        <template #default>
          <ConfirmationTemplate
            :form-data="formData"
            v-model:is-confirmed="isConfirmed"
          />
        </template>
      </DxItem>
    </DxMultiView>
    <div class="nav-panel">
      <div class="current-step">
        <span v-if="!isConfirmed">
          Step <span class="selected-index">{{ selectedIndex + 1 }}</span> of <span class="step-count">{{ items.length }}</span>
        </span>
      </div>
      <div class="nav-buttons">
        <DxButton
          :visible="selectedIndex !== 0 && !isConfirmed"
          text="Back"
          type="normal"
          @click="onPrevButtonClick"
        />
        <DxButton
          :text="nextButtonText"
          type="default"
          @click="onNextButtonClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DxButton from 'devextreme-vue/button';
import DxMultiView, { DxItem } from 'devextreme-vue/multi-view';
import DxStepper from 'devextreme-vue/stepper';
import type { IItemProps } from 'devextreme-react/cjs/stepper';
import type { SelectionChangingEvent } from 'devextreme/ui/stepper';
import validationEngine from 'devextreme/ui/validation_engine';
import DatesTemplate from './DatesTemplate.vue';
import GuestsTemplate from './GuestsTemplate.vue';
import RoomMealPlanTemplate from './RoomMealPlanTemplate.vue';
import AdditionalTemplate from './AdditionalTemplate.vue';
import ConfirmationTemplate from './ConfirmationTemplate.vue';
import { initialSteps, initialFormData } from './data.ts';
import { BookingFormData } from './types';

const cloneItems = () => initialSteps.map((item) => ({ ...item }));
const cloneFormData = () => ({
  ...initialFormData,
  dates: [...initialFormData.dates],
});

const selectedIndex = ref(0);
const isConfirmed = ref(false);
const items = ref<IItemProps[]>(cloneItems());
const formData = ref<BookingFormData>(cloneFormData());

const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];

const nextButtonText = computed(() => {
  if (selectedIndex.value < items.value.length - 1) {
    return 'Next';
  }

  return isConfirmed.value ? 'Reset' : 'Confirm';
});

const getValidationResult = (index: number) => {
  if (index >= validationGroups.length) {
    return true;
  }

  return validationEngine.validateGroup(validationGroups[index]).isValid;
};

const setStepValidationResult = (index: number, isValid: boolean | undefined) => {
  const prev = items.value;

  items.value = prev.map((item, i) => {
    if (i === index) {
      return {
        ...item,
        isValid,
      };
    }

    return item;
  });
};

function onSelectionChanging(e: SelectionChangingEvent) {
  if (isConfirmed.value) {
    e.cancel = true;

    return;
  }

  const { component, addedItems, removedItems } = e;
  const { items = [] } = component.option();

  const addedIndex = items.findIndex((item: IItemProps) => item === addedItems[0]);
  const removedIndex = items.findIndex((item: IItemProps) => item === removedItems[0]);
  const isMoveForward = addedIndex > removedIndex;

  if (isMoveForward) {
    const isValid = getValidationResult(removedIndex);

    setStepValidationResult(removedIndex, isValid);

    if (isValid === false) {
      e.cancel = true;
    }
  }
}

function onPrevButtonClick() {
  selectedIndex.value -= 1;
}

const moveNext = () => {
  const isValid = getValidationResult(selectedIndex.value);

  setStepValidationResult(selectedIndex.value, isValid);

  if (isValid) {
    selectedIndex.value += 1;
  }
};

const reset = () => {
  isConfirmed.value = false;
  selectedIndex.value = 0;
  formData.value = cloneFormData();
  validationEngine.resetGroup(validationGroups[0]);
  items.value = cloneItems();
};

const confirm = () => {
  isConfirmed.value = true;
  setStepValidationResult(items.value.length - 1, true);
};

function onNextButtonClick() {
  if (selectedIndex.value < items.value.length - 1) {
    moveNext();
  } else if (isConfirmed.value) {
    reset();
  } else {
    confirm();
  }
}
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
  height: 480px;
  min-width: 420px;
  padding: 40px 20px;
}

.content {
  padding-inline: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.dx-multiview-item-content:has(> .summary-container) {
  overflow: auto;
}

.summary-container {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.summary-item-header {
  font-weight: 600;
  font-size: var(--dx-font-size-sm);
}

.center {
  text-align: center;
}

.summary-item-label {
  color: var(--dx-color-icon);
}

.separator {
  width: 100%;
  height: 1px;
  border-bottom: solid 1px var(--dx-color-border);
}

.nav-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-step {
  color: var(--dx-color-icon);
}

.nav-buttons > *:not(:last-child) {
  margin-right: 8px;
}
</style>
