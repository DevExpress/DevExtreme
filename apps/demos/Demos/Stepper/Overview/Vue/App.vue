<template>
  <div class="stepper-demo">
    <div class="widget-container">
      <div :class="['widget-wrapper', 'widget-wrapper-' + orientation]">
        <div
          v-for="config in stepperConfigs"
          :key="config.id"
          class="stepper-wrapper"
        >
          <div :id="config.labelId" class="stepper-label">
            {{ config.title }}
          </div>
          <DxStepper
            :id="config.id"
            :element-attr="{ 'aria-labelledby': config.labelId }"
            :selected-index="2"
            :orientation="orientation"
            :linear="navigationMode"
            :select-on-focus="selectOnFocus"
            :rtl-enabled="rtlMode"
          >
            <DxItem
              v-for="(step, index) in steps"
              :key="index"
              v-bind="getItemProps(step, config.fields)"
            />
          </DxStepper>
        </div>
      </div>
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <div>Orientation</div>
        <DxButtonGroup
          id="orientation"
          key-expr="value"
          :items="orientations"
          :selected-item-keys="[orientation]"
          @item-click="onOrientationClick"
        />
      </div>
      <div class="option">
        <div>Navigation Mode</div>
        <DxButtonGroup
          id="navigationMode"
          key-expr="value"
          :items="navigationModes"
          :selected-item-keys="[navigationMode]"
          @item-click="onNavigationModeClick"
        />
      </div>
      <div class="option-separator" />
      <div class="option">
        <DxCheckBox
          id="selectOnFocus"
          text="Select step on focus"
          v-model:value="selectOnFocus"
        />
      </div>
      <div class="option">
        <DxCheckBox
          id="rtlMode"
          text="Right-to-left mode"
          v-model:value="rtlMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxStepper, DxItem } from 'devextreme-vue/stepper';
import { DxButtonGroup, type DxButtonGroupTypes } from 'devextreme-vue/button-group';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { steps, orientations, navigationModes, type Step } from './data.ts';

const orientation = ref(orientations[0].value);
const navigationMode = ref(navigationModes[0].value);
const selectOnFocus = ref(true);
const rtlMode = ref(false);

function onOrientationClick(e: DxButtonGroupTypes.ItemClickEvent) {
  orientation.value = e.itemData.value;
}

function onNavigationModeClick(e: DxButtonGroupTypes.ItemClickEvent) {
  navigationMode.value = e.itemData.value;
}

const stepperConfigs = [
  {
    id: 'icons',
    labelId: 'iconsLabel',
    title: 'Icons and Labels',
    fields: ['label', 'icon', 'optional'] as const,
  },
  {
    id: 'numbers',
    labelId: 'numbersLabel',
    title: 'Numbers and Labels',
    fields: ['label', 'optional'] as const,
  },
  {
    id: 'customText',
    labelId: 'customTextLabel',
    title: 'Custom Text',
    fields: ['text'] as const,
  },
];

function getItemProps(step: Step, fields: readonly string[]) {
  return fields.reduce((acc, field) => {
    if (field in step) {
      acc[field] = step[field];
    }
    return acc;
  }, {} as Record<string, unknown>);
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
}

.stepper-demo {
  display: flex;
  height: 580px;
  gap: 20px;
}

.widget-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 280px);
  min-width: 320px;
  overflow: clip;
  gap: 20px;
}

.widget-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 80px;
  width: 100%;
  height: 100%;
}

.widget-wrapper-vertical {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.widget-wrapper-vertical .stepper-wrapper {
  width: auto;
  max-width: 33%;
}

.widget-wrapper-vertical .stepper-label {
  text-align: center;
  white-space: nowrap;
}

.widget-wrapper-vertical #customText {
  width: auto;
}

.dx-stepper-vertical {
  height: 400px;
  width: 100%;
}

.stepper-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.stepper-label {
  font-weight: 600;
}

.options {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 300px;
  box-sizing: border-box;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  gap: 16px;
  height: 100%;
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.option-separator {
  border-bottom: 1px solid var(--dx-color-border);
}

.dx-buttongroup .dx-button {
  width: 50%;
}
</style>
