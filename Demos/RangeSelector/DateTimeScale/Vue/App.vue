<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    v-model:value="range"
    title="Select a Month Period"
  >
    <DxMargin :top="50"/>
    <DxChart>
      <DxCommonSeriesSettings
        type="steparea"
        argument-field="date"
      />
      <DxSeries
        value-field="dayT"
        color="yellow"
      />
      <DxSeries
        value-field="nightT"
      />
    </DxChart>
    <DxScale value-type="datetime">
      <DxTickInterval :days="2"/>
      <DxMinorTickInterval :days="1"/>
    </DxScale>
    <DxSliderMarker format="day"/>
  </DxRangeSelector>
</template>
<script>
import { dataSource } from './data.js';
import {
  DxRangeSelector,
  DxMargin,
  DxChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxScale,
  DxTickInterval,
  DxMinorTickInterval,
  DxSliderMarker
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxScale,
    DxTickInterval,
    DxMinorTickInterval,
    DxSliderMarker
  },
  data() {
    return {
      dataSource,
      range: ['2013/03/01', '2013/03/07']
    };
  }
};
</script>
<style scoped>
#range-selector {
  height: 400px;
}
</style>
