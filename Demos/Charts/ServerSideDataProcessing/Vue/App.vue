<template>
  <div id="chart-demo">
    <DxChart
      :data-source="chartDataSource"
      title="Temperature in Seattle , 2017"
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
        argument-field="Number"
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
        :value="1"
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
import DxSelectBox from 'devextreme-vue/select-box';
import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';
import { months } from './data.js';

const chartDataSource = new DataSource({
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/WeatherItems',
  },
  postProcess(results) {
    return results[0].DayItems;
  },
  expand: 'DayItems',
  filter: ['Id', '=', 1],
  paginate: false,
});
const customizeLabelText = ({ valueText }) => `${valueText}${'&#176C'}`;
const customizeTooltip = ({ valueText }) => ({
  text: `${valueText}${'&#176C'}`,
});
function onValueChanged({ value }) {
  chartDataSource.filter(['Id', '=', value]);
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
