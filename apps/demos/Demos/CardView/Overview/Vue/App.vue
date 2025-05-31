<template>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    :allow-column-reordering="true"
    cards-per-row="auto"
    :card-min-width="250"
  >
    <DxColumn
      data-field="FullName"
      :allow-hiding="false"
    />
    <DxColumn data-field="Position"/>
    <DxColumn data-field="Department"/>
    <DxColumn data-field="Phone"/>
    <DxColumn data-field="Email"/>

    <DxHeaderFilter :visible="true" />

    <DxCardCover
      :image-expr="getEmployeeImage"
      :alt-expr="getEmployeeImageAltText"
    />
    <DxPager
      :show-info="true"
      :show-navigation-buttons="true"
      :show-page-size-selector="true"
    />
    <DxSelection mode="multiple"/>
    <DxColumnChooser
        :enabled="true"
        height="340px"
        mode="select"
      >
      <DxPosition
        my="right top"
        at="right bottom"
        of=".dx-cardview-column-chooser-button"
      />
      <DxColumnChooserSelection :select-by-click="true"/>
    </DxColumnChooser>
    <DxSearchPanel :visible="true" />
  </DxCardView>
</template>

<script setup lang="ts">
import DxCardView, {
  DxColumn, DxCardCover, DxPager, DxSelection,
  DxHeaderFilter,
  DxColumnChooser, DxPosition, DxColumnChooserSelection,
  DxSearchPanel
} from 'devextreme-vue/card-view';
import type { Employee } from './data.ts';
import { employees } from './data.ts';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }: Employee): string => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }: Employee): string => `${FullName} picture`;
</script>
