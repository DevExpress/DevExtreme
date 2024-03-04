<template>
  <div>
    <DxBarGauge
      id="gauge"
      :start-value="startValue"
      :end-value="50"
      :base-value="0"
      :values="values"
      palette="Ocean"
    >
      <DxLabel
        :customize-text="customizeText"
      />
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Deviations in the Manufactured Parts"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxBarGauge>
  </div>
</template>
<script setup lang="ts">
import {
  DxBarGauge, DxLabel, DxExport, DxTitle, DxFont,
} from 'devextreme-vue/bar-gauge';

const startValue = -50;
const values = [-21.3, 14.8, -30.9, 45.2];
const customizeText = ({ valueText }) => `${valueText} mm`;
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}
</style>
