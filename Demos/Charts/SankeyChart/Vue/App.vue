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
<script>

import DxSankey, {
  DxTooltip,
  DxNode,
  DxLink
} from 'devextreme-vue/sankey';

import { data } from './data.js';

export default {
  components: {
    DxSankey,
    DxTooltip,
    DxNode,
    DxLink
  },
  data() {
    return {
      data
    };
  },
  methods: {
    customizeLinkTooltip(info) {
      return {
        html: `<b>From:</b> ${info.source}<br/><b>To:</b> ${info.target}<br/><b>Weight:</b> ${info.weight}`
      };
    }
  }
};
</script>
<style>
#sankey {
    height: 440px;
}
</style>
