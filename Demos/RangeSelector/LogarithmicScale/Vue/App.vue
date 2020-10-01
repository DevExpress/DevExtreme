<template>
  <div>
    <DxChart
      id="zoomed-chart"
      :data-source="dataSource"
      :resize-panes-on-zoom="true"
    >
      <DxSeries/>
      <DxArgumentAxis
        :value-margins-enabled="false"
        :minor-tick-count="10"
        :visual-range="range"
        type="logarithmic"
      >
        <DxLabel format="exponential"/>
        <DxGrid :visible="true"/>
        <DxMinorGrid :visible="true"/>
      </DxArgumentAxis>
      <DxLegend :visible="false"/>
    </DxChart>
    <DxRangeSelector
      id="range-selector"
      :data-source="dataSource"
      v-model:value="range"
    >
      <DxRsChart>
        <DxRsSeries/>
      </DxRsChart>
      <DxScale
        :min-range="1"
        :minor-tick-count="10"
        type="logarithmic"
      >
        <DxRsLabel format="exponential"/>
      </DxScale>
      <DxSliderMarker format="exponential"/>
      <DxBehavior
        :snap-to-ticks="false"
        call-value-changed="onMoving"
      />
    </DxRangeSelector>
  </div>
</template>
<script>
import { dataSource } from './data.js';
import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxGrid,
  DxMinorGrid,
  DxLegend,
  DxLabel
} from 'devextreme-vue/chart';
import {
  DxRangeSelector,
  DxScale,
  DxSliderMarker,
  DxBehavior,
  DxLabel as DxRsLabel,
  DxChart as DxRsChart,
  DxSeries as DxRsSeries
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxGrid,
    DxMinorGrid,
    DxLegend,
    DxLabel,
    DxRangeSelector,
    DxScale,
    DxSliderMarker,
    DxBehavior,
    DxRsLabel,
    DxRsChart,
    DxRsSeries
  },
  data() {
    return {
      dataSource,
      range: []
    };
  }
};
</script>
<style scoped>
#zoomed-chart{
    height: 335px;
    margin: 0 0 15px;
}

#range-selector {
    height: 120px;
}
</style>
