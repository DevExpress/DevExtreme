<template>
  <div id="chart-demo">
    <DxChart
      id="chart"
      :data-source="population"
      title="Population by Countries"
    >
      <DxSeries argument-field="country"/>
      <DxArgumentAxis>
        <DxLabel
          :overlapping-behavior="currentMode"
          word-wrap="none"
        />
      </DxArgumentAxis>
      <DxLegend :visible="false"/>
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Overlapping Modes:</span>
        <DxSelectBox
          :data-source="overlappingModes"
          v-model:value="currentMode"
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
  DxLegend,
  DxLabel
} from 'devextreme-vue/chart';
import DxSelectBox from 'devextreme-vue/select-box';

import { overlappingModes, population } from './data.js';

export default {

  components: {
    DxSelectBox,
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxLegend,
    DxLabel
  },

  data() {
    return {
      population,
      overlappingModes,
      currentMode: overlappingModes[0]
    };
  }
};
</script>
<style>
#chart {
    height: 330px;
    max-width: 900px;
    margin: auto;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    font-weight: 500;
    font-size: 18px;
}

.option {
    margin-top: 10px;
}

.option > span {
    position: relative;
    top: 2px;
    margin-right: 14px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
