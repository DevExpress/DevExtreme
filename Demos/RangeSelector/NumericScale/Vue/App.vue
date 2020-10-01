<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    v-model:value="range"
    title="Select a Product Weight"
  >
    <DxMargin :top="50"/>
    <DxChart>
      <DxCommonSeriesSettings
        type="spline"
        argument-field="weight"
      />
      <DxSeries
        value-field="appleCost"
        color="#00ff00"
      />
      <DxSeries
        value-field="orangeCost"
        color="#ffa500"
      />
    </DxChart>
    <DxScale value-type="numeric"/>
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
  DxScale
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxScale
  },
  data() {
    return {
      dataSource: dataSource,
      range: ['1', '2']
    };
  }
};
</script>
<style scoped>
#range-selector {
  height: 400px;
}
</style>
