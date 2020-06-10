<template>
  <DxPieChart
    id="pie"
    :data-source="olympicMedals"
    type="doughnut"
    title="Olympic Medals in 2008"
    palette="Soft Pastel"
    @point-click="pointClickHandler"
  >
    <DxSeries
      argument-field="country"
      value-field="medals"
    >
      <DxHoverStyle color="#ffd700"/>
    </DxSeries>
    <DxExport :enabled="true"/>
    <DxLegend
      :margin="0"
      horizontal-alignment="right"
      vertical-alignment="top"
    />
  </DxPieChart>
</template>
<script>
import DxPieChart, {
  DxLegend,
  DxSeries,
  DxExport,
  DxHoverStyle
} from 'devextreme-vue/pie-chart';

import { olympicMedals } from './data.js';

export default {
  components: {
    DxPieChart,
    DxLegend,
    DxSeries,
    DxExport,
    DxHoverStyle
  },
  data() {
    return {
      olympicMedals
    };
  },
  methods: {
    pointClickHandler({ target }) {
      target.select();
    }
  }
};
</script>
<style>
#pie {
  height: 440px;
}
</style>
