<template>
  <DxChart
    id="chart"
    :data-source="populationData"
    palette="Vintage"
  >
    <DxCommonSeriesSettings
      argument-field="year"
      type="fullstackedbar"
    />
    <DxSeries
      v-for="continent in continentSources"
      :key="continent.value"
      :value-field="continent.value"
      :name="continent.name"
    />
    <DxSeries
      axis="total"
      type="spline"
      value-field="total"
      name="Total"
      color="#008fd8"
    />

    <DxValueAxis>
      <DxGrid :visible="true"/>
    </DxValueAxis>
    <DxValueAxis
      name="total"
      position="right"
      title="Total Population, billions"
    >
      <DxGrid :visible="true"/>
    </DxValueAxis>

    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      :shared="true"
      :customize-tooltip="customizeTooltip"
    >
      <DxFormat
        :precision="1"
        type="largeNumber"
      />
    </DxTooltip>
    <DxTitle text="Evolution of Population by Continent"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxCommonSeriesSettings,
  DxSeries,
  DxValueAxis,
  DxExport,
  DxLegend,
  DxTooltip,
  DxTitle,
  DxGrid,
  DxFormat
} from 'devextreme-vue/chart';
import { continentSources, populationData } from './data.js';

export default {
  components: {
    DxChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxValueAxis,
    DxExport,
    DxLegend,
    DxTooltip,
    DxTitle,
    DxGrid,
    DxFormat
  },

  data() {
    return {
      continentSources,
      populationData
    };
  },

  methods: {
    customizeTooltip(pointInfo) {
      const items = pointInfo.valueText.split('\n');
      const color = pointInfo.point.getColor();

      items.forEach((item, index) => {
        if(item.indexOf(pointInfo.seriesName) === 0) {
          const element = document.createElement('span');

          element.textContent = item;
          element.style.color = color;
          element.className = 'active';

          items[index] = element.outerHTML;
        }
      });

      return { text: items.join('\n') };
    }
  }
};
</script>
<style>
#chart {
	height: 440px;
}

.active {
	font-weight: 500;
}
</style>
