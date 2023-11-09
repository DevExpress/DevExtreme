<template>
  <div>
    <DxLinearGauge
      id="gauge"
      :value="35"
    >
      <DxGeometry
        orientation="vertical"
      />
      <DxScale
        :start-value="0"
        :end-value="50"
        :custom-ticks="customTicks"
      />
      <DxTitle
        text="Fuel Volume (in Liters)"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
      <DxExport
        :enabled="true"
      />
    </DxLinearGauge>
  </div>
</template>
<script setup lang="ts">
import {
  DxLinearGauge, DxGeometry, DxScale, DxTitle, DxFont, DxExport,
} from 'devextreme-vue/linear-gauge';

const customTicks = [0, 10, 25, 50];
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}
</style>
