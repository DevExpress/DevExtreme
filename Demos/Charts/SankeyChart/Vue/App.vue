<template>
  <DxSankey
    id="sankey"
    :data-source="data"
    source-field="source"
    target-field="target"
    weight-field="weight"
    title="Commodity Turnover in 2017"
  >
    <DxTooltip
      :enabled="true"
      :customize-link-tooltip="customizeLinkTooltip"
    />
    <DxNode
      :width="8"
      :padding="30"
    />
    <DxLink color-mode="gradient"/>

  </DxSankey>
</template>
<script setup lang="ts">
import DxSankey, {
  DxTooltip,
  DxNode,
  DxLink,
} from 'devextreme-vue/sankey';
import { data } from './data.js';

const customizeLinkTooltip = ({ source, target, weight }) => (
  { html: `<b>From:</b> ${source}<br/><b>To:</b> ${target}<br/><b>Weight:</b> ${weight}` }
);
</script>
<style>
#sankey {
  height: 440px;
}
</style>
