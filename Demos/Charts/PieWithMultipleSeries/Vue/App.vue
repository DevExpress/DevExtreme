<template>
  <DxPieChart
    id="pie"
    :data-source="exportImportData"
    :inner-radius="0.2"
    type="doughnut"
    palette="Ocean"
  >
    <DxTitle text="Imports/Exports of Goods and Services">
      <DxSubtitle text="(billion US$, 2012)"/>
    </DxTitle>
    <DxLegend :visible="true"/>
    <DxExport :enabled="true"/>
    <DxCommonSeriesSettings>
      <DxLabel :visible="false"/>
    </DxCommonSeriesSettings>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
      format="currency"
    />
    <DxSeries
      name="Export"
      argument-field="Country"
      value-field="Export"
    />
    <DxSeries
      name="Import"
      argument-field="Country"
      value-field="Import"
    />
  </DxPieChart>
</template>
<script>
import DxPieChart, {
  DxCommonSeriesSettings,
  DxLegend,
  DxSeries,
  DxExport,
  DxLabel,
  DxTitle,
  DxTooltip,
  DxSubtitle
} from 'devextreme-vue/pie-chart';

import { exportImportData } from './data.js';

export default {
  components: {
    DxPieChart,
    DxCommonSeriesSettings,
    DxLegend,
    DxSeries,
    DxExport,
    DxLabel,
    DxTitle,
    DxTooltip,
    DxSubtitle
  },
  data() {
    return {
      exportImportData
    };
  },
  methods: {
    customizeTooltip(pointInfo) {
      return {
        text:
          `${pointInfo.argumentText
          }<br>${
            pointInfo.seriesName
          }: ${
            pointInfo.valueText
          }B`
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
