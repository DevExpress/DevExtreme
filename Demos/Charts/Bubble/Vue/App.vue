<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    :palette="palette"
    title="Correlation between Total Population and\n Population with Age over 60"
    @series-click="seriesClick"
  >
    <DxCommonSeriesSettings type="bubble"/>
    <DxSeries
      name="Europe"
      argument-field="total1"
      value-field="older1"
      size-field="perc1"
      tag-field="tag1"
    />
    <DxSeries
      name="Africa"
      argument-field="total2"
      value-field="older2"
      size-field="perc2"
      tag-field="tag2"
    />
    <DxSeries
      name="Asia"
      argument-field="total3"
      value-field="older3"
      size-field="perc3"
      tag-field="tag3"
    />
    <DxSeries
      name="North America"
      argument-field="total4"
      value-field="older4"
      size-field="perc4"
      tag-field="tag4"
    />
    <DxArgumentAxis title="Total Population">
      <DxLabel :customize-text="customizeText"/>
    </DxArgumentAxis>
    <DxValueAxis title="Population with Age over 60">
      <DxLabel :customize-text="customizeText"/>
    </DxValueAxis>
    <DxLegend
      :visible="true"
      position="inside"
      horizontal-alignment="left"
    >
      <DxBorder :visible="true"/>
    </DxLegend>
    <DxTooltip
      :customize-tooltip="customizeTooltip"
      :enabled="true"
      location="edge"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxPoint,
  DxLegend,
  DxValueAxis,
  DxArgumentAxis,
  DxLabel,
  DxBorder,
  DxTooltip,
  DxExport
} from 'devextreme-vue/chart';
import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxPoint,
    DxLegend,
    DxValueAxis,
    DxArgumentAxis,
    DxLabel,
    DxBorder,
    DxTooltip,
    DxExport
  },
  data() {
    return {
      dataSource,
      palette: ['#00ced1', '#008000', '#ffd700', '#ff7f50']
    };
  },
  methods: {
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.point.tag}<br/>Total Population: ${pointInfo.argumentText}M<br/>Population with Age over 60: ${pointInfo.valueText}M (${pointInfo.size}%)`
      };
    },
    seriesClick(e) {
      const series = e.target;
      if (series.isVisible()) {
        series.hide();
      } else {
        series.show();
      }
    },
    customizeText(e) {
      return `${e.value}M`;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
