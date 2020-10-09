<template>
  <div id="chart-demo">
    <DxChart
      id="chart"
      :data-source="sharingStatisticsInfo"
      palette="Violet"
      title="Architecture Share Over Time (Count)"
    >
      <DxCommonSeriesSettings
        :type="type"
        argument-field="year"
      />
      <DxCommonAxisSettings>
        <DxGrid :visible="true"/>
      </DxCommonAxisSettings>
      <DxSeries
        v-for="architecture in architectureSources"
        :key="architecture.value"
        :value-field="architecture.value"
        :name="architecture.name"
      />
      <DxMargin :bottom="20"/>
      <DxArgumentAxis
        :allow-decimals="false"
        :axis-division-factor="60"
      >
        <DxLabel>
          <DxFormat type="decimal"/>
        </DxLabel>
      </DxArgumentAxis>
      <DxLegend
        vertical-alignment="top"
        horizontal-alignment="right"
      />
      <DxExport :enabled="true"/>
      <DxTooltip :enabled="true"/>
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Series Type</span>
        <DxSelectBox
          :data-source="types"
          v-model:value="type"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxCommonSeriesSettings,
  DxCommonAxisSettings,
  DxGrid,
  DxExport,
  DxLegend,
  DxMargin,
  DxTooltip,
  DxLabel,
  DxFormat
} from 'devextreme-vue/chart';
import DxSelectBox from 'devextreme-vue/select-box';

import { architectureSources, sharingStatisticsInfo } from './data.js';

export default {

  components: {
    DxSelectBox,
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxCommonAxisSettings,
    DxGrid,
    DxExport,
    DxLegend,
    DxMargin,
    DxTooltip,
    DxLabel,
    DxFormat
  },

  data() {
    return {
      sharingStatisticsInfo,
      architectureSources,
      types: ['spline', 'stackedspline', 'fullstackedspline'],
      type: 'spline'
    };
  }
};
</script>
<style>
.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.option {
    margin-top: 10px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option > span {
    margin-right: 14px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
