<template>
  <div>
    <DxLinearGauge
      id="gauge"
      :value="value"
      :subvalues="subvalues"
    >
      <DxScale
        :start-value="0"
        :end-value="30"
        :tick-interval="5"
      >
        <DxTick
          color="#536878"
        />
        <DxLabel
          :indent-from-tick="-3"
        />
      </DxScale>
      <DxRangeContainer
        :offset="10"
      >
        <DxRange
          :start-value="0"
          :end-value="5"
          color="#92000A"
        />
        <DxRange
          :start-value="5"
          :end-value="20"
          color="#E6E200"
        />
        <DxRange
          :start-value="20"
          :end-value="30"
          color="#77DD77"
        />
      </DxRangeContainer>
      <DxValueIndicator
        :offset="20"
      />
      <DxSubvalueIndicator
        :offset="-15"
      />
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Issues Closed (with Min and Max Expected)"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxLinearGauge>
  </div>
</template>
<script>
import { DxLinearGauge, DxScale, DxTick, DxLabel, DxRangeContainer, DxRange, DxValueIndicator, DxSubvalueIndicator, DxExport, DxTitle, DxFont } from 'devextreme-vue/linear-gauge';

export default {
  components: {
    DxLinearGauge, DxScale, DxTick, DxLabel, DxRangeContainer, DxRange, DxValueIndicator, DxSubvalueIndicator, DxExport, DxTitle, DxFont
  },
  data() {
    return {
      subvalues: [5, 25],
      value: 17
    };
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
