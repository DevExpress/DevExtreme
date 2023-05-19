
<template>
  <div>
    <DxPieChart
      ref="pieChart"
      :data-source="populationData"
      type="doughnut"
      palette="Soft Pastel"
      title="The Population of Continents and Regions"
      @point-click="onPointClick"
    >
      <DxSeries argument-field="region"/>
      <DxSize :height="350"/>
      <DxTooltip
        :enabled="false"
        :customize-tooltip="customizeTooltip"
        format="millions"
      />
      <DxLegend :visible="false"/>
    </DxPieChart>
    <div class="controls-pane">
      <DxSelectBox
        :width="250"
        :data-source="populationData"
        :input-attr="{ 'aria-label': 'Region' }"
        :value="selectedRegion"
        display-expr="region"
        value-expr="region"
        placeholder="Choose region"
        @value-changed="onRegionChanged"
      />
    </div>
  </div>
</template>

<script>
import DxPieChart, {
  DxSeries,
  DxTooltip,
  DxSize,
  DxLegend,
} from 'devextreme-vue/pie-chart';
import DxSelectBox from 'devextreme-vue/select-box';
import { populationData } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxPieChart,
    DxSeries,
    DxTooltip,
    DxSize,
    DxLegend,
  },

  data() {
    return {
      selectedRegion: null,
      populationData,
    };
  },

  methods: {
    onPointClick({ target: point }) {
      point.showTooltip();
      this.selectedRegion = point.argument;
    },

    onRegionChanged({ value }) {
      const pieChartInstance = this.$refs.pieChart.instance;
      const point = pieChartInstance.getAllSeries()[0].getPointsByArg(value)[0];
      point.showTooltip();
    },

    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.argumentText}<br/>${pointInfo.valueText}`,
      };
    },
  },
};
</script>
<style>
.controls-pane {
  margin-top: 20px;
  text-align: center;
}

.dx-selectbox {
  display: inline-block;
}
</style>

