<template>
  <DxVectorMap
    id="vector-map"
    :bounds="bounds"
  >
    <DxLayer
      :data-source="mapsWorld"
      :color-groups="colorGroups"
      :customize="customizeLayer"
      name="areas"
      color-grouping-field="total"
      palette="Violet"
    >
      <DxLabel
        :enabled="true"
        data-field="name"
      />
    </DxLayer>

    <DxLegend :customize-text="customizeLegendText">
      <DxSource
        layer="areas"
        grouping="color"
      />
    </DxLegend>

    <DxTitle text="Nominal GDP">
      <DxSubtitle text="(in millions of US dollars)"/>
    </DxTitle>

    <DxTooltip
      :enabled="true"
      content-template="tooltipTemplate"
    />
    <DxExport :enabled="true"/>
    <template #tooltipTemplate="{ data }">
      <TooltipTemplate
        :info="data"
      />
    </template>
  </DxVectorMap>
</template>
<script>

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

import {
  DxVectorMap,
  DxExport,
  DxLabel,
  DxLayer,
  DxLegend,
  DxSource,
  DxSubtitle,
  DxTitle,
  DxTooltip
} from 'devextreme-vue/vector-map';

import TooltipTemplate from './TooltipTemplate.vue';

import { countriesGDP } from './data.js';

const format = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0
}).format;

export default {
  components: {
    DxVectorMap,
    DxExport,
    DxLabel,
    DxLayer,
    DxLegend,
    DxSource,
    DxSubtitle,
    DxTitle,
    DxTooltip,
    TooltipTemplate
  },
  data() {
    return {
      colorGroups: [0, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000],
      mapsWorld: mapsData.world,
      bounds: [-180, 85, 180, -60]
    };
  },
  methods: {
    getPieChartConfig(chartData) {
      return {
        dataSource: chartData,
        series: [{
          valueField: 'value',
          argumentField: 'name',
          label: {
            visible: true,
            connector: {
              visible: true,
              width: 1
            },
            customizeText: function(pointInfo) {
              return `${pointInfo.argument[0].toUpperCase()}${
                pointInfo.argument.slice(1)
              }: $${pointInfo.value}M`;
            }
          }
        }],
        legend: {
          visible: false
        }
      };
    },
    customizeLayer(elements) {
      elements.forEach((element) => {
        const countryGDPData = countriesGDP[element.attribute('name')];
        element.attribute('total', countryGDPData && countryGDPData.total || 0);
      });
    },
    customizeLegendText({ start, end }) {
      return `${format(start)} to ${format(end)}`;
    }
  }
};
</script>
<style>
#vector-map {
    height: 700px;
}
</style>
