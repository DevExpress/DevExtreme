<template>
  <DxPieChart
    id="pie"
    :data-source="dataSource"
    palette="Bright"
    title="Top internet languages"
  >
    <DxSeries
      argument-field="language"
      value-field="percent"
    >
      <DxLabel
        :visible="true"
        :customize-text="formatLabel"
        format="fixedPoint"
      >
        <DxConnector
          :visible="true"
          :width="0.5"
        />
      </DxLabel>
      <DxSmallValuesGrouping
        :threshold="4.5"
        mode="smallValueThreshold"
      />
    </DxSeries>
    <DxLegend
      horizontal-alignment="center"
      vertical-alignment="bottom"
    />
    <DxExport :enabled="true"/>
  </DxPieChart>
</template>

<script>

import DxPieChart, {
  DxSeries,
  DxLabel,
  DxConnector,
  DxSmallValuesGrouping,
  DxLegend,
  DxExport
} from 'devextreme-vue/pie-chart';

import { dataSource } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSeries,
    DxLabel,
    DxConnector,
    DxSmallValuesGrouping,
    DxLegend,
    DxExport
  },
  data() {
    return {
      dataSource
    };
  },
  methods: {
    formatLabel(pointInfo) {
      return `${pointInfo.argumentText}: ${pointInfo.valueText}%`;
    }
  }
};
</script>

<style>
#pie {
    height: 440px;
}
</style>
