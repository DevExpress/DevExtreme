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
<script>
import {
  DxChart,
  DxSeries,
  DxStrip,
  DxStripStyle,
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxExport,
  DxFont
} from 'devextreme-vue/chart';

import { temperaturesData, highAverage, lowAverage } from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxStrip,
    DxStripStyle,
    DxValueAxis,
    DxLabel,
    DxLegend,
    DxExport,
    DxFont
  },

  data() {
    return {
      highAverage,
      lowAverage,
      highAverageColor: '#ff9b52',
      lowAverageColor: '#6199e6',
      dataSource: temperaturesData,
    };
  },

  methods: {
    customizePoint(arg) {
      if (arg.value > this.highAverage) {
        return { color: this.highAverageColor };
      } else if (arg.value < this.lowAverage) {
        return { color: this.lowAverageColor };
      }
    },

    customizeLabel(arg) {
      if (arg.value > this.highAverage) {
        return this.getLabelsSettings(this.highAverageColor);
      } else if (arg.value < this.lowAverage) {
        return this.getLabelsSettings(this.lowAverageColor);
      }
    },

    getLabelsSettings(backgroundColor) {
      return {
        visible: true,
        backgroundColor: backgroundColor,
        customizeText: this.customizeText,
      };
    },

    customizeText(arg) {
      return `${arg.valueText}&#176F`;
    },
  },
};
</script>
<style>
#chart {
  height: 440px;
}
</style>
