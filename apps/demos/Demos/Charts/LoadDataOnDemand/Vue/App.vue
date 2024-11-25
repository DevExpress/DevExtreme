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
<script setup lang="ts">
import { computed, ref } from 'vue';
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
  DxLegend,
} from 'devextreme-vue/chart';
import DataSource from 'devextreme/data/data_source';
import 'whatwg-fetch';

const HALFDAY = 43200000;
const chart = ref();
const visualRange = ref({
  startValue: new Date(2017, 3, 1),
  endValue: new Date(2017, 3, 15),
});
const chartDataSource = ref(new DataSource({
  store: [],
  sort: 'date',
  paginate: false,
}));
const bounds = ref({
  startValue: new Date(2017, 0, 1),
  endValue: new Date(2017, 11, 31),
});

let packetsLock = 0;
const currentVisualRange = computed({
  get() {
    return visualRange.value;
  },
  set(newRange) {
    const stateStart = visualRange.value.startValue;
    const currentStart = newRange.startValue;
    if (stateStart.valueOf() !== currentStart.valueOf()) {
      visualRange.value = newRange;
    }
    onVisualRangeChanged();
  },
});

function onVisualRangeChanged() {
  const component = chart.value.instance;
  const items = component.getDataSource().items();
  if (!items.length
    || items[0].date - visualRange.value.startValue >= HALFDAY
    || visualRange.value.endValue - items[items.length - 1].date >= HALFDAY) {
    uploadDataByVisualRange(visualRange.value, component);
  }
}
function uploadDataByVisualRange({ startValue, endValue }, component) {
  const dataSource = component.getDataSource();
  const storage = dataSource.items();
  const ajaxArgs = {
    startVisible: getDateString(startValue),
    endVisible: getDateString(endValue),
    startBound: getDateString(storage.length ? storage[0].date : null),
    endBound: getDateString(storage.length
      ? storage[storage.length - 1].date : null),
  };

  if (ajaxArgs.startVisible !== ajaxArgs.startBound
        && ajaxArgs.endVisible !== ajaxArgs.endBound && !packetsLock) {
    packetsLock += 1;
    component.showLoadingIndicator();

    getDataFrame(ajaxArgs)
      .then((dataFrame) => {
        packetsLock -= 1;

        const componentStorage = dataSource.store();

        dataFrame
          .map((i) => ({
            date: new Date(i.Date),
            minTemp: i.MinTemp,
            maxTemp: i.MaxTemp,
          }))
          .forEach((item) => componentStorage.insert(item));

        dataSource.reload();

        onVisualRangeChanged();
      })
      .catch(() => {
        packetsLock -= 1;
        dataSource.reload();
      });
  }
}
function getDataFrame(args) {
  let params = '?';

  params += `startVisible=${args.startVisible}
        &endVisible=${args.endVisible}
        &startBound=${args.startBound}
        &endBound=${args.endBound}`;

  return fetch(`https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData${params}`)
    .then((response) => response.json());
}
function getDateString(dateTime) {
  return dateTime ? dateTime.toLocaleDateString('en-US') : '';
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
