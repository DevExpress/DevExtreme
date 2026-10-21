<template>
  <div id="chart-demo">
    <DxChart
      id="chart"
      :data-source="dataSource"
    >
      <DxTitle text="Production of Crude Oil">
        <DxSubtitle text="(in Barrels)"/>
      </DxTitle>
      <DxCommonSeriesSettings
        argument-field="state"
        value-field="value"
        type="bar"
      >
        <DxAggregation
          :enabled="useAggregation"
          :method="currentFunction"
        />
      </DxCommonSeriesSettings>
      <DxSeriesTemplate
        name-field="year"
        :customize-series="customizeSeries"
      />
    </DxChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="useAggregation"
          text="Aggregation enabled"
        />
      </div>
      <div class="option">
        <span>Method:</span>
        <DxSelectBox
          :data-source="aggregationFunctions"
          v-model:value="currentFunction"
          :input-attr="{ 'aria-label': 'Method' }"
          display-expr="displayName"
          value-expr="func"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxChart, {
  DxTitle,
  DxSubtitle,
  DxCommonSeriesSettings,
  DxAggregation,
  DxSeriesTemplate,
  type DxChartTypes,
} from 'devextreme-vue/chart';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import { oilProductionData } from './data.ts';

const dataSource = oilProductionData;
const useAggregation = ref(true);
const currentFunction = ref<DxChartTypes.ChartSeriesAggregationMethod>('avg');
const aggregationFunctions = [
  { displayName: 'Average', func: 'avg' },
  { displayName: 'Maximum', func: 'max' },
  { displayName: 'Minimum', func: 'min' },
];
const customizeSeries = (seriesName: string) => {
  const isGhost = seriesName.endsWith(' (max)');
  const year = isGhost ? seriesName.slice(0, -6) : seriesName;

  return {
    barOverlapGroup: year,
    ...(isGhost && {
      aggregation: { enabled: true, method: 'max' as DxChartTypes.ChartSeriesAggregationMethod },
      color: '#d3d3d3',
      name: `${year} max`,
      showInLegend: false,
    }),
  };
};
</script>
<style>
#chart {
  height: 440px;
  margin: 0 0 15px;
}

#chart-demo {
  height: 620px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: var(--dx-color-options-panel-bg);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  width: 50px;
  display: inline-block;
  margin-right: 10px;
}

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
}
</style>
