<template>
  <div>
    <div class="long-title">
      <h3>Current Price (with Min and Max)</h3>
    </div>
    <div id="gauge-demo">
      <DxLinearGauge
        id="c1"
        :value="24"
        :subvalues="[18, 43]"
      >
        <DxScale
          :start-value="10"
          :end-value="50"
          :tick-interval="10"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxSubvalueIndicator
          type="rectangle"
          color="#9B870C"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c2"
        :value="38"
        :subvalues="[18, 43]"
      >
        <DxScale
          :start-value="10"
          :end-value="50"
          :tick-interval="10"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxSubvalueIndicator
          type="rhombus"
          color="#779ECB"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c3"
        :value="21"
        :subvalues="[18, 43]"
      >
        <DxScale
          :start-value="10"
          :end-value="50"
          :tick-interval="10"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxSubvalueIndicator
          type="circle"
          color="#8FBC8F"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c4"
        :value="42"
        :subvalues="[18, 43]"
      >
        <DxScale
          :start-value="10"
          :end-value="50"
          :tick-interval="10"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxSubvalueIndicator
          type="textCloud"
          color="#734F96"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="c5"
        :value="28"
        :subvalues="[18, 43]"
      >
        <DxScale
          :start-value="10"
          :end-value="50"
          :tick-interval="10"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxSubvalueIndicator
          type="triangleMarker"
          color="#f05b41"
        />
      </DxLinearGauge>
    </div>
  </div>
</template>
<script>

import { DxLinearGauge, DxScale, DxSubvalueIndicator, DxLabel } from 'devextreme-vue/linear-gauge';

export default {
  components: {
    DxLinearGauge, DxScale, DxSubvalueIndicator, DxLabel
  },
  methods: {
    customizeText({ valueText }) {
      return `$${valueText}`;
    }
  }
};
</script>
<style scoped>
#gauge-demo {
    text-align: center;
    width: 100%;
}

#c1, #c2, #c3, #c4, #c5 {
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
