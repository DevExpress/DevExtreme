<template>
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
    <DxArgumentAxis :workdays-only="true">
      <DxLabel format="shortDate"/>
    </DxArgumentAxis>
    <DxValueAxis :tick-interval="1">
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
import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxReduction,
  DxArgumentAxis,
  DxLabel,
  DxFormat,
  DxValueAxis,
  DxTitle,
  DxExport,
  DxTooltip,
} from 'devextreme-vue/chart';
import { dataSource } from './data.ts';

const customizeTooltip = (pointInfo) => ({
  text: `Open: $${pointInfo.openValue}<br/>
         Close: $${pointInfo.closeValue}<br/>
         High: $${pointInfo.highValue}<br/>
         Low: $${pointInfo.lowValue}<br/>`,
});
</script>
<style>
#chart {
  height: 440px;
}
</style>
