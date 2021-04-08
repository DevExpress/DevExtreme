<template>
  <div>
    <div class="long-title">
      <h3>Available Disk Space</h3>
    </div>
    <div id="gauge-demo">
      <DxLinearGauge
        id="c1"
        :value="75"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="rectangle"
          color="#9B870C"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c2"
        :value="80"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="rhombus"
          color="#779ECB"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c3"
        :value="65"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="circle"
          color="#8FBC8F"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c4"
        :value="90"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="rangeBar"
          color="#483D8B"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c5"
        :value="70"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="textCloud"
          color="#734F96"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c6"
        :value="85"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxValueIndicator
          type="triangleMarker"
          color="#f05b41"
        />
      </DxLinearGauge>
    </div>
  </div>
</template>
<script>
import { DxLinearGauge, DxScale, DxLabel, DxValueIndicator } from 'devextreme-vue/linear-gauge';

export default {
  components: {
    DxLinearGauge, DxScale, DxLabel, DxValueIndicator
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} %`;
    }
  }
};
</script>
<style scoped>
#gauge-demo {
    width: 100%;
}

#c1, #c2, #c3, #c4, #c5, #c6 {
    height: 110px;
}

.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
