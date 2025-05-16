<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    :allow-column-reordering="true"
    cards-per-row="auto"
    :card-min-width="250"
    :header-filter="headerFilterConfig"
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

    <DxCardCover
      :image-expr="getEmployeeImage"
      :alt-expr="getEmployeeImageAltText"
    />
    <DxPager
      :show-info="true"
      :show-navigation-buttons="true"
      :show-page-size-selector="true"
    />
    <DxSearchPanel :visible="true" />
    <DxSelection mode="multiple"/>
  </DxCardView>
</template>

<script setup lang="ts">
import { DxCardView,
  DxColumn, DxCardCover, DxPager, DxSearchPanel, DxSelection,
} from 'devextreme-vue/card-view';
import type { Employee } from './data.ts';
import { employees } from './data.ts';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }: Employee): string => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }: Employee): string => `${FullName} picture`;

// TODO: Nested component does not exist
const headerFilterConfig = {
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
