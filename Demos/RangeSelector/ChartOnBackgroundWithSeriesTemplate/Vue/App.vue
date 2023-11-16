<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    title="Select a Year Period"
  >
    <DxMargin :top="50"/>
    <DxChart>
      <DxCommonSeriesSettings
        argument-field="year"
        value-field="oil"
        type="spline"
      />
      <DxSeriesTemplate
        :customize-series="customizeSeries"
        name-field="country"
      />
    </DxChart>
    <DxScale>
      <DxLabel>
        <DxFormat type="decimal"/>
      </DxLabel>
    </DxScale>
  </DxRangeSelector>
</template>
<script setup lang="ts">
import {
  DxRangeSelector,
  DxMargin,
  DxChart,
  DxCommonSeriesSettings,
  DxSeriesTemplate,
  DxScale,
  DxFormat,
  DxLabel,
} from 'devextreme-vue/range-selector';
import { dataSource } from './data.js';

const customizeSeries = (seriesName: string) => (seriesName === 'USA' ? { color: 'red' } : {});
</script>
<style scoped>
#range-selector {
  height: 310px;
}
</style>
