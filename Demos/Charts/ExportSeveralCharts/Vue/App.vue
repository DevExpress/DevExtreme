
<template>
  <div id="chart-demo">
    <div class="charts">
      <DxChart
        id="chart"
        ref="chart"
        :data-source="goldMedals"
        :rotated="true"
        title="Olympic Gold Medals in 2008"
      >
        <DxSeries
          type="bar"
          argument-field="country"
          value-field="medals"
          color="#f3c40b"
        >
          <DxLabel :visible="true"/>
        </DxSeries>
        <DxLegend :visible="false"/>
      </DxChart>
      <DxPieChart
        id="pieChart"
        ref="pieChart"
        :data-source="allMedals"
        palette="Harmony Light"
        title="Total Olympic Medals\n in 2008"
      >
        <DxPieSeries
          argument-field="country"
          value-field="medals"
        >
          <DxPieLabel :visible="true">
            <DxConnector :visible="true"/>
          </DxPieLabel>
        </DxPieSeries>
      </DxPieChart>
    </div>
    <div class="controls-pane">
      <DxButton
        id="export"
        :width="145"
        icon="export"
        type="default"
        text="Export"
        @click="onClick()"
      />
    </div>
  </div>
</template>

<script>
import DxChart, {
  DxSeries,
  DxLabel,
  DxLegend
} from 'devextreme-vue/chart';
import DxPieChart, {
  DxSeries as DxPieSeries,
  DxLabel as DxPieLabel,
  DxConnector
} from 'devextreme-vue/pie-chart';
import { exportWidgets } from 'devextreme/viz/export';
import DxButton from 'devextreme-vue/button';
import { allMedals, goldMedals } from './data.js';

export default {
  components: {
    DxChart,
    DxSeries,
    DxLabel,
    DxLegend,
    DxPieChart,
    DxPieSeries,
    DxPieLabel,
    DxConnector,
    DxButton
  },
  data() {
    return {
      allMedals,
      goldMedals
    };
  },
  methods: {
    onClick() {
      const chartInstance = this.$refs.chart.instance;
      const pieChartInstance = this.$refs.pieChart.instance;

      exportWidgets([[chartInstance, pieChartInstance]], {
        fileName: 'chart',
        format: 'PNG'
      });
    }
  }
};
</script>
<style>
#chart-demo {
    height: 460px;
}

.charts {
    width: 820px;
    margin: 0 auto;
    height: 374px;
    margin-bottom: 40px;
    font-size: 0;
}

#chart, #pieChart{
    width: 395px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
}

#chart {
    margin-right: 30px;
}

.controls-pane {
    text-align: center;
}
</style>

