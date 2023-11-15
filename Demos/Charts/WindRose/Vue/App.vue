<template>
  <div id="chart-demo">
    <DxPolarChart
      id="radarChart"
      :data-source="periodValues"
      palette="Soft"
      title="Wind Rose, Philadelphia PA"
      @legend-click="onLegendClick"
    >
      <DxCommonSeriesSettings type="stackedbar"/>
      <DxSeries
        v-for="wind in windSources"
        :key="wind.value"
        :value-field="wind.value"
        :name="wind.name"
      />
      <DxMargin
        :bottom="50"
        :left="100"
      />
      <DxArgumentAxis
        :first-point-on-start-angle="true"
        discrete-axis-division-mode="crossLabels"
      />
      <DxValueAxis :value-margins-enabled="false"/>
      <DxExport :enabled="true"/>
    </DxPolarChart>
    <div class="center">
      <DxSelectBox
        :width="300"
        :data-source="windRoseData"
        :input-attr="{ 'aria-label': 'Period' }"
        v-model:value="selectedPeriod"
        display-expr="period"
        value-expr="period"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  DxPolarChart,
  DxPolarChartTypes,
  DxCommonSeriesSettings,
  DxSeries,
  DxArgumentAxis,
  DxValueAxis,
  DxMargin,
  DxExport,
} from 'devextreme-vue/polar-chart';
import DxSelectBox from 'devextreme-vue/select-box';
import { windSources, windRoseData } from './data.js';

const selectedPeriod = ref(windRoseData[0].period);
const periodValues = computed(
  () => windRoseData.find(({ period }) => period === selectedPeriod.value).values,
);

function onLegendClick({ target }: DxPolarChartTypes.LegendClickEvent) {
  target.isVisible()
    ? target.hide()
    : target.show();
}
</script>
<style>
#chart-demo {
  height: 600px;
}

#radarChart {
  height: 500px;
}

#chart-demo > .center {
  text-align: center;
}

#chart-demo > .center > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}
</style>
