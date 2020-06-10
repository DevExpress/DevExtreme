<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="2200"
      :subvalues="[2700]"
    >
      <DxScale
        :start-value="0"
        :end-value="3000"
        :tick-interval="500"
      >
        <DxLabel
          :customize-text="customizeText"
        />
      </DxScale>
      <DxSubvalueIndicator
        type="textCloud"
      >
        <DxText
          :format="format"
          :customize-text="customizeText"
        />
      </DxSubvalueIndicator>
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Oven Temperature (includes Recommended)"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxCircularGauge>
  </div>
</template>
<script>
import { DxCircularGauge, DxScale, DxLabel, DxSubvalueIndicator, DxText, DxExport, DxTitle, DxFont } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxLabel, DxSubvalueIndicator, DxText, DxExport, DxTitle, DxFont
  },
  data() {
    return {
      format: {
        type: 'thousands',
        precision: 1
      }
    };
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} °C`;
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
