<template>
  <div>
    <DxChart ref="chartRef">
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
      <DxAdaptiveLayout :width="450"/>
      <DxSize :height="200"/>
      <DxCommonSeriesSettings type="bar"/>
    </DxChart>

    <DxPivotGrid
      id="pivotgrid"
      ref="pivotGridRef"
      :data-source="dataSource"
      :allow-sorting-by-summary="true"
      :allow-filtering="true"
      :show-borders="true"
      :show-column-grand-totals="false"
      :show-row-grand-totals="false"
      :show-row-totals="false"
      :show-column-totals="false"
    >
      <DxFieldChooser
        :enabled="true"
        :height="400"
      />
    </DxPivotGrid>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from 'devextreme-vue/chart';
import {
  DxPivotGrid,
  DxFieldChooser,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { sales } from './data.ts';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    sortBySummaryField: 'Total',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false,
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

const customizeTooltip = function({ seriesName, originalValue }) {
  const valueText = currencyFormatter.format(originalValue);
  return {
    html: `${seriesName} | Total<div class='currency'>${valueText}</div>`,
  };
};
const pivotGridRef = ref<DxPivotGrid>();
const chartRef = ref<DxChart>();

onMounted(() => {
  const pivotGrid = pivotGridRef.value?.instance;

  pivotGrid?.bindChart(chartRef.value?.instance, {
    dataFieldsDisplayMode: 'splitPanes',
    alternateDataFields: false,
  });

  const pivotGridDataSource = pivotGrid?.getDataSource();

  setTimeout(() => {
    pivotGridDataSource?.expandHeaderItem('row', ['North America']);
    pivotGridDataSource?.expandHeaderItem('column', [2013]);
  });
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});
</script>
<style>
#pivotgrid {
  margin-top: 20px;
}

.currency {
  text-align: center;
}
</style>
