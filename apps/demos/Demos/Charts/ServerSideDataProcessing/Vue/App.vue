<template>
  <div id="chart-demo">
    <DxChart
      :data-source="chartDataSource"
      :title="`Temperature in Seattle, ${year}`"
    >
      <DxSize :height="420"/>
      <DxValueAxis
        :grid="{ opacity: 0.2 }"
        value-type="numeric"
      >
        <DxLabel :customize-text="customizeLabelText"/>
      </DxValueAxis>
      <DxArgumentAxis type="discrete">
        <DxGrid
          :visible="true"
          :opacity="0.5"
        />
        <DxLabel :customize-text="customizeArgumentAxisLabelText"/>
      </DxArgumentAxis>
      <DxCommonPaneSettings>
        <DxBorder
          :visible="true"
          :width="2"
          :top="false"
          :right="false"
        />
      </DxCommonPaneSettings>
      <DxSeries
        argument-field="Date"
        value-field="Temperature"
        type="spline"
      />
      <DxLegend :visible="false"/>
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
      <DxExport :enabled="true"/>
      <DxLoadingIndicator :enabled="true"/>
    </DxChart>
    <div class="action">
      <div class="label">Choose a month:</div>
      <DxSelectBox
        id="selectbox"
        :width="150"
        :items="months"
        :input-attr="{ 'aria-label': 'Month' }"
        :value="selectedMonth"
        :on-value-changed="onValueChanged"
        value-expr="id"
        display-expr="name"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import DxChart, {
  DxValueAxis,
  DxArgumentAxis,
  DxCommonPaneSettings,
  DxGrid,
  DxSeries,
  DxLegend,
  DxSize,
  DxBorder,
  DxLabel,
  DxTooltip,
  DxExport,
  DxLoadingIndicator,
} from 'devextreme-vue/chart';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { DataSource } from 'devextreme-vue/common/data';

import { months } from './data.ts';

const year = 2017;
let selectedMonth = 1;

const startOfMonthStr = (month: number): string => `${month}/01/${year}`;
const endOfMonthStr = (month: number): string => {
  const nextMonth = (month === 12) ? 1 : month + 1;
  const nextYear = (month === 12) ? year + 1 : year;

  const lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();

  return `${month}/${lastDay}/${year}`;
};

const chartDataSource = new DataSource({
  key: 'Date',
  load: () => {
    const startVisible = startOfMonthStr(selectedMonth);
    const endVisible = endOfMonthStr(selectedMonth);
    const url = 'https://js.devexpress.com/Demos/NetCore/api/TemperatureData'
      + `?startVisible=${encodeURIComponent(startVisible)}`
      + `&endVisible=${encodeURIComponent(endVisible)}`
      + `&startBound=${encodeURIComponent(startVisible)}`
      + `&endBound=${encodeURIComponent(endVisible)}`;

    return fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Network response fails: ${r.status}`);
        return r.json();
      })
      .then((arr) => arr.map((item: Record<string, any>) => ({
        ...item,
        Temperature: (item.MinTemp + item.MaxTemp) / 2,
        Date: new Date(item.Date),
      })));
  },
  paginate: false,
});
const customizeLabelText = ({ valueText }: any) => `${valueText}${'&#176C'}`;
const customizeArgumentAxisLabelText = ({ value }: any) => new Date(value).getDate().toString();
const customizeTooltip = ({ valueText }: any) => ({
  text: `${valueText}${'&#176C'}`,
});

function onValueChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
  selectedMonth = value;
  chartDataSource.load();
}
</script>
<style>
.action {
  width: 270px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
