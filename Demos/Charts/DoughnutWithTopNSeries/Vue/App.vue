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
<script>

import DxPieChart, {
  DxSmallValuesGrouping,
  DxLegend,
  DxSeries,
  DxFormat,
  DxLabel,
  DxConnector,
  DxExport
} from 'devextreme-vue/pie-chart';

import { internetLanguages } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSmallValuesGrouping,
    DxLegend,
    DxSeries,
    DxFormat,
    DxLabel,
    DxConnector,
    DxExport
  },
  data() {
    return {
      internetLanguages
    };
  },
  methods: {
    customizeLabel(pointInfo) {
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
