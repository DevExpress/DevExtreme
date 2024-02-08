<template>
  <div>
    <DxChart
      id="chart"
      :data-source="dataSource"
      title="Damped Sine Wave"
    >
      <DxPane name="top"/>
      <DxPane name="bottom"/>
      <DxSeries pane="top"/>
      <DxSeries pane="bottom"/>
      <DxCommonAxisSettings
        :end-on-tick="false"
      />
      <DxValueAxis
        :linear-threshold="-3"
        type="logarithmic"
        title="Logarithmic Axis"
        pane="top"
      />
      <DxValueAxis
        title="Linear Axis"
        pane="bottom"
      />
      <DxTooltip
        :enabled="true"
        format="exponential"
      />
      <DxCrosshair
        :enabled="true"
      >
        <DxHorizontalLine
          :visible="false"
        />
        <DxLabel
          :visible="true"
          :format="crosshairFormat"
        />
      </DxCrosshair>
      <DxLegend
        :visible="false"
      />
    </DxChart>
  </div>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxPane,
  DxSeries,
  DxCommonAxisSettings,
  DxValueAxis,
  DxTooltip,
  DxCrosshair,
  DxHorizontalLine,
  DxLabel,
  DxLegend,
} from 'devextreme-vue/chart';
import { dataSource } from './data.ts';

const crosshairFormat = {
  type: 'fixedPoint',
  precision: 2,
};
</script>
<style scoped>
#chart {
  height: 450px;
}
</style>
