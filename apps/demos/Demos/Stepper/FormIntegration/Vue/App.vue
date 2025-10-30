<template>
  <DxStepper
    :focus-state-enabled="!isStepperReadonly"
    :class="{ readonly: isStepperReadonly }"
    v-model:selected-index="selectedIndex"
    @selection-changing="onSelectionChanging"
  >
    <DxStepperItem
      v-for="item of steps"
      :label="item.label"
      :icon="item.icon"
      :is-valid="item.isValid"
      :hint="item.hint"
      :optional="item.optional"
    />
  </DxStepper>
  <div class="content">
    <DxMultiView
      v-model:selected-index="selectedIndex"
      :focus-state-enabled="false"
      :animation-enabled="false"
      :swipe-enabled="false"
      :height="400"
    >
      <DxMultiViewItem>
        <template #default>
          <DatesTemplate
            :form-data="formData"
            :validation-group="validationGroups[0]"
          />
        </template>
      </DxMultiViewItem>
      <DxMultiViewItem>
        <template #default>
          <GuestsTemplate
            :form-data="formData"
            :validation-group="validationGroups[1]"
          />
        </template>
      </DxMultiViewItem>
      <DxMultiViewItem>
        <template #default>
          <RoomMealPlanTemplate
            :form-data="formData"
            :validation-group="validationGroups[2]"
          />
        </template>
      </DxMultiViewItem>
      <DxMultiViewItem>
        <template #default>
          <AdditionalTemplate :form-data="formData"/>
        </template>
      </DxMultiViewItem>
      <DxMultiViewItem>
        <template #default>
          <ConfirmationTemplate
            :form-data="formData"
            v-model:is-confirmed="isConfirmed"
          />
        </template>
      </DxMultiViewItem>
    </DxMultiView>
    <div class="nav-panel">
      <div class="current-step">
        <span v-if="!isConfirmed">
          Step <span class="selected-index">{{ selectedIndex + 1 }}</span> of {{ steps.length }}
        </span>
      </div>
      <div class="nav-buttons">
        <DxButton
          id="prevButton"
          :visible="selectedIndex !== 0 && !isConfirmed"
          text="Back"
          type="normal"
          @click="onPrevButtonClick"
          :width="100"
        />
        <DxButton
          id="nextButton"
          :text="nextButtonText"
          type="default"
          @click="onNextButtonClick"
          :width="100"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DxButton } from 'devextreme-vue/button';
import { DxMultiView, DxItem as DxMultiViewItem } from 'devextreme-vue/multi-view';
import { DxStepper, DxItem as DxStepperItem, type DxStepperTypes } from 'devextreme-vue/stepper';
import validationEngine from 'devextreme/ui/validation_engine';
import DatesTemplate from './DatesTemplate.vue';
import GuestsTemplate from './GuestsTemplate.vue';
import RoomMealPlanTemplate from './RoomMealPlanTemplate.vue';
import AdditionalTemplate from './AdditionalTemplate.vue';
import ConfirmationTemplate from './ConfirmationTemplate.vue';
import { getInitialSteps, getInitialFormData } from './data.ts';
import type { BookingFormData } from './types';

const selectedIndex = ref(0);
const isConfirmed = ref(false);
const isStepperReadonly = ref(false);
const steps = ref<DxStepperTypes.Item[]>(getInitialSteps());
const formData = ref<BookingFormData>(getInitialFormData());

const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];

const nextButtonText = computed(() => {
  if (selectedIndex.value < steps.value.length - 1) {
    return 'Next';
  }

  return isConfirmed.value ? 'Reset' : 'Confirm';
});

const getValidationResult = (index: number) => {
  if (index >= validationGroups.length) {
    return true;
  }
 console.log('----validationGroups------>', [validationGroups ,index, validationGroups[index]])
  return validationEngine.validateGroup(validationGroups[index]).isValid;
};

const setStepValidationResult = (index: number, isValid: boolean | undefined) => {
  steps.value[index].isValid = isValid;
};

function onSelectionChanging(e: DxStepperTypes.SelectionChangingEvent) {
  const { component, addedItems, removedItems } = e;
  const { items = [] } = component.option();

  const addedIndex = items.findIndex((item: DxStepperTypes.Item) => item === addedItems[0]);
  const removedIndex = items.findIndex((item: DxStepperTypes.Item) => item === removedItems[0]);
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
  steps.value = getInitialSteps();
  formData.value = getInitialFormData();
  isStepperReadonly.value = false;
};

const confirm = () => {
  isConfirmed.value = true;
  setStepValidationResult(selectedIndex.value, true);
  isStepperReadonly.value = true;
};

function onNextButtonClick() {
  if (selectedIndex.value < steps.value.length - 1) {
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
  min-height: 580px;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
  height: 580px;
  min-width: 620px;
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

.nav-buttons {
  display: flex;
  gap: 8px;
}

.readonly {
  pointer-events: none;
}
</style>
