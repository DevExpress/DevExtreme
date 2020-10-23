<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    palette="Harmony Light"
    title="Pizza Shop Complaints"
  >
    <DxCommonSeriesSettings argument-field="complaint"/>
    <DxSeries
      name="Complaint frequency"
      value-field="count"
      axis="frequency"
      type="bar"
      color="#fac29a"
    />
    <DxSeries
      name="Cumulative percentage"
      value-field="cumulativePercentage"
      axis="percentage"
      type="spline"
      color="#6b71c3"
    />

    <DxArgumentAxis>
      <DxLabel overlapping-behavior="stagger"/>
    </DxArgumentAxis>

    <DxValueAxis
      :tick-interval="300"
      name="frequency"
      position="left"
    />
    <DxValueAxis
      :tick-interval="20"
      :show-zero="true"
      :value-margins-enabled="false"
      name="percentage"
      position="right"
    >
      <DxLabel :customize-text="customizePercentageText"/>
      <DxConstantLine
        :value="80"
        :width="2"
        color="#fc3535"
        dash-style="dash"
      >
        <DxLabel :visible="false"/>
      </DxConstantLine>
    </DxValueAxis>

    <DxTooltip
      :enabled="true"
      :shared="true"
      :customize-tooltip="customizeTooltip"
    />

    <DxLegend
      vertical-alignment="top"
      horizontal-alignment="center"
    />
  </DxChart>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxCommonSeriesSettings,
  DxLabel,
  DxLegend,
  DxSeries,
  DxTooltip,
  DxValueAxis,
  DxConstantLine
} from 'devextreme-vue/chart';

import { complaintsData } from './data.js';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxLabel,
    DxLegend,
    DxSeries,
    DxTooltip,
    DxValueAxis,
    DxConstantLine
  },

  data() {
    let data = complaintsData.sort(function(a, b) {
        return b.count - a.count;
      }),
      totalCount = data.reduce(function(prevValue, item) {
        return prevValue + item.count;
      }, 0),
      cumulativeCount = 0;

    const dataSource = data.map(function(item) {
      cumulativeCount += item.count;
      return {
        complaint: item.complaint,
        count: item.count,
        cumulativePercentage: Math.round(cumulativeCount * 100 / totalCount)
      };
    });

    return {
      dataSource
    };
  },

  methods: {
    customizeTooltip(pointInfo) {
      return {
        html: `<div><div class='tooltip-header'>${
          pointInfo.argumentText
        }</div><div class='tooltip-body'><div class='series-name'><span class='top-series-name'>${
          pointInfo.points[0].seriesName
        }</span>: </div><div class='value-text'><span class='top-series-value'>${
          pointInfo.points[0].valueText
        }</span></div><div class='series-name'><span class='bottom-series-name'>${
          pointInfo.points[1].seriesName
        }</span>: </div><div class='value-text'><span class='bottom-series-value'>${
          pointInfo.points[1].valueText
        }</span>% </div></div></div>`
      };
    },

    customizePercentageText({ valueText }) {
      return `${valueText}%`;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}

.tooltip-header {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 5px;
    border-bottom: 1px solid #c5c5c5;
}

.tooltip-body {
    width: 170px;
}

.tooltip-body .series-name {
    font-weight: normal;
    opacity: 0.6;
    display: inline-block;
    line-height: 1.5;
    padding-right: 10px;
    width: 126px;
}

.tooltip-body .value-text {
    display: inline-block;
    line-height: 1.5;
    width: 30px;
}
</style>
