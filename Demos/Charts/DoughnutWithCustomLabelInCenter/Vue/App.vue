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
<script setup lang="ts">
import {
  DxPieChart, DxSeries, DxLegend, DxLabel, DxConnector,
} from 'devextreme-vue/pie-chart';
import { data } from './data.js';
import CenterTemplate from './CenterTemplate.vue';

const countries = Array.from(new Set(data.map(({ country }) => country)));
const customizeLabel = ({ argumentText, valueText }) => `${argumentText}\n${valueText}`;
const getData = (country) => data.filter((i) => i.country === country);
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
