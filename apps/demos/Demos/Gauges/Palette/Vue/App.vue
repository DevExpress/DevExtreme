<template>
  <div>
    <DxBarGauge
      id="gauge"
      :start-value="-5"
      :end-value="5"
      :base-value="0"
      :values="values"
      palette="Ocean"
    >
      <DxLabel
        format="##.## mm;-##.## mm"
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

const values = [-2.13, 1.48, -3.09, 4.52, 4.9, 3.9];
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}
</style>
