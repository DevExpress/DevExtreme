<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
    title="Population: Age Structure"
  >
    <DxCommonSeriesSettings
      argument-field="state"
      type="stackedbar"
    />
    <DxValueAxis>
      <DxTitle text="Populations, millions"/>
    </DxValueAxis>
    <DxSeries
      value-field="maleyoung"
      name="Male: 0-14"
      stack="male"
    />
    <DxSeries
      value-field="malemiddle"
      name="Male: 15-64"
      stack="male"
    />
    <DxSeries
      value-field="maleolder"
      name="Male: 65 and older"
      stack="male"
    />
    <DxSeries
      value-field="femaleyoung"
      name="Female: 0-14"
      stack="female"
    />
    <DxSeries
      value-field="femalemiddle"
      name="Female: 15-64"
      stack="female"
    />
    <DxSeries
      value-field="femaleolder"
      name="Female: 65 and older"
      stack="female"
    />
    <DxLegend
      :customize-items="customizeItems"
      :column-count="2"
      position="inside"
      horizontal-alignment="right"
    >
      <DxBorder :visible="true"/>
    </DxLegend>
    <DxExport :enabled="true"/>
    <DxTooltip :enabled="true"/>
  </DxChart>
</template>
<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxValueAxis,
  DxTitle,
  DxLegend,
  DxBorder,
  DxExport,
  DxTooltip
} from 'devextreme-vue/chart';

import service from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxTitle,
    DxLegend,
    DxBorder,
    DxExport,
    DxTooltip
  },
  data() {
    return {
      dataSource: service.getMaleAgeData()
    };
  },
  methods: {
    customizeItems(items) {
      let sortedItems = [];

      items.forEach(function(item) {
        const startIndex = item.series.stack === 'male' ? 0 : 3;
        sortedItems.splice(startIndex, 0, item);
      });
      return sortedItems;
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
