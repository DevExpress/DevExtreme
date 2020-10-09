<template>
  <div id="chart-demo">
    <DxChart
      id="chart"
      :data-source="dataSource"
      palette="Violet"
    >
      <DxCommonSeriesSettings
        :type="type"
        argument-field="country"
      />
      <DxSeries
        v-for="energy in energySources"
        :key="energy.value"
        :value-field="energy.value"
        :name="energy.name"
      />
      <DxMargin :bottom="20"/>
      <DxArgumentAxis
        :value-margins-enabled="false"
        discrete-axis-division-mode="crossLabels"
      >
        <DxGrid :visible="true"/>
      </DxArgumentAxis>
      <DxLegend
        vertical-alignment="bottom"
        horizontal-alignment="center"
        item-text-position="bottom"
      />
      <DxExport :enabled="true"/>
      <DxTitle text="Energy Consumption in 2004">
        <DxSubtitle text="(Millions of Tons, Oil Equivalent)"/>
      </DxTitle>
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
  DxExport,
  DxGrid,
  DxMargin,
  DxLegend,
  DxTitle,
  DxSubtitle,
  DxTooltip
} from 'devextreme-vue/chart';
import DxSelectBox from 'devextreme-vue/select-box';

import service from './data.js';

export default {

  components: {
    DxSelectBox,
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxExport,
    DxGrid,
    DxMargin,
    DxLegend,
    DxTitle,
    DxSubtitle,
    DxTooltip
  },

  data() {
    return {
      dataSource: service.getCountriesInfo(),
      energySources: service.getEnergySources(),
      types: ['line', 'stackedline', 'fullstackedline'],
      type: 'line'
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
