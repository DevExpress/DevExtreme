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
<script>

import DxPieChart, {
  DxLegend,
  DxSeries,
  DxTooltip,
  DxFormat,
  DxLabel,
  DxConnector,
  DxExport
} from 'devextreme-vue/pie-chart';

import { populationByRegions } from './data.js';

export default {
  components: {
    DxPieChart,
    DxLegend,
    DxSeries,
    DxTooltip,
    DxFormat,
    DxLabel,
    DxConnector,
    DxExport
  },
  data() {
    return {
      populationByRegions
    };
  },
  methods: {
    customizeTooltip({ valueText, percent }) {
      return {
        text: `${valueText} - ${(percent * 100).toFixed(2)}%`
      };
    }
  }
};
</script>
<style>
#pie {
    height: 440px;
}
</style>
