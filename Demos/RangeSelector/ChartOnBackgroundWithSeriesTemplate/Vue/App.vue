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
<script>
import { dataSource } from './data.js';
import {
  DxRangeSelector,
  DxMargin,
  DxChart,
  DxCommonSeriesSettings,
  DxSeriesTemplate,
  DxScale,
  DxFormat,
  DxLabel
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxChart,
    DxCommonSeriesSettings,
    DxSeriesTemplate,
    DxScale,
    DxFormat,
    DxLabel
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    customizeSeries(seriesName) {
      return seriesName === 'USA' ? { color: 'red' } : {};
    }
  }
};
</script>
<style scoped>
#range-selector {
    height: 310px;
}
</style>
