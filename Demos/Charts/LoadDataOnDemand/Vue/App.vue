<template>
  <DxChart
    id="chart"
    ref="chart"
    :data-source="chartDataSource"
    title="Temperature in Toronto (2017)"
  >
    <DxZoomAndPan argument-axis="pan"/>
    <DxScrollBar :visible="true"/>
    <DxArgumentAxis
      v-model:visual-range="currentVisualRange"
      :whole-range="bounds"
      argument-type="datetime"
      visual-range-update-mode="keep"
    />
    <DxValueAxis
      :allow-decimals="false"
      name="temperature"
    >
      <DxTitle text="Temperature, &deg;C">
        <DxFont color="#ff950c"/>
      </DxTitle>
      <DxLabel>
        <DxFont color="#ff950c"/>
      </DxLabel>
    </DxValueAxis>
    <DxSeries
      color="#ff950c"
      type="rangearea"
      argument-field="date"
      range-value1-field="minTemp"
      range-value2-field="maxTemp"
      name="Temperature range"
    />
    <DxAnimation :enabled="false"/>
    <DxLoadingIndicator background-color="none">
      <DxFont :size="14"/>
    </DxLoadingIndicator>
    <DxLegend :visible="false"/>
  </DxChart>
</template>
<script>

import DxChart, {
  DxZoomAndPan,
  DxScrollBar,
  DxArgumentAxis,
  DxSeries,
  DxValueAxis,
  DxTitle,
  DxLabel,
  DxFont,
  DxAnimation,
  DxLoadingIndicator,
  DxLegend
} from 'devextreme-vue/chart';

import DataSource from 'devextreme/data/data_source';
import 'whatwg-fetch';

let packetsLock = 0;
const HALFDAY = 43200000;

export default {
  components: {
    DxChart,
    DxZoomAndPan,
    DxScrollBar,
    DxArgumentAxis,
    DxSeries,
    DxValueAxis,
    DxTitle,
    DxLabel,
    DxFont,
    DxAnimation,
    DxLoadingIndicator,
    DxLegend
  },

  data() {
    return {
      visualRange: {
        startValue: new Date(2017, 3, 1),
        endValue: new Date(2017, 3, 15)
      },
      chartDataSource: new DataSource({
        store: [],
        sort: 'date',
        paginate: false
      }),
      bounds: {
        startValue: new Date(2017, 0, 1),
        endValue: new Date(2017, 11, 31)
      }
    };
  },

  computed: {
    currentVisualRange: {
      get: function() {
        return this.visualRange;
      },
      set: function(newRange) {
        const stateStart = this.visualRange.startValue;
        const currentStart = newRange.startValue;
        if(stateStart.valueOf() !== currentStart.valueOf()) {
          this.visualRange = newRange;
        }
        this.onVisualRangeChanged();
      }
    }
  },

  methods: {
    onVisualRangeChanged() {
      const component = this.$refs.chart.instance;
      const items = component.getDataSource().items();
      if(!items.length ||
        items[0].date - this.visualRange.startValue >= HALFDAY ||
        this.visualRange.endValue - items[items.length - 1].date >= HALFDAY) {
        this.uploadDataByVisualRange(this.visualRange, component);
      }
    },

    uploadDataByVisualRange(visualRange, component) {
      const dataSource = component.getDataSource();
      const storage = dataSource.items();
      const ajaxArgs = {
        startVisible: this.getDateString(visualRange.startValue),
        endVisible: this.getDateString(visualRange.endValue),
        startBound: this.getDateString(storage.length ? storage[0].date : null),
        endBound: this.getDateString(storage.length ?
          storage[storage.length - 1].date : null)
      };

      if(ajaxArgs.startVisible !== ajaxArgs.startBound &&
        ajaxArgs.endVisible !== ajaxArgs.endBound && !packetsLock) {
        packetsLock++;
        component.showLoadingIndicator();

        this.getDataFrame(ajaxArgs)
          .then(dataFrame => {
            packetsLock--;
            dataFrame = dataFrame.map(i => {
              return {
                date: new Date(i.Date),
                minTemp: i.MinTemp,
                maxTemp: i.MaxTemp
              };
            });

            const componentStorage = dataSource.store();
            dataFrame.forEach(item => componentStorage.insert(item));
            dataSource.reload();

            this.onVisualRangeChanged();
          })
          .catch(() => {
            packetsLock--;
            dataSource.reload();
          });
      }
    },

    getDataFrame(args) {
      let params = '?';

      params += `startVisible=${args.startVisible}
        &endVisible=${args.endVisible}
        &startBound=${args.startBound}
        &endBound=${args.endBound}`;

      return fetch(`https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData${params}`)
        .then(response => response.json());
    },

    getDateString(dateTime) {
      return dateTime ? dateTime.toLocaleDateString('en-US') : '';
    }
  }
};
</script>
<style>
#chart {
    height: 440px;
}
</style>
