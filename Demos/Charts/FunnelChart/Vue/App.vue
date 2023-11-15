<template>
  <DxFunnel
    id="funnel"
    :data-source="dataSource"
    palette="Soft Pastel"
    argument-field="argument"
    value-field="value"
  >
    <DxTitle text="Website Conversions">
      <DxMargin :bottom="30"/>
    </DxTitle>
    <DxExport :enabled="true"/>
    <DxTooltip
      :enabled="true"
      format="fixedPoint"
    />
    <DxItem>
      <DxBorder :visible="true"/>
    </DxItem>
    <DxLabel
      :visible="true"
      :customize-text="formatLabel"
      position="inside"
      background-color="none"
    />
  </DxFunnel>
</template>

<script setup lang="ts">
import DxFunnel, {
  DxTitle,
  DxMargin,
  DxExport,
  DxTooltip,
  DxItem,
  DxBorder,
  DxLabel,
} from 'devextreme-vue/funnel';
import { dataSource } from './data.js';

const formatLabel = ({ percentText, item: { argument } }) => `<span class="label">${percentText}</span><br/>${argument}`;
</script>

<style>
#funnel {
  height: 440px;
}

#funnel .label {
  font-size: 28px;
}
</style>
