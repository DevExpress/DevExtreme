<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="750"
    >
      <DxScale
        :start-value="0"
        :end-value="1000"
        :tick-interval="100"
        :minor-tick-interval="25"
      >
        <DxTick
          color="#9c9c9c"
        />
        <DxMinorTick
          :visible="true"
          color="#9c9c9c"
        />
      </DxScale>
      <DxRangeContainer
        background-color="none"
      />
      <DxTitle
        text="Fan Speed (in rpm)"
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
import { DxCircularGauge, DxScale, DxTick, DxMinorTick, DxRangeContainer, DxTitle, DxFont, DxExport } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxTick, DxMinorTick, DxRangeContainer, DxTitle, DxFont, DxExport
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
