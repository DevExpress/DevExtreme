<template>
  <div id="tabs-demo">
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
<script>

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

export default {
  components: {
    DxCheckBox,
    DxSelectBox,
    DxTabs,
  },

  data() {
    return {
      orientations,
      stylingModes,
      iconPositions,
      fullWidth: false,
      rtlEnabled: false,
      scrollByContent: false,
      showNavButtons: false,
      orientation: orientations[0],
      iconPosition: iconPositions[0],
      stylingMode: stylingModes[1],
    };
  },

  computed: {
    widgetWrapperClasses() {
      const { orientation } = this;

      return `widget-wrapper widget-wrapper-${orientation}`;
    },
    tabsWidth() {
      const { fullWidth } = this;

      return fullWidth ? '100%' : 'auto';
    },
    dataSources() {
      return [tabsWithText, tabsWithIconAndText, tabsWithIcon];
    },
  },
};
</script>
<style>
#tabs-demo {
  display: flex;
  min-height: 450px;
}

.widget-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  max-width: calc(100% - 300px);
  min-width: 200px;
  padding: 16px 32px;
  overflow: clip;
}

.widget-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 80px;
  max-width: 100%;
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
