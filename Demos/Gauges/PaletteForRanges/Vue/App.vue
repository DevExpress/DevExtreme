<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="105"
    >
      <DxScale
        :start-value="50"
        :end-value="150"
        :tick-interval="10"
      >
        <DxLabel
          :use-range-colors="true"
        />
      </DxScale>
      <DxRangeContainer
        palette="Pastel"
      >
        <DxRange
          :start-value="50"
          :end-value="90"
        />
        <DxRange
          :start-value="90"
          :end-value="130"
        />
        <DxRange
          :start-value="130"
          :end-value="150"
        />
      </DxRangeContainer>
      <DxTitle
        text="Temperature of the Liquid in the Boiler"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
      <DxExport
        :enabled="true"
      />
    </DxCircularGauge>
  </div>
</template>
<script>
import { DxCircularGauge, DxScale, DxLabel, DxRangeContainer, DxRange, DxTitle, DxFont, DxExport } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxLabel, DxRangeContainer, DxRange, DxTitle, DxFont, DxExport
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
