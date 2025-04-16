<template>
  <div class="stepper-demo">
    <div class="widget-container">
      <div
        class="widget-wrapper"
        :class="'widget-wrapper-' + orientation"
      >
        <div class="stepper-wrapper">
          <div
            id="iconsLabel"
            class="stepper-label"
          >
            Icons and Labels
          </div>
          <DxStepper
            id="icons"
            :element-attr="{ 'aria-labelledby': 'iconsLabel' }"
            :selected-index="2"
            :orientation="orientation"
            :linear="navigationMode"
            :select-on-focus="selectOnFocus"
            :rtl-enabled="rtlMode"
          >
            <DxItem
              :text="steps[0].text"
              :label="steps[0].label"
              :icon="steps[0].icon"
            />
            <DxItem
              :text="steps[1].text"
              :label="steps[1].label"
              :icon="steps[1].icon"
            />
            <DxItem
              :text="steps[2].text"
              :label="steps[2].label"
              :icon="steps[2].icon"
              :optional="steps[2].optional"
            />
            <DxItem
              :text="steps[3].text"
              :label="steps[3].label"
              :icon="steps[3].icon"
            />
            <DxItem
              :text="steps[4].text"
              :label="steps[4].label"
              :icon="steps[4].icon"
            />
          </DxStepper>
        </div>
        <div class="stepper-wrapper">
          <div
            id="numbersLabel"
            class="stepper-label"
          >
            Numbers and Labels
          </div>
          <DxStepper
            id="numbers"
            :element-attr="{ 'aria-labelledby': 'numbersLabel' }"
            :selected-index="2"
            :orientation="orientation"
            :linear="navigationMode"
            :select-on-focus="selectOnFocus"
            :rtl-enabled="rtlMode"
          >

            <DxItem
              :label="steps[0].label"
            />
            <DxItem
              :label="steps[1].label"
            />
            <DxItem
              :label="steps[2].label"
              :optional="steps[2].optional"
            />
            <DxItem
              :label="steps[3].label"
            />
            <DxItem
              :label="steps[4].label"
            />
          </DxStepper>
        </div>
        <div class="stepper-wrapper">
          <div
            id="customTextLabel"
            class="stepper-label"
          >
            Custom Text
          </div>
          <DxStepper
            id="customText"
            :element-attr="{ 'aria-labelledby': 'customTextLabel' }"
            :selected-index="2"
            :orientation="orientation"
            :linear="navigationMode"
            :select-on-focus="selectOnFocus"
            :rtl-enabled="rtlMode"
          >

            <DxItem
              :text="steps[0].text"
            />
            <DxItem
              :text="steps[1].text"
            />
            <DxItem
              :text="steps[2].text"
            />
            <DxItem
              :text="steps[3].text"
            />
            <DxItem
              :text="steps[4].text"
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
      <div class="option-separator"/>
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
import DxButtonGroup, { type DxButtonGroupTypes } from 'devextreme-vue/button-group';
import DxCheckBox from 'devextreme-vue/check-box';
import { steps, orientations, navigationModes } from './data.ts';

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
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
}

.stepper-demo {
  display: flex;
  height: 700px;
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
