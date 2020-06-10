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
<script>
import { DxBarGauge, DxLabel, DxTooltip, DxExport, DxTitle, DxFont, DxLegend } from 'devextreme-vue/bar-gauge';

export default {
  components: {
    DxBarGauge, DxLabel, DxTooltip, DxExport, DxTitle, DxFont, DxLegend
  },
  data() {
    return {
      values: [121.4, 135.4, 115.9, 141.1, 127.5]
    };
  },
  methods: {
    getText(item, text) {
      return `Racer ${(item.index + 1)} - ${text} km/h`;
    },
    customizeTooltip(arg) {
      return {
        text: this.getText(arg, arg.valueText)
      };
    },
    customizeText(arg) {
      return this.getText(arg.item, arg.text);
    }
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
