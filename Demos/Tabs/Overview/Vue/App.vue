<template>
  <div class="tabs-demo">
    <div class="widget-container">
      <div :class="widgetWrapperClasses">
        <DxTabs
          v-for="(dataSource, index) in dataSources"
          :key="index"
          :selected-index="0"
          :width="tabsWidth"
          :rtl-enabled="rtlEnabled"
          :data-source="dataSource"
          :orientation="orientation"
          :styling-mode="stylingMode"
          :icon-position="iconPosition"
          :show-nav-buttons="showNavButtons"
          :scroll-by-content="scrollByContent"
        />
      </div>
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Orientation</span>
        <DxSelectBox
          :items="orientations"
          :input-attr="{ 'aria-label': 'Orientation' }"
          v-model:value="orientation"
        />
      </div>

      <div class="option">
        <span>Styling mode</span>
        <DxSelectBox
          :items="stylingModes"
          :input-attr="{ 'aria-label': 'Styling Mode' }"
          v-model:value="stylingMode"
        />
      </div>

      <div class="option">
        <span>Icon position</span>
        <DxSelectBox
          :items="iconPositions"
          :input-attr="{ 'aria-label': 'Icon Position' }"
          v-model:value="iconPosition"
        />
      </div>

      <div class="option">
        <DxCheckBox
          id="show-navigation-buttons"
          text="Show navigation buttons"
          v-model:value="showNavButtons"
        />
      </div>

      <div class="option">
        <DxCheckBox
          text="Scroll content"
          v-model:value="scrollByContent"
        />
      </div>

      <div class="option">
        <DxCheckBox
          text="Full width"
          v-model:value="fullWidth"
        />
      </div>

      <div class="option">
        <DxCheckBox
          text="Right-to-left mode"
          v-model:value="rtlEnabled"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import DxTabs from 'devextreme-vue/tabs';
import {
  orientations,
  stylingModes,
  iconPositions,
  tabsWithText,
  tabsWithIconAndText,
  tabsWithIcon,
} from './data.js';

const fullWidth = ref(false);
const rtlEnabled = ref(false);
const scrollByContent = ref(false);
const showNavButtons = ref(false);
const shouldRestrictWidth = ref(false);
const orientation = ref(orientations[0]);
const iconPosition = ref(iconPositions[0]);
const stylingMode = ref(stylingModes[1]);

const widgetWrapperClasses = computed(() => [
  'widget-wrapper',
  `widget-wrapper-${orientation.value}`,
  shouldRestrictWidth.value && 'strict-width',
]);

const tabsWidth = computed(() => (fullWidth.value ? '100%' : 'auto'));

const dataSources = computed(() => [
  tabsWithText,
  tabsWithIconAndText,
  tabsWithIcon,
]);

const enforceWidthConstraint = (value) => {
  shouldRestrictWidth.value = value || scrollByContent.value || showNavButtons.value;
};

watch(showNavButtons, enforceWidthConstraint);
watch(scrollByContent, enforceWidthConstraint);
</script>
<style>
.tabs-demo {
  display: flex;
}

.strict-width {
  max-width: 340px;
}

.dx-theme-generic .strict-width {
  max-width: 250px;
}

.widget-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  min-width: 200px;
  padding: 16px 32px;
  overflow: clip;
}

.widget-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;
  width: 100%;
}

.widget-wrapper-vertical {
  width: 100%;
  flex-direction: row;
  align-items: center;
}

.options {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

#show-navigation-buttons {
  margin-top: 22px;
}

.option {
  margin-top: 20px;
}

.dx-tabs {
  max-width: 100%;
}

.dx-tabs-vertical {
  height: 216px;
}

.dx-viewport:not(.dx-theme-generic) .dx-tabs-horizontal {
  border-block-end: 1px solid rgb(225, 225, 225, 0.4);
}

.dx-viewport:not(.dx-theme-generic) .dx-tabs-vertical {
  height: 232px;
  border-inline-end: 1px solid rgb(225, 225, 225, 0.4);
}
</style>
