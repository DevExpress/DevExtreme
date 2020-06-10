<template>
  <DxPolarChart
    id="radarChart"
    :data-source="dataSource"
    title="Average temperature in London"
  >
    <DxCommonSeriesSettings
      :opacity="0.75"
      type="bar"
    />
    <DxSeries
      value-field="day"
      name="Day"
      color="#fdff5e"
    />
    <DxSeries
      value-field="night"
      name="Night"
      color="#0f3b59"
    />
    <DxCommonAnnotationSettings
      :opacity="0.7"
      :arrow-length="0"
      type="text"
    />
    <DxAnnotation
      :angle="45"
      :radius="180"
      text="WINTER"
    />
    <DxAnnotation
      :angle="135"
      :radius="180"
      text="SPRING"
    />
    <DxAnnotation
      :angle="225"
      :radius="180"
      text="SUMMER"
    />
    <DxAnnotation
      :angle="315"
      :radius="180"
      text="FALL"
    />
    <DxAnnotation
      :argument="maxDay.arg"
      :opacity="1"
      :offset-x="105"
      :padding-top-bottom="15"
      :padding-left-right="15"
      :text="maxTempText"
      series="Day"
    />
    <DxAnnotation
      :argument="minNight.arg"
      :opacity="1"
      :offset-x="105"
      :padding-top-bottom="15"
      :padding-left-right="15"
      :text="minTempText"
      series="Night"
    />
    <DxArgumentAxis>
      <DxStrip
        start-value="December"
        end-value="February"
        color="#0076d1"
      />
      <DxStrip
        start-value="March"
        end-value="May"
        color="#3ca3b0"
      />
      <DxStrip
        start-value="June"
        end-value="August"
        color="#3fbc1e"
      />
      <DxStrip
        start-value="September"
        end-value="November"
        color="#f0bb00"
      />
    </DxArgumentAxis>
    <DxLegend
      horizontal-alignment="center"
      vertical-alignment="bottom"
    />
  </DxPolarChart>
</template>
<script>

import {
  DxPolarChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxCommonAnnotationSettings,
  DxAnnotation,
  DxArgumentAxis,
  DxStrip,
  DxLegend
} from 'devextreme-vue/polar-chart';

import { dataSource, maxDay, minNight } from './data.js';

export default {

  components: {
    DxPolarChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxCommonAnnotationSettings,
    DxAnnotation,
    DxArgumentAxis,
    DxStrip,
    DxLegend
  },

  data() {
    return {
      dataSource,
      maxDay,
      minNight,
      maxTempText: `Highest temperature: ${maxDay.day} °C`,
      minTempText: `Lowest temperature: ${minNight.night} °C`
    };
  }
};
</script>
<style>
#radarChart {
    height: 600px;
}
</style>
