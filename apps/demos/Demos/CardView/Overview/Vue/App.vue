<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    cards-per-row="auto"
    :card-min-width="250"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
    :column-chooser="columnChooserConfig"
  >
    <DxColumn
      data-field="FullName"
      :allow-hiding="false"
    />
    <DxColumn data-field="Position"/>
    <DxColumn data-field="Department"/>
    <DxColumn data-field="Phone"/>
    <DxColumn data-field="Email"/>

    <DxCardCover :image-expr="getEmployeeImage"/>
    <DxPager
      :show-info="true"
      :show-navigation-buttons="true"
      :show-page-size-selector="true"
    />
    <DxSelection mode="multiple"/>
  </DxCardView>
</template>

<script setup lang="ts">
import DxCardView, {
  DxColumn, DxCardCover, DxPager, DxSelection,
} from 'devextreme-vue/card-view';
import { Employee, employees } from './data.ts';

const IMG_URL = 'https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }: Employee): string => `${IMG_URL}/${Picture}`;

// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};

// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
};

// TODO: Nested component does not exist
// TODO: Bad position types (strings not allowed)
const columnChooserConfig = {
  enabled: true,
  height: 340,
  mode: 'select' as const,
  position: {
    my: 'right top' as const,
    at: 'right bottom' as const,
    of: '.dx-cardview-column-chooser-button',
  },
  selection: {
    selectByClick: true,
  },
};
</script>
