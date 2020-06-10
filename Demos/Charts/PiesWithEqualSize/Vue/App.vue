<template>
  <div class="pies-container">
    <DxPieChart
      v-for="(options, index) in pieCharts"
      :key="index"
      :data-source="options.dataSource"
      :title="options.title"
      :palette="options.palette"
      class="pie"
      size-group="piesGroup"
    >
      <DxSeries
        argument-field="name"
        value-field="area"
      >
        <DxLabel
          :visible="true"
          format="percent"
        />
      </DxSeries>
      <DxLegend
        :row-count="2"
        vertical-alignment="bottom"
        horizontal-alignment="center"
        item-text-position="right"
      />
    </DxPieChart>
  </div>
</template>

<script>

import DxPieChart, {
  DxSeries,
  DxLabel,
  DxLegend
} from 'devextreme-vue/pie-chart';

import { countries, waterLandRatio } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSeries,
    DxLabel,
    DxLegend
  },
  data() {
    return {
      pieCharts: [{
        title: 'Area of Countries',
        palette: 'Soft',
        dataSource: countries
      }, {
        title: 'Water/Land Ratio',
        palette: 'Soft Pastel',
        dataSource: waterLandRatio
      }]
    };
  }
};
</script>

<style>
.pies-container {
    margin: auto;
    width: 800px;
}

.pies-container > .pie {
    width: 400px;
    float: left;
}
</style>
