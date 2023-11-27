<template>
  <DxChart
    id="container"
    :data-source="olympicAchievements"
    title="Australian Olympic Medal Count"
  >
    <DxCommonSeriesSettings
      type="stepline"
      argument-field="year"
    >
      <DxPoint :visible="false"/>
    </DxCommonSeriesSettings>
    <DxSeries
      v-for="medal in medalSources"
      :key="medal.value"
      :value-field="medal.value"
      :name="medal.name"
      :color="medal.color"
    />
    <DxArgumentAxis>
      <DxLabel>
        <DxFormat type="decimal"/>
      </DxLabel>
    </DxArgumentAxis>
    <DxLegend
      vertical-alignment="bottom"
      horizontal-alignment="center"
    />
    <DxExport :enabled="true"/>
  </DxChart>
</template>
<script setup lang="ts">
import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxCommonSeriesSettings,
  DxExport,
  DxLegend,
  DxPoint,
  DxLabel,
  DxFormat,
} from 'devextreme-vue/chart';
import { medalSources, olympicAchievements } from './data.ts';
</script>
<style>
#container {
  height: 440px;
}
</style>
