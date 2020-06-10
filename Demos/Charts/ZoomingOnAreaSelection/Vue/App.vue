<template>
  <div>
    <DxChart
      id="chart"
      ref="chart"
      :data-source="birthLife"
      title="Life Expectancy vs. Birth Rates"
    >

      <DxArgumentAxis title="Life Expectancy"/>
      <DxValueAxis title="Birth Rate"/>

      <DxSeriesTemplate
        name-field="year"
      />
      <DxCommonSeriesSettings
        type="scatter"
        argument-field="life_exp"
        value-field="birth_rate"
      >
        <DxPoint :size="8"/>
      </DxCommonSeriesSettings>
      <DxZoomAndPan
        :drag-to-zoom="true"
        :allow-mouse-wheel="true"
        value-axis="both"
        argument-axis="both"
        pan-key="shift"
      />
      <DxCrosshair
        :enabled="true"
      >
        <DxLabel :visible="true"/>
      </DxCrosshair>
      <DxLegend
        position="inside"
      >
        <DxBorder :visible="true"/>
      </DxLegend>
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
    </DxChart>

    <DxButton
      id="reset-zoom"
      :on-click="resetZoom"
      text="Reset"
    />
  </div>
</template>
<script>

import DxChart, {
  DxArgumentAxis,
  DxValueAxis,
  DxCommonSeriesSettings,
  DxSeriesTemplate,
  DxPoint,
  DxTooltip,
  DxLabel,
  DxZoomAndPan,
  DxCrosshair,
  DxLegend,
  DxBorder
} from 'devextreme-vue/chart';

import DxButton from 'devextreme-vue/button';

import { birthLife } from './data.js';

export default {
  components: {
    DxChart,
    DxButton,
    DxArgumentAxis,
    DxValueAxis,
    DxCommonSeriesSettings,
    DxSeriesTemplate,
    DxPoint,
    DxTooltip,
    DxLabel,
    DxLegend,
    DxZoomAndPan,
    DxCrosshair,
    DxBorder
  },
  data() {
    return {
      birthLife
    };
  },
  methods: {
    resetZoom() {
      this.$refs.chart.instance.resetVisualRange();
    },

    customizeTooltip({ point }) {
      const data = point.data;
      return {
        text: `${data.country} ${data.year}`
      };
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
    width: 100%;
}

#reset-zoom {
   position: absolute;
   right: 10px;
   top: 5px;
}
</style>
