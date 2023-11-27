
<template>
  <div>
    <DxChart
      id="chart"
      ref="chart"
      :data-source="mountains"
      title="The Highest Mountains"
    >
      <DxSeries
        type="bar"
        argument-field="name"
        value-field="height"
        color="#E55253"
      />
      <DxArgumentAxis :visible="true"/>
      <DxValueAxis>
        <DxVisualRange :start-value="8000"/>
        <DxLabel :customize-text="customizeLabelText"/>
      </DxValueAxis>
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltipText"
      />
      <DxLegend :visible="false"/>
    </DxChart>
    <div id="buttonGroup">
      <DxButton
        icon="print"
        text="Print"
        @click="printChart"
      />
      <DxButton
        icon="export"
        text="Export"
        @click="exportChart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxChart, {
  DxSeries,
  DxLegend,
  DxTooltip,
  DxArgumentAxis,
  DxLabel,
  DxValueAxis,
  DxVisualRange,
} from 'devextreme-vue/chart';
import DxButton from 'devextreme-vue/button';
import { mountains } from './data.ts';

const chart = ref();
const customizeTooltipText = ({ argumentText, point, valueText }) => ({
  text: `<span class='title'>${argumentText
  }</span><br />&nbsp;<br />System: ${point.data.system
  }<br />Height: ${valueText} m`,
});
const customizeLabelText = ({ value }) => `${value} m`;
function printChart() {
  chart.value.instance.print();
}
function exportChart() {
  chart.value.instance.exportTo('Example', 'png');
}
</script>
<style>
#chart {
  height: 440px;
  margin-bottom: 30px;
}

#buttonGroup {
  text-align: center;
  margin-bottom: 20px;
}

#buttonGroup > .dx-button {
  margin: 0 22px;
}

.title {
  font-size: 15px;
  font-weight: 500;
}
</style>

