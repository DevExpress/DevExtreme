<template>
  <DxToolbar>
    <DxItem
      :options="panLeftButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="panRightButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="zoomInButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="zoomOutButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="resetZoomButtonOptions"
      location="after"
      widget="dxButton"
    />
  </DxToolbar>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Stock Price"
  >
    <DxCommonSeriesSettings
      argument-field="date"
      type="stock"
    />
    <DxSeries
      name="E-Mart"
      open-value-field="o"
      high-value-field="h"
      low-value-field="l"
      close-value-field="c"
    >
      <DxReduction color="red"/>
    </DxSeries>
    <DxZoomAndPan
      :drag-to-zoom="true"
      :allow-mouse-wheel="true"
      argument-axis="both"
    />
    <DxScrollBar
      :visible="true"
      position="bottom"
    />
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxArgumentAxis :min-visual-range-length="{ days: 3 }">
      <DxVisualRange
        v-model:start-value="startValue"
        v-model:end-value="endValue"
      />
      <DxLabel
        :rotation-angle="30"
        format="MMM dd"
        overlapping-behavior="rotate"
      />
    </DxArgumentAxis>
    <DxValueAxis
      :tick-interval="1"
      position="right"
    >
      <DxTitle text="US dollars"/>
      <DxLabel>
        <DxFormat
          :precision="0"
          type="currency"
        />
      </DxLabel>
    </DxValueAxis>
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :customize-tooltip="customizeTooltip"
      location="edge"
    />
  </DxChart>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxReduction,
  DxArgumentAxis,
  DxVisualRange,
  DxLabel,
  DxFormat,
  DxValueAxis,
  DxTitle,
  DxZoomAndPan,
  DxScrollBar,
  DxLegend,
  DxExport,
  DxTooltip,
  type DxChartTypes,
} from 'devextreme-vue/chart';
import type { DxButtonTypes } from 'devextreme-vue/button';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { dataSource } from './data.ts';

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisibleSpanMs = 3 * dayMs;

const initialStart = new Date(1994, 3, 14, 12);
const initialEnd = new Date(1994, 3, 29, 12);

const dataMin = dataSource[0].date.getTime();
const dataMax = dataSource[dataSource.length - 1].date.getTime();

const startValue = ref(initialStart);
const endValue = ref(initialEnd);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getRange = () => ({
  start: startValue.value.getTime(),
  end: endValue.value.getTime(),
});

const setRange = (start: number, end: number) => {
  const span = clamp(end - start, minVisibleSpanMs, dataMax - dataMin);
  const center = (start + end) / 2;
  const newStart = clamp(center - span / 2, dataMin, dataMax - span);

  startValue.value = new Date(newStart);
  endValue.value = new Date(newStart + span);
};

const pan = (direction: number) => {
  const { start, end } = getRange();
  const shift = (end - start) * panStepFraction * direction;
  setRange(start + shift, end + shift);
};

const zoom = (factor: number) => {
  const { start, end } = getRange();
  const center = (start + end) / 2;
  const half = ((end - start) * factor) / 2;
  setRange(center - half, center + half);
};

const resetZoom = () => {
  setRange(initialStart.getTime(), initialEnd.getTime());
};

const panLeftButtonOptions: DxButtonTypes.Properties = {
  icon: 'chevronleft',
  hint: 'Pan Left',
  onClick: () => pan(-1),
};

const panRightButtonOptions: DxButtonTypes.Properties = {
  icon: 'chevronright',
  hint: 'Pan Right',
  onClick: () => pan(1),
};

const zoomInButtonOptions: DxButtonTypes.Properties = {
  icon: 'plus',
  hint: 'Zoom In',
  onClick: () => zoom(zoomFactor),
};

const zoomOutButtonOptions: DxButtonTypes.Properties = {
  icon: 'minus',
  hint: 'Zoom Out',
  onClick: () => zoom(1 / zoomFactor),
};

const resetZoomButtonOptions: DxButtonTypes.Properties = {
  icon: 'refresh',
  hint: 'Reset Zoom',
  onClick: resetZoom,
};

const customizeTooltip = (pointInfo: DxChartTypes.PointInfo) => {
  if (!('openValue' in pointInfo)) {
    return { text: '' };
  }

  return {
    text: `Open: $${pointInfo.openValue}<br/>
         Close: $${pointInfo.closeValue}<br/>
         High: $${pointInfo.highValue}<br/>
         Low: $${pointInfo.lowValue}<br/>`,
  };
};
</script>
<style>
#chart {
  height: 440px;
}
</style>
