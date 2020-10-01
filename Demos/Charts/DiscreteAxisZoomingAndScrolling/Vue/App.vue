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
        <DxBehavior call-value-changed="onMoving"/>
      </DxRangeSelector>
    </div>
  </div>
</template>
<script>
import { dataSource } from './data.js';
import {
  DxChart,
  DxValueAxis,
  DxArgumentAxis,
  DxLabel,
  DxLegend,
  DxBorder,
  DxCommonSeriesSettings,
  DxSeries
} from 'devextreme-vue/chart';
import {
  DxRangeSelector,
  DxSize,
  DxMargin,
  DxScale,
  DxChart as DxRsChart,
  DxBehavior,
  DxCommonSeriesSettings as DxCommonSeriesSettingsOptions,
  DxSeries as DxRsChartSeries
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxChart,
    DxValueAxis,
    DxArgumentAxis,
    DxLabel,
    DxLegend,
    DxBorder,
    DxRangeSelector,
    DxSize,
    DxMargin,
    DxScale,
    DxRsChart,
    DxBehavior,
    DxCommonSeriesSettings,
    DxCommonSeriesSettingsOptions,
    DxSeries,
    DxRsChartSeries
  },
  data() {
    return {
      dataSource,
      range: [],
      series: [{
        name: 'Si',
        valueField: 'Si'
      }, {
        name: 'Fe',
        valueField: 'Fe'
      }, {
        name: 'Ni',
        valueField: 'Ni'
      }, {
        name: 'S',
        valueField: 'S'
      }, {
        name: 'O',
        valueField: 'O'
      }, {
        name: 'Mg',
        valueField: 'Mg'
      }, {
        name: 'Al',
        valueField: 'Al'
      }, {
        name: 'K',
        valueField: 'K'
      }, {
        name: 'Na',
        valueField: 'Na'
      }]
    };
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText}%`;
    }
  }
};
</script>
<style scoped>
#zoomedChart {
  margin-bottom: 20px;
}
</style>
