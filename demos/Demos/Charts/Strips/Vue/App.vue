<template>
  <DxChart
    id="chart"
    :customize-point="customizePoint"
    :customize-label="customizeLabel"
    :data-source="dataSource"
    title="Temperature in September"
  >
    <DxSeries
      argument-field="day"
      value-field="temperature"
      type="spline"
      color="#a3aaaa"
    />
    <DxValueAxis>
      <DxLabel :customize-text="customizeText"/>
      <DxStrip
        :start-value="highAverage"
        color="rgba(255,155,85,0.15)"
      >
        <DxLabel text="Above average">
          <DxFont :color="highAverageColor"/>
        </DxLabel>
      </DxStrip>
      <DxStrip
        :end-value="lowAverage"
        color="rgba(97,153,230,0.10)"
      >
        <DxLabel text="Below average">
          <DxFont :color="lowAverageColor"/>
        </DxLabel>
      </DxStrip>
      <DxStripStyle>
        <DxLabel>
          <DxFont
            :weight="500"
            :size="14"
          />
        </DxLabel>
      </DxStripStyle>
    </DxValueAxis>
    <DxLegend :visible="false"/>
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxChart,
  DxSeries,
  DxStrip,
  DxStripStyle,
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxExport,
  DxFont,
} from 'devextreme-vue/chart';
import { temperaturesData, highAverage, lowAverage } from './data.ts';

const highAverageColor = ref('#ff9b52');
const lowAverageColor = ref('#6199e6');
const dataSource = temperaturesData;

const customizePoint = ({ value }) => {
  if (value > highAverage) {
    return { color: highAverageColor.value };
  }

  return (value < lowAverage) ? { color: lowAverageColor.value } : null;
};
const customizeLabel = ({ value }) => {
  if (value > highAverage) {
    return getLabelsSettings(highAverageColor.value);
  }
  return (value < lowAverage) ? getLabelsSettings(lowAverageColor.value) : null;
};
const getLabelsSettings = (backgroundColor) => ({
  visible: true,
  backgroundColor,
  customizeText,
});
const customizeText = ({ valueText }) => `${valueText}&#176F`;
</script>
<style>
#chart {
  height: 440px;
}
</style>
