<template>
  <DxPieChart
    id="pie"
    :data-source="dataSource"
    palette="Bright"
    title="Olympic Medals in 2008"
  >
    <DxSeries
      argument-field="country"
      value-field="medals"
    >
      <DxLabel
        :visible="true"
        :customize-text="formatLabel"
        position="columns"
      >
        <DxConnector
          :visible="true"
          :width="0.5"
        />
        <DxFont :size="16"/>
      </DxLabel>
    </DxSeries>
    <DxLegend
      :column-count="4"
      orientation="horizontal"
      item-text-position="right"
      horizontal-alignment="center"
      vertical-alignment="bottom"
    />
    <DxExport :enabled="true"/>
  </DxPieChart>
</template>

<script>

import DxPieChart, {
  DxSeries,
  DxLegend,
  DxLabel,
  DxConnector,
  DxFont,
  DxExport
} from 'devextreme-vue/pie-chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSeries,
    DxLegend,
    DxLabel,
    DxConnector,
    DxFont,
    DxExport
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    formatLabel(pointInfo) {
      return `${pointInfo.valueText} (${pointInfo.percentText})`;
    }
  }
};
</script>

<style>
#pie {
    height: 440px;
}
</style>
