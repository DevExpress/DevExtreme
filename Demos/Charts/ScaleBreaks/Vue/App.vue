<template>
  <div>
    <DxChart
      id="chart"
      :data-source="dataSource"
      title="Relative Masses of the Heaviest\n Solar System Objects"
    >
      <DxSeries
        value-field="mass"
        argument-field="name"
        type="bar"
      />
      <DxValueAxis
        :visible="true"
        :auto-breaks-enabled="autoBreaksEnabledValue"
        :max-auto-break-count="breaksCountValue"
      >
        <DxBreakStyle :line="lineStyleValue"/>
      </DxValueAxis>
      <DxLegend :visible="false"/>
      <DxTooltip :enabled="true"/>
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <DxCheckBox
            v-model:value="autoBreaksEnabledValue"
            class="checkbox"
            text="Enable Breaks"
          />
        </div>
        <div class="option">
          <span>Max Count </span>
          <DxSelectBox
            :items="breaksCount"
            :input-attr="{ 'aria-label': 'Breaks Count' }"
            v-model:value="breaksCountValue"
            :width="80"
          />
        </div>
        <div class="option">
          <span>Style </span>
          <DxSelectBox
            :items="lineStyles"
            :input-attr="{ 'aria-label': 'Line Style' }"
            v-model:value="lineStyleValue"
            :width="120"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxChart, {
  DxLegend,
  DxSeries,
  DxTooltip,
  DxValueAxis,
  DxBreakStyle,
} from 'devextreme-vue/chart';

import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';

import { dataSource } from './data.js';

export default {
  components: {
    DxChart,
    DxLegend,
    DxSeries,
    DxTooltip,
    DxValueAxis,
    DxBreakStyle,
    DxSelectBox,
    DxCheckBox,
  },
  data() {
    const lineStyles = ['waved', 'straight'];

    return {
      dataSource,
      autoBreaksEnabledValue: true,
      lineStyles,
      breaksCount: [1, 2, 3, 4],
      lineStyleValue: lineStyles[0],
      breaksCountValue: 3,
    };
  },
};
</script>
<style>
#chart {
  height: 440px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  display: inline-block;
  margin-right: 70px;
  margin-top: 5px;
}

.option > span {
  margin: 0 10px 0 0;
}

.checkbox {
  margin-top: -4px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}

.options-container {
  display: flex;
  align-items: center;
}
</style>
