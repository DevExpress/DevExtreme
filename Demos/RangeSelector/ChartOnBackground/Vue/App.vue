<template>
  <DxRangeSelector
    id="range-selector"
    :data-source="dataSource"
    v-model:value="range"
    title="Select a Range in the Costs and Revenues History"
  >
    <DxMargin :top="50"/>
    <DxScale>
      <DxMinorTickInterval :days="1"/>
      <DxTickInterval :days="7"/>
    </DxScale>
    <DxChart>
      <DxSeries
        argument-field="t"
        value-field="costs"
      />
      <DxSeries
        argument-field="t"
        value-field="income"
      />
      <DxValueAxis :min="0"/>
    </DxChart>
  </DxRangeSelector>
</template>
<script>
import { dataSource } from './data.js';
import {
  DxRangeSelector,
  DxMargin,
  DxScale,
  DxTickInterval,
  DxMinorTickInterval,
  DxChart,
  DxSeries,
  DxValueAxis
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxMargin,
    DxScale,
    DxTickInterval,
    DxMinorTickInterval,
    DxChart,
    DxSeries,
    DxValueAxis
  },
  data() {
    return {
      dataSource,
      range: [new Date(2011, 11, 25), new Date(2012, 0, 1)]
    };
  }
};
</script>
<style scoped>
#range-selector {
  height: 310px;
}
</style>
