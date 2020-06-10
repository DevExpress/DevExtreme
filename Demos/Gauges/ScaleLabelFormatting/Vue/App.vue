<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="45"
    >
      <DxScale
        :start-value="0"
        :end-value="100"
        :tick-interval="10"
      >
        <DxLabel
          :customize-text="customizeText"
        />
      </DxScale>
      <DxRangeContainer>
        <DxRange
          :start-value="0"
          :end-value="20"
          color="#CE2029"
        />
        <DxRange
          :start-value="20"
          :end-value="50"
          color="#FFD700"
        />
        <DxRange
          :start-value="50"
          :end-value="100"
          color="#228B22"
        />
      </DxRangeContainer>
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Battery Charge"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxCircularGauge>
  </div>
</template>
<script>
import { DxCircularGauge, DxScale, DxLabel, DxRangeContainer, DxRange, DxExport, DxTitle, DxFont } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxLabel, DxRangeContainer, DxRange, DxExport, DxTitle, DxFont
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} %`;
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
