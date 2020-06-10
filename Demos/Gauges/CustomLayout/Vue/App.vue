<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="value"
      :subvalues="subvalues"
    >
      <DxScale
        :start-value="0"
        :end-value="100"
        :tick-interval="10"
      >
        <DxTick
          color="#536878"
        />
        <DxLabel
          :indent-from-tick="3"
        />
      </DxScale>
      <DxRangeContainer
        :offset="10"
      >
        <DxRange
          :start-value="0"
          :end-value="30"
          color="#92000A"
        />
        <DxRange
          :start-value="30"
          :end-value="70"
          color="#E6E200"
        />
        <DxRange
          :start-value="70"
          :end-value="100"
          color="#77DD77"
        />
      </DxRangeContainer>
      <DxValueIndicator
        :offset="50"
      />
      <DxSubvalueIndicator
        :offset="-25"
      />
      <DxTitle
        text="Amount of Tickets Sold (with Min and Max Expected)"
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
import { DxCircularGauge, DxScale, DxTick, DxLabel, DxRangeContainer, DxRange, DxValueIndicator, DxSubvalueIndicator, DxTitle, DxFont, DxExport } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxTick, DxLabel, DxRangeContainer, DxRange, DxValueIndicator, DxSubvalueIndicator, DxTitle, DxFont, DxExport
  },
  data() {
    return {
      subvalues: [40, 90],
      value: 85
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
