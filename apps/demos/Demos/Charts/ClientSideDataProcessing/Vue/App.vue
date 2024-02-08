<template>
  <div id="chart-demo">
    <DxChart
      :data-source="monthWeather"
      :customize-point="customizePoint"
      title="Temperature in Seattle: October 2017"
    >
      <DxSize :height="420"/>
      <DxValueAxis>
        <DxLabel
          :customize-text="customizeLabelText"
          :visible="true"
        />
      </DxValueAxis>
      <DxSeries
        argument-field="day"
        value-field="t"
        type="bar"
      />
      <DxLegend :visible="false"/>
      <DxExport :enabled="true"/>
      <DxLoadingIndicator :enabled="true"/>
    </DxChart>
    <div class="action">
      <div class="label">Choose a temperature threshold, &deg;C:
      </div>
      <DxSelectBox
        id="choose-temperature"
        :data-source="temperature"
        :input-attr="{ 'aria-label': 'Temperature' }"
        :value="2"
        :on-value-changed="changeTemperature"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import DxChart, {
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxExport,
  DxSeries,
  DxSize,
  DxLoadingIndicator,
} from 'devextreme-vue/chart';
import DxSelectBox from 'devextreme-vue/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

const temperature = [2, 4, 6, 8, 9, 10, 11];
const palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];
let paletteIndex = 0;

const monthWeather = new DataSource({
  store: new CustomStore({
    load: () => fetch('../../../../data/monthWeather.json')
      .then((e) => e.json())
      .catch(() => { throw new Error('Data Loading Error'); }),
    loadMode: 'raw',
  }),
  filter: ['t', '>', '2'],
  paginate: false,
});

const customizeLabelText = ({ valueText }) => `${valueText}${'&#176C'}`;

function changeTemperature({ value }) {
  monthWeather.filter(['t', '>', value]);
  monthWeather.load();
}

function customizePoint() {
  const color = palette[paletteIndex];
  paletteIndex = paletteIndex === 2 ? 0 : paletteIndex + 1;

  return { color };
}
</script>
<style>
.action {
  width: 330px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action .dx-selectbox {
  width: 90px;
}
</style>
