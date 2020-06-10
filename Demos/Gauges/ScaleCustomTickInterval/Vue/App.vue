<template>
  <div>
    <DxLinearGauge
      id="gauge"
      :value="4.3"
    >
      <DxScale
        :start-value="0"
        :end-value="5"
        :tick-interval="2.5"
        :minor-tick-interval="0.625"
      >
        <DxMinorTick
          :visible="true"
        />
      </DxScale>
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="TV Show Rating"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxLinearGauge>
  </div>
</template>
<script>
import { DxLinearGauge, DxScale, DxMinorTick, DxExport, DxTitle, DxFont } from 'devextreme-vue/linear-gauge';

export default {
  components: {
    DxLinearGauge, DxScale, DxMinorTick, DxExport, DxTitle, DxFont
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
