<template>
  <DxChart
    id="chart"
    :rotated="true"
    data-source="../../../../data/simpleJSON.json"
    title="Daily Sales"
  >

    <DxArgumentAxis>
      <DxLabel :customize-text="customizeLabelText"/>
    </DxArgumentAxis>

    <DxValueAxis>
      <DxTick :visible="false"/>
      <DxLabel :visible="false"/>
    </DxValueAxis>

    <DxSeries
      argument-field="day"
      value-field="sales"
      type="bar"
      color="#79cac4"
    >
      <DxLabel
        :visible="true"
        background-color="#c18e92"
      />
    </DxSeries>

    <DxLegend :visible="false"/>

    <DxExport :enabled="true"/>

  </DxChart>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxExport,
  DxSeries,
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxTick
} from 'devextreme-vue/chart';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxExport,
    DxSeries,
    DxValueAxis,
    DxLabel,
    DxLegend,
    DxTick
  },
  methods: {
    customizeLabelText({ valueText }) {
      return `Day ${valueText}`;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
