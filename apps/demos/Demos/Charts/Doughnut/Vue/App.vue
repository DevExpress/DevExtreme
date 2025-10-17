<template>
  <DxPieChart
    id="pie"
    :data-source="populationByRegions"
    type="doughnut"
    title="The Population of Continents and Regions"
    palette="Soft Pastel"
  >
    <DxSeries argument-field="region">
      <DxLabel
        :visible="true"
        format="millions"
      >
        <DxConnector :visible="true"/>
      </DxLabel>
    </DxSeries>
    <DxExport :enabled="true"/>
    <DxLegend
      :margin="0"
      horizontal-alignment="right"
      vertical-alignment="top"
    />
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
    >
      <DxFormat
        type="millions"
      />
    </DxTooltip>
  </DxPieChart>
</template>
<script setup lang="ts">
import DxPieChart, {
  DxLegend,
  DxSeries,
  DxTooltip,
  DxFormat,
  DxLabel,
  DxConnector,
  DxExport,
  type DxPieChartTypes,
} from 'devextreme-vue/pie-chart';
import { populationByRegions } from './data.ts';

const customizeTooltip = ({ valueText, percent }: DxPieChartTypes.PointInfo) => ({
  text: `${valueText} - ${((percent || 0) * 100).toFixed(2)}%`,
});
</script>
<style>
#pie {
  height: 440px;
}
</style>
