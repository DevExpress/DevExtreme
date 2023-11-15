<template>
  <DxPieChart
    id="pie"
    :data-source="internetLanguages"
    type="doughnut"
    title="Top Internet Languages"
    palette="Soft Pastel"
  >
    <DxSeries
      argument-field="language"
      value-field="percent"
    >
      <DxSmallValuesGrouping
        :top-count="3"
        mode="topN"
      />
      <DxLabel
        :visible="true"
        :customize-text="customizeLabel"
        format="fixedPoint"
      >
        <DxConnector
          :visible="true"
          :width="1"
        />
      </DxLabel>
    </DxSeries>
    <DxExport :enabled="true"/>
    <DxLegend
      horizontal-alignment="center"
      vertical-alignment="bottom"
    />
  </DxPieChart>
</template>
<script setup lang="ts">
import DxPieChart, {
  DxSmallValuesGrouping,
  DxLegend,
  DxSeries,
  DxLabel,
  DxConnector,
  DxExport,
} from 'devextreme-vue/pie-chart';
import { internetLanguages } from './data.js';

const customizeLabel = ({ argumentText, valueText }) => `${argumentText}: ${valueText}%`;
</script>
<style>
#pie {
  height: 440px;
}
</style>
