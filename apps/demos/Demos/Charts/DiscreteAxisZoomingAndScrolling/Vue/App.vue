<template>
  <div>
    <div id="chart-demo">
      <DxChart
        id="zoomedChart"
        :data-source="dataSource"
        palette="Soft"
        title="The Chemical Composition of the Earth Layers"
      >
        <DxSeries
          v-for="item in series"
          :value-field="item.valueField"
          :name="item.name"
          :key="item.name"
        />
        <DxCommonSeriesSettings
          :ignore-empty-points="true"
          type="bar"
        />
        <DxValueAxis>
          <DxLabel :customize-text="customizeText"/>
        </DxValueAxis>
        <DxArgumentAxis :visual-range="range"/>
        <DxLegend
          :visible="true"
          vertical-alignment="top"
          horizontal-alignment="right"
          orientation="horizontal"
        >
          <DxBorder :visible="true"/>
        </DxLegend>
      </DxChart>
      <DxRangeSelector
        :data-source="dataSource"
        v-model:value="range"
      >
        <DxSize :height="120"/>
        <DxMargin :left="10"/>
        <DxScale :minor-tick-count="1"/>
        <DxRsChart
          palette="Soft"
        >
          <DxRsChartSeries
            v-for="item in series"
            :value-field="item.valueField"
            :name="item.name"
            :key="item.name"
          />
          <DxCommonSeriesSettingsOptions
            :ignore-empty-points="true"
            type="bar"
          />
        </DxRsChart>
        <DxBehavior value-change-mode="onHandleMove"/>
      </DxRangeSelector>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxChart,
  DxValueAxis,
  DxArgumentAxis,
  DxLabel,
  DxLegend,
  DxBorder,
  DxCommonSeriesSettings,
  DxSeries,
} from 'devextreme-vue/chart';
import {
  DxRangeSelector,
  DxSize,
  DxMargin,
  DxScale,
  DxChart as DxRsChart,
  DxBehavior,
  DxCommonSeriesSettings as DxCommonSeriesSettingsOptions,
  DxSeries as DxRsChartSeries,
} from 'devextreme-vue/range-selector';
import { dataSource } from './data.ts';

const range = ref([]);
const series = [{
  name: 'Si',
  valueField: 'Si',
}, {
  name: 'Fe',
  valueField: 'Fe',
}, {
  name: 'Ni',
  valueField: 'Ni',
}, {
  name: 'S',
  valueField: 'S',
}, {
  name: 'O',
  valueField: 'O',
}, {
  name: 'Mg',
  valueField: 'Mg',
}, {
  name: 'Al',
  valueField: 'Al',
}, {
  name: 'K',
  valueField: 'K',
}, {
  name: 'Na',
  valueField: 'Na',
}];

const customizeText = ({ valueText }) => `${valueText}%`;
</script>
<style scoped>
#zoomedChart {
  margin-bottom: 20px;
}
</style>
