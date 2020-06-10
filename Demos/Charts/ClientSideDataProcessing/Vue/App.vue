<template>
  <div id="chart-demo">
    <DxChart
      :data-source="monthWeather"
      :customize-point="customizePoint"
      title="Temperature in Barcelona: January 2012"
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
      <DxSelectBox
        id="choose-temperature"
        :data-source="temperature"
        :width="70"
        :value="6"
        :on-value-changed="changeTemperature"
      />
      <div class="label">Choose a temperature threshold, &deg;C:
      </div>
    </div>
  </div>
</template>
<script>

import DxChart, {
  DxValueAxis,
  DxLabel,
  DxLegend,
  DxExport,
  DxSeries,
  DxSize,
  DxLoadingIndicator
} from 'devextreme-vue/chart';

import DxSelectBox from 'devextreme-vue/select-box';

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

const palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];

export default {
  components: {
    DxChart,
    DxValueAxis,
    DxLabel,
    DxLegend,
    DxExport,
    DxLoadingIndicator,
    DxSeries,
    DxSize,

    DxSelectBox
  },
  data() {
    let paletteIndex = 0;

    const monthWeather = new DataSource({
      store: new CustomStore({
        load: () => {
          return fetch('../../../../data/monthWeather.json')
            .then(e => e.json())
            .catch(() => { throw 'Data Loading Error'; });
        },
        loadMode: 'raw'
      }),
      filter: ['t', '>', '6'],
      paginate: false
    });

    return {
      temperature: [6, 7, 8, 9, 10, 11, 12],
      monthWeather,
      paletteIndex
    };
  },
  methods: {
    changeTemperature({ value }) {
      this.monthWeather.filter(['t', '>', value]);
      this.monthWeather.load();
    },
    customizeLabelText({ valueText }) {
      return `${valueText}${'&#176C'}`;
    },
    customizePoint() {
      const color = palette[this.paletteIndex];
      this.paletteIndex = this.paletteIndex === 2 ? 0 : this.paletteIndex + 1;

      return { color };
    },
  }
};
</script>
<style>
#choose-temperature {
    float: right;
}
.action {
    width: 320px;
    margin-top: 20px;
}
.label {
    padding-top: 9px;
}
</style>
