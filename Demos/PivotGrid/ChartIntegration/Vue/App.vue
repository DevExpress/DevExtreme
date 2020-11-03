<template>
  <div>
    <DxChart ref="chart">
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
      <DxAdaptiveLayout :width="450"/>
      <DxSize :height="320"/>
      <DxCommonSeriesSettings type="bar"/>
    </DxChart>

    <DxPivotGrid
      id="pivotgrid"
      ref="grid"
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
      />
    </DxPivotGrid>
  </div>
</template>
<script>

import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from 'devextreme-vue/chart';

import {
  DxPivotGrid,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';

import sales from './data.js';

export default {
  components: {
    DxChart,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxTooltip,
    DxPivotGrid,
    DxFieldChooser
  },
  data() {
    return {
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          sortBySummaryField: 'Total'
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row'
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column'
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data'
        }, {
          summaryType: 'count',
          area: 'data'
        }],
        store: sales
      },
      customizeTooltip(args) {
        var valueText = (args.seriesName.indexOf('Total') != -1)
          ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
          : args.originalValue;

        return {
          html: `${args.seriesName }<div class='currency'>${
            valueText }</div>`
        };
      }
    };
  },
  mounted() {
    const pivotGrid = this.$refs.grid.instance;
    const chart = this.$refs.chart.instance;
    pivotGrid.bindChart(chart, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false
    });
  }
};
</script>
<style>
#pivotgrid {
    margin-top: 20px;
}
.currency {
    text-align: center;
}
</style>
