<template>
  <div v-if="connectionStarted">
    <DxChart
      id="chart"
      ref="chart"
      :data-source="dataSource"
      :margin="{right: 30}"
      :customize-point="customizePoint"
      zooming-mode="all"
      scrolling-mode="all"
      title="Stock Price"
    >

      <DxSeries
        argument-field="date"
        type="candlestick"
        pane="Price"
      >
        <DxAggregation
          :enabled="true"
          :calculate="calculateCandle"
          method="custom"
        />
      </DxSeries>
      <DxSeries
        argument-field="date"
        value-field="volume"
        type="bar"
        color="red"
        pane="Volume"
        name="Volume"
      >
        <DxAggregation
          :enabled="true"
          method="sum"
        />
      </DxSeries>
      <DxPane name="Price"/>
      <DxPane
        :height="80"
        name="Volume"
      />
      <DxLegend :visible="false"/>
      <DxArgumentAxis
        :min-visual-range-length="{minutes: 10}"
        :visual-range="{length: 'hour'}"
        argument-type="datetime"
      />
      <DxZoomAndPan argument-axis="both"/>
      <DxValueAxis :placeholder-size="50"/>
      <DxScrollBar :visible="true"/>
      <DxLoadingIndicator :enabled="true"/>
      <DxTooltip
        :enabled="true"
        :shared="true"
        argument-format="shortDateShortTime"
        content-template="tooltipTemplate"
      />
      <DxCrosshair
        :enabled="true"
        :horizontal-line="{visible: false}"
      />
      <template #tooltipTemplate="{ data }">
        <TooltipTemplate :point-info="data"/>
      </template>
    </DxChart>
  </div>
</template>
<script>

import {
  DxChart,
  DxArgumentAxis,
  DxValueAxis,
  DxAggregation,
  DxSeries,
  DxLegend,
  DxScrollBar,
  DxZoomAndPan,
  DxLoadingIndicator,
  DxPane,
  DxTooltip,
  DxCrosshair
} from 'devextreme-vue/chart';
import CustomStore from 'devextreme/data/custom_store';
import TooltipTemplate from './TooltipTemplate.vue';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';

export default {
  components: {
    DxChart,
    DxArgumentAxis,
    DxValueAxis,
    DxAggregation,
    DxLegend,
    DxSeries,
    DxScrollBar,
    DxZoomAndPan,
    DxLoadingIndicator,
    DxPane,
    DxTooltip,
    DxCrosshair,
    TooltipTemplate
  },

  data() {
    return {
      connectionStarted: false,
      dataSource: null
    };
  },

  mounted() {
    var hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/stockTickDataHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();

    var store = new CustomStore({
      load: () => hubConnection.invoke('getAllData'),
      key: 'date'
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data) => {
          store.push([{ type: 'insert', key: data.date, data: data }]);
        });
        this.dataSource = store;
        this.connectionStarted = true;
      });
  },

  methods: {
    calculateCandle(e) {
      const prices = e.data.map(d => d.price);
      if (prices.length) {
        return {
          date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
          open: prices[0],
          high: Math.max.apply(null, prices),
          low: Math.min.apply(null, prices),
          close: prices[prices.length - 1]
        };
      }
    },

    customizePoint(pointInfo) {
      if(pointInfo.seriesName === 'Volume') {
        const point = this.$refs.chart.instance.getAllSeries()[0].getPointsByArg(pointInfo.argument)[0].data;
        if(point.close >= point.open) {
          return { color: '#1db2f5' };
        }
      }
    }
  }
};
</script>

<style>
#chart {
    height: 440px;
}
</style>
