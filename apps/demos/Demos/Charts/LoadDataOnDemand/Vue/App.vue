<template>
  <DxChart
    id="chart"
    ref="chart"
    :data-source="chartDataSource"
    title="Temperature in Toronto (2025)"
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
import { DataSource } from 'devextreme-vue/common/data';
import 'whatwg-fetch';

type AjaxArgs = { startVisible: string; endVisible: string; startBound?: string; endBound?: string };

const HALFDAY = 43200000;
const chart = ref();
const visualRange = ref({
  startValue: new Date(2025, 3, 1),
  endValue: new Date(2025, 3, 15),
});
const chartDataSource = ref(new DataSource({
  store: [],
  sort: 'date',
  paginate: false,
}));
const bounds = ref({
  startValue: new Date(2025, 0, 1),
  endValue: new Date(2025, 11, 31),
});

let packetsLock = 0;
const currentVisualRange = computed({
  get() {
    return visualRange.value;
  },
  set(newRange: { startValue: Date; endValue: Date }) {
    const stateStart = visualRange.value.startValue;
    const currentStart = newRange.startValue;
    if (stateStart.valueOf() !== currentStart.valueOf()) {
      visualRange.value = newRange;
    }
    onVisualRangeChanged();
  },
});

function onVisualRangeChanged(): void {
  const component = chart.value.instance;
  const items: { date: Date }[] = component.getDataSource().items();

  if (!items.length
    || items[0].date?.getTime?.() - visualRange.value.startValue.getTime() >= HALFDAY
    || visualRange.value.endValue.getTime() - items[items.length - 1].date?.getTime?.() >= HALFDAY) {
    uploadDataByVisualRange(visualRange.value, component);
  }
}

function uploadDataByVisualRange({ startValue, endValue }: { startValue: Date; endValue: Date }, component: any): void {
  const dataSource = component.getDataSource();
  const ajaxArgs: AjaxArgs = {
    startVisible: getDateString(startValue),
    endVisible: getDateString(endValue),
  };

  if (!packetsLock) {
    packetsLock += 1;
    component.showLoadingIndicator();

    getDataFrame(ajaxArgs)
      .then((dataFrame) => {
        packetsLock -= 1;

        const componentStorage = dataSource.store();

        dataFrame
          .map((i: Record<string, any>) => ({
            date: new Date(i.Date),
            minTemp: i.MinTemp,
            maxTemp: i.MaxTemp,
          }))
          .forEach((item: Record<string, any>) => componentStorage.insert(item));

        dataSource.reload();

        onVisualRangeChanged();
      })
      .catch(() => {
        packetsLock -= 1;
        dataSource.reload();
      });
  }
}

function getDataFrame(args: AjaxArgs): Promise<any[]> {
  let params = '?';

  params += `startVisible=${args.startVisible}
        &endVisible=${args.endVisible}`;

  return fetch(`https://js.devexpress.com/Demos/NetCore/api/TemperatureData${params}`)
    .then((response) => response.json());
}

function getDateString(dateTime: Date | null): string {
  return dateTime ? dateTime.toLocaleDateString('en-US') : '';
}
</script>
<style>
#chart {
  height: 440px;
}
</style>
