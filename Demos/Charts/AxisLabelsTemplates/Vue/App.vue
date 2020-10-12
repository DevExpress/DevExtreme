<template>
  <DxChart
    id="chart"
    title="Ice Hockey World Championship Gold Medal Winners"
    :data-source="dataSource"
  >
    <DxCommonSeriesSettings
      type="bar"
      argument-field="country"
    >
      <Label :visible="true"/>
    </DxCommonSeriesSettings>
    <DxSeries
      name="Gold"
      value-field="gold"
      color="#ffd700"
    />
    <DxSeries
      name="Silver"
      value-field="silver"
      color="#c0c0c0"
    />
    <DxSeries
      name="Bronze"
      value-field="bronze"
      color="#cd7f32"
    />
    <DxArgumentAxis>
      <DxLabel template="labelTemplate"/>
    </DxArgumentAxis>
    <template #labelTemplate="{ data }">
      <LabelTemplate :data="data"/>
    </template>
  </DxChart>
</template>
<script>
import { DxChart, DxSeries, DxCommonSeriesSettings, DxLabel, DxArgumentAxis } from 'devextreme-vue/chart';
import { dataSource } from './data.js';
import LabelTemplate from './LabelTemplate.vue';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxArgumentAxis,
    LabelTemplate
  },
  data() {
    return {
      dataSource
    };
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
