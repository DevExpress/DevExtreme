<template>
  <div>
    <DxBarGauge
      id="gauge"
      :start-value="0"
      :end-value="200"
      :values="values"
    >
      <DxLabel
        :visible="false"
      />
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      />
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Average Speed by Racer"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
      <DxLegend
        :visible="true"
        :customize-text="customizeText"
        vertical-alignment="bottom"
        horizontal-alignment="center"
      />
    </DxBarGauge>
  </div>
</template>
<script setup lang="ts">
import {
  DxBarGauge, DxLabel, DxTooltip, DxExport, DxTitle, DxFont, DxLegend,
} from 'devextreme-vue/bar-gauge';

const values = [121.4, 135.4, 115.9, 141.1, 127.5];
const getText = (item: any, text: string) => `Racer ${(item.index + 1)} - ${text} km/h`;
const customizeTooltip = (arg: Record<string, any>) => ({
  text: getText(arg, arg.valueText),
});
const customizeText = (arg: Record<string, any>) => getText(arg.item, arg.text);
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}
</style>
