<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="12"
      :subvalues="[8, 18]"
    >
      <DxScale
        :start-value="0"
        :end-value="20"
        :tick-interval="5"
      />
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
      >
        <DxFont
          :size="40"
          color="#DCD0FF"
        />
      </DxTooltip>
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Rheostat Resistance"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxCircularGauge>
  </div>
</template>
<script setup lang="ts">
import {
  DxCircularGauge, DxScale, DxTooltip, DxFont, DxExport, DxTitle,
} from 'devextreme-vue/circular-gauge';

const customizeTooltip = ({ valueText }) => ({
  text: `${valueText} ohm`,
});
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}
</style>
