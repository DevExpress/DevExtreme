<template>
  <DxPieChart
    id="pie"
    :data-source="areas"
    palette="Bright"
    title="Area of Countries"
    @point-click="pointClickHandler($event)"
    @legend-click="legendClickHandler($event)"
  >
    <DxSeries
      argument-field="country"
      value-field="area"
    >
      <DxLabel :visible="true">
        <DxConnector
          :visible="true"
          :width="1"
        />
      </DxLabel>
    </DxSeries>
    <DxSize :width="500"/>
    <DxExport :enabled="true"/>
  </DxPieChart>
</template>

<script>

import DxPieChart, {
  DxSize,
  DxSeries,
  DxLabel,
  DxConnector,
  DxExport
} from 'devextreme-vue/pie-chart';

import { areas } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSize,
    DxSeries,
    DxLabel,
    DxConnector,
    DxExport
  },
  data() {
    return {
      areas
    };
  },
  methods: {
    pointClickHandler(e) {
      this.toggleVisibility(e.target);
    },
    legendClickHandler(e) {
      let arg = e.target,
        item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

      this.toggleVisibility(item);
    },
    toggleVisibility(item) {
      item.isVisible() ? item.hide() : item.show();
    }
  }
};
</script>

<style>
#pie {
    height: 440px;
}

#pie * {
    margin: 0 auto;
}
</style>
