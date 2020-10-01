<template>
  <div>
    <DxChart
      id="chart"
      :data-source="dataSource"
    >
      <DxCommonSeriesSettings type="scatter"/>
      <DxSeries
        argument-field="x1"
        value-field="y1"
      />
      <DxSeries
        argument-field="x2"
        value-field="y2"
      >
        <DxPoint symbol="triangleDown"/>
      </DxSeries>
      <DxArgumentAxis
        :visual-range="[-20, 20]"
        :custom-position="argumentPosition"
        :offset="argumentOffset"
      />
      <DxValueAxis
        :visual-range="[-20, 20]"
        :custom-position="valuePosition"
        :offset="valueOffset"
        :end-on-tick="false"
      />
      <DxLegend :visible="false"/>
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="common">
        <div class="block left">
          <span>Argument Axis</span>
          <div class="option">
            <span>Custom position:</span>
            <DxNumberBox
              v-model:value="argumentPosition"
              :show-spin-buttons="true"
            />
          </div>
          <div class="option">
            <span>Offset:</span>
            <DxNumberBox
              v-model:value="argumentOffset"
              :show-spin-buttons="true"
            />
          </div>
        </div>
        <div class="block right">
          <span>Value Axis</span>
          <div class="option">
            <span>Custom position:</span>
            <DxNumberBox
              v-model:value="valuePosition"
              :show-spin-buttons="true"
            />
          </div>
          <div class="option">
            <span>Offset:</span>
            <DxNumberBox
              v-model:value="valueOffset"
              :show-spin-buttons="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxPoint,
  DxArgumentAxis,
  DxValueAxis,
  DxLegend,
} from 'devextreme-vue/chart';
import DxNumberBox from 'devextreme-vue/number-box';

import { generateDataSource } from './data.js';

const dataSource = generateDataSource();

export default {
  components: {
    DxNumberBox,
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxPoint,
    DxArgumentAxis,
    DxValueAxis,
    DxLegend,
  },

  data() {
    return {
      dataSource,
      argumentPosition: 0,
      argumentOffset: 0,
      valuePosition: 0,
      valueOffset: 0
    };
  }
};
</script>
<style>
.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.option {
  margin-top: 10px;
  overflow: auto;
}

.option > span {
  margin-right: 20px;
  margin-top: 6px;
  float: left;
}

.caption {
  font-size: 18px;
  font-weight: 700;
}

.option > .dx-numberbox {
  width: 90px;
  float: right;
}

.common {
  width: 488px;
}

.block {
  vertical-align: middle;
  margin-top: 10px;
}

.left {
  display: inline-block;
}

.right {
  float: right;
}

.block > span {
  font-size: 18px;
  font-weight: 500;
}
</style>
