<template>
  <DxFunnel
    id="pyramid"
    :data-source="dataSource"
    :sort-data="false"
    :inverted="true"
    algorithm="dynamicHeight"
    palette="Harmony Light"
    argument-field="level"
    value-field="count"
  >
    <DxTitle text="Team Composition">
      <DxMargin :bottom="30"/>
    </DxTitle>
    <DxTooltip :enabled="true"/>
    <DxItem>
      <DxBorder :visible="true"/>
    </DxItem>
    <DxLegend :visible="true"/>
    <DxLabel
      :visible="true"
      horizontal-alignment="left"
      background-color="none"
    >
      <DxFont :size="16"/>
    </DxLabel>
  </DxFunnel>
</template>

<script setup lang="ts">
import DxFunnel, {
  DxTitle,
  DxMargin,
  DxTooltip,
  DxItem,
  DxBorder,
  DxLegend,
  DxLabel,
  DxFont,
} from 'devextreme-vue/funnel';
import { dataSource } from './data.js';
</script>

<style>
#pyramid {
  height: 440px;
}
</style>
