<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
    >
      <DxScrolling row-rendering-mode="virtual"/>
      <DxPaging :page-size="10"/>
      <DxPager
        :visible="true"
        :allowed-page-sizes="pageSizes"
        :display-mode="displayMode"
        :show-page-size-selector="showPageSizeSelector"
        :show-info="showInfo"
        :show-navigation-buttons="showNavButtons"
      />
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option-container">
        <div class="option">
          <span class="option-caption">Display Mode</span>
          <DxSelectBox
            id="dispalyModes"
            :items="displayModes"
            v-model:value="displayMode"
          />
        </div>
        <div class="option">
          <DxCheckBox
            id="showPageSizes"
            text="Show Page Size Selector"
            v-model:value="showPageSizeSelector"
          />
        </div>
        <div class="option">
          <DxCheckBox
            id="showInfo"
            text="Show Info Text"
            :disabled="isCompactMode"
            v-model:value="showInfo"
          />
        </div>
        <div class="option">
          <DxCheckBox
            id="showNavButtons"
            text="Show Navigation Buttons"
            :disabled="isCompactMode"
            v-model:value="showNavButtons"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxScrolling,
  DxPager,
  DxPaging,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import { generateData } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxPager,
    DxPaging,
    DxCheckBox,
    DxSelectBox,
  },
  data() {
    return {
      dataSource: generateData(100000),
      displayModes: ['full', 'compact'],
      displayMode: 'full',
      pageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavButtons: true,
    };
  },
  computed: {
    isCompactMode: function() {
      return this.displayMode === 'compact';
    },
  },
};
</script>
