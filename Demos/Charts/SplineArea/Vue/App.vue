<template>
  <div id="chart-demo">
    <DxChart
      :data-source="dataSource"
      palette="Harmony Light"
      title="Corporations with Highest Market Value"
    >
      <DxCommonSeriesSettings
        :type="type"
        argument-field="company"
      />
      <DxSeries
        value-field="y2005"
        name="2005"
      />
      <DxSeries
        value-field="y2004"
        name="2004"
      />
      <DxArgumentAxis :value-margins-enabled="false"/>
      <DxLegend
        vertical-alignment="bottom"
        horizontal-alignment="center"
      />
      <DxMargin :bottom="20"/>
      <DxExport :enabled="true"/>
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Series Type </span>
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
  DxMargin,
  DxExport,
  DxLegend
} from 'devextreme-vue/chart';

import DxSelectBox from 'devextreme-vue/select-box';
import { dataSource } from './data.js';

const types = ['splinearea', 'stackedsplinearea', 'fullstackedsplinearea'];

export default {
  components: {
    DxSelectBox,
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxMargin,
    DxExport,
    DxLegend
  },
  data() {
    return {
      dataSource: dataSource,
      types,
      type: types[0]
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
    margin-right: 10px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
