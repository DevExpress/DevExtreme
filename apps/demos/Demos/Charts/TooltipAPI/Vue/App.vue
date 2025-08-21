
<template>
  <div>
    <DxPieChart
      ref="pieChart"
      :data-source="populationData"
      type="doughnut"
      palette="Soft Pastel"
      title="The Population of Continents and Regions"
      @point-click="onPointClick"
    >
      <DxSeries argument-field="region"/>
      <DxSize :height="350"/>
      <DxTooltip
        :enabled="false"
        :customize-tooltip="customizeTooltip"
        format="millions"
      />
      <DxLegend :visible="false"/>
    </DxPieChart>
    <div class="controls-pane">
      <DxSelectBox
        :width="250"
        :data-source="populationData"
        :input-attr="{ 'aria-label': 'Region' }"
        :value="selectedRegion"
        display-expr="region"
        value-expr="region"
        placeholder="Choose region"
        @value-changed="onRegionChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxPieChart, {
  DxSeries,
  DxTooltip,
  DxSize,
  DxLegend,
  type DxPieChartTypes,
} from 'devextreme-vue/pie-chart';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { populationData } from './data.ts';

const selectedRegion = ref(null);
const pieChart = ref();

const customizeTooltip = ({ argumentText, valueText }: any) => ({
  text: `${argumentText}<br/>${valueText}`,
});

function onPointClick({ target: point }: DxPieChartTypes.PointClickEvent & { target: { argument: string }}) {
  point.showTooltip();
  selectedRegion.value = point.argument;
}

function onRegionChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
  pieChart.value.instance
    .getAllSeries()[0]
    .getPointsByArg(value)[0]
    .showTooltip();
}
</script>
<style>
.controls-pane {
  margin-top: 20px;
  text-align: center;
}

.dx-selectbox {
  display: inline-block;
}
</style>

