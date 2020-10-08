<template>
  <div id="chart-demo">
    <DxChart
      :data-source="dataSource"
      palette="Harmony Light"
      title="Population: Age Structure (2000)"
    >
      <DxCommonSeriesSettings
        :type="type"
        argument-field="country"
      />
      <DxSeries
        value-field="y1564"
        name="15-64 years"
      />
      <DxSeries
        value-field="y014"
        name="0-14 years"
      />
      <DxSeries
        value-field="y65"
        name="65 years and older"
      />
      <DxMargin :bottom="20"/>
      <DxArgumentAxis :value-margins-enabled="false"/>
      <DxLegend
        vertical-alignment="bottom"
        horizontal-alignment="center"
      />
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
  DxExport,
  DxLegend,
  DxMargin
} from 'devextreme-vue/chart';

import DxSelectBox from 'devextreme-vue/select-box';

import { dataSource } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxExport,
    DxLegend,
    DxMargin
  },
  data() {
    const types = ['area', 'stackedarea', 'fullstackedarea'];

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
