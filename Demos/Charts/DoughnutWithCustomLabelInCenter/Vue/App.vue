<template>
  <div>
    <div class="long-title"><h3>Energy Production (GWh, 2016)</h3></div>
    <div class="pies-container">
      <DxPieChart
        v-for="country in countries"
        id="pie-chart"
        :key="country"
        :data-source="getData(country)"
        :inner-radius="0.65"
        resolve-label-overlapping="shift"
        size-group="piesGroup"
        type="doughnut"
        center-template="centerTemplate"
      >
        <DxSeries
          argument-field="commodity"
          value-field="total"
        >
          <DxLabel
            :visible="true"
            :customize-text="customizeLabel"
            background-color="none"
            format="fixedPoint"
          >
            <DxConnector :visible="true"/>
          </DxLabel>
        </DxSeries>
        <DxLegend :visible="false"/>
        <template #centerTemplate="data">
          <CenterTemplate :pie-chart="data.data"/>
        </template>
      </DxPieChart>
    </div>
  </div>
</template>
<script>
import { data } from './data.js';
import { DxPieChart, DxSeries, DxExport, DxTooltip, DxLegend, DxLabel, DxConnector } from 'devextreme-vue/pie-chart';
import CenterTemplate from './CenterTemplate.vue';

export default {
  components: {
    DxPieChart, DxSeries, DxExport, DxTooltip, DxLegend, DxLabel, DxConnector, CenterTemplate
  },
  data() {
    return {
      data: data,
      countries: Array.from(new Set(data.map(item => item.country)))
    };
  },
  methods: {
    customizeLabel({ argumentText, valueText }) {
      return `${argumentText}\n${valueText}`;
    },
    getData(country) {
      return data.filter(i => i.country === country);
    }
  }
};
</script>
<style scoped>
.pies-container {
    margin: auto;
    width: 800px;
}

.pies-container > div {
    width: 400px;
    float: left;
    margin-top: -50px;
}

.long-title h3 {
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
