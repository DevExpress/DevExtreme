<template>
  <DxChart
    id="chart"
    :data-source="countriesInfo"
  >
    <DxCommonSeriesSettings
      type="spline"
      argument-field="country"
    >
      <DxPoint hover-mode="allArgumentPoints"/>
    </DxCommonSeriesSettings>
    <DxSeries
      v-for="source in energySources"
      :key="source.value"
      :value-field="source.value"
      :name="source.name"
    />
    <DxArgumentAxis
      :value-margins-enabled="false"
      discrete-axis-division-mode="crossLabels"
    >
      <DxGrid :visible="true"/>
    </DxArgumentAxis>
    <DxCrosshair
      :enabled="true"
      :width="3"
      color="#949494"
      dash-style="dot"
    >
      <DxLabel
        :visible="true"
        background-color="#949494"
      >
        <DxFont
          :size="12"
          color="#fff"
        />
      </DxLabel>
    </DxCrosshair>
    <DxLegend
      :equal-column-width="true"
      vertical-alignment="bottom"
      horizontal-alignment="center"
      item-text-position="bottom"
    />
    <DxTitle text="Energy Consumption in 2004">
      <DxSubtitle text="(Millions of Tons, Oil Equivalent)"/>
    </DxTitle>
    <DxExport :enabled="true"/>
    <DxTooltip :enabled="true"/>
  </DxChart>
</template>
<script>

import {
  DxChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxArgumentAxis,
  DxGrid,
  DxCrosshair,
  DxExport,
  DxLegend,
  DxPoint,
  DxLabel,
  DxFont,
  DxTitle,
  DxSubtitle,
  DxTooltip
} from 'devextreme-vue/chart';
import { energySources, countriesInfo } from './data.js';

export default {

  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxArgumentAxis,
    DxGrid,
    DxCrosshair,
    DxExport,
    DxLegend,
    DxPoint,
    DxLabel,
    DxFont,
    DxTitle,
    DxSubtitle,
    DxTooltip
  },

  data() {
    return {
      countriesInfo,
      energySources
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
