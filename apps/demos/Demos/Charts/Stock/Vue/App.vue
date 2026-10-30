<template>
  <DxToolbar>
    <DxItem
      location="before"
      text="Stock Price"
      css-class="chart-title"
    />
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
      :options="zoomOutButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="zoomInButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="resetZoomButtonOptions"
      location="after"
      widget="dxButton"
    />
    <DxItem
      :options="exportButtonOptions"
      location="after"
      widget="dxDropDownButton"
    />
  </DxToolbar>
  <DxChart
    id="chart"
    ref="chart"
    :data-source="dataSource"
    :resize-panes-on-zoom="true"
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
    <DxArgumentAxis :min-visual-range-length="minVisualRangeLength">
      <DxVisualRange
        v-model:start-value="startValue"
        v-model:end-value="endValue"
      />
      <DxLabel
        :rotation-angle="30"
        :customize-text="customizeLabelText"
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
    <DxTooltip
      :enabled="true"
      :format="{ type: 'currency', precision: 2 }"
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
  DxTooltip,
  type DxChartTypes,
} from 'devextreme-vue/chart';
import type { DxButtonTypes } from 'devextreme-vue/button';
import type { DxDropDownButtonTypes } from 'devextreme-vue/drop-down-button';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { formatDate } from 'devextreme/localization';
import 'devextreme/ui/drop_down_button';
import { dataSource } from './data.ts';

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisualRangeLength = { days: 3 };
const minVisibleSpanMs = minVisualRangeLength.days * dayMs;

const initialEnd = new Date(1994, 3, 29, 12);

const dataMin = dataSource[0].date.getTime();
const dataMax = dataSource[dataSource.length - 1].date.getTime();
const rangeMin = dataMin - dayMs / 2;
const rangeMax = dataMax + dayMs / 2;
const initialStart = new Date(rangeMin);

const exportFormats = ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'] as const;
const exportItems = [
  { text: 'Print' },
  ...exportFormats.map((format) => ({ text: `${format} file`, format })),
];

const chart = ref();

const startValue = ref(initialStart);
const endValue = ref(initialEnd);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getRange = () => ({
  start: startValue.value.getTime(),
  end: endValue.value.getTime(),
});

const setRange = (start: number, end: number) => {
  const span = clamp(end - start, minVisibleSpanMs, rangeMax - rangeMin);
  const center = (start + end) / 2;
  const newStart = clamp(center - span / 2, rangeMin, rangeMax - span);

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
  icon: 'arrowleft',
  hint: 'Pan Left',
  elementAttr: { 'aria-label': 'Pan Left' },
  onClick: () => pan(-1),
};

const panRightButtonOptions: DxButtonTypes.Properties = {
  icon: 'arrowright',
  hint: 'Pan Right',
  elementAttr: { 'aria-label': 'Pan Right' },
  onClick: () => pan(1),
};

const zoomInButtonOptions: DxButtonTypes.Properties = {
  icon: 'zoominoutline',
  hint: 'Zoom In',
  elementAttr: { 'aria-label': 'Zoom In' },
  onClick: () => zoom(zoomFactor),
};

const zoomOutButtonOptions: DxButtonTypes.Properties = {
  icon: 'zoomoutoutline',
  hint: 'Zoom Out',
  elementAttr: { 'aria-label': 'Zoom Out' },
  onClick: () => zoom(1 / zoomFactor),
};

const resetZoomButtonOptions: DxButtonTypes.Properties = {
  icon: 'refresh',
  hint: 'Reset Zoom',
  elementAttr: { 'aria-label': 'Reset Zoom' },
  onClick: resetZoom,
};

const exportButtonOptions: DxDropDownButtonTypes.Properties = {
  icon: 'export',
  hint: 'Exporting/Printing',
  elementAttr: { 'aria-label': 'Exporting/Printing' },
  stylingMode: 'text',
  useSelectMode: false,
  dropDownOptions: { width: 100 },
  displayExpr: 'text',
  items: exportItems,
  onItemClick: ({ itemData }) => {
    if (itemData.format) {
      chart.value.instance.exportTo('file', itemData.format);
    } else {
      chart.value.instance.print();
    }
  },
};

const customizeLabelText = ({ value }: { value?: Date | number | string }) => {
  const date = value as Date;
  const isMidnight = date.getHours() === 0 && date.getMinutes() === 0;

  return formatDate(date, isMidnight ? 'MMM dd' : 'shortTime');
};

const customizeTooltip = (pointInfo: DxChartTypes.PointInfo) => {
  if (!('openValue' in pointInfo)) {
    return { text: '' };
  }

  return {
    text: [
      `Open: ${pointInfo.openValueText}`,
      `Close: ${pointInfo.closeValueText}`,
      `High: ${pointInfo.highValueText}`,
      `Low: ${pointInfo.lowValueText}`,
    ].join('<br/>'),
  };
};
</script>
<style>
.dx-toolbar-item.chart-title {
  font-size: 20px;
  font-weight: 600;
}

#chart {
  height: 440px;
}
</style>
