<template>
  <div>
    <div class="long-title">
      <h3>Power of Engines</h3>
    </div>
    <div id="gauge-demo">
      <DxCircularGauge
        id="rectangleNeedle"
        :value="75"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="rectangleNeedle"
          color="#9B870C"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="twoColorNeedle"
        :value="80"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="twoColorNeedle"
          color="#779ECB"
          second-color="#734F96"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="triangleNeedle"
        :value="65"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="triangleNeedle"
          color="#8FBC8F"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="rangebar"
        :value="90"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="rangeBar"
          color="#f05b41"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="textCloud"
        :value="70"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="textCloud"
          color="#483D8B"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="triangleMarker"
        :value="85"
      >
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="50"
        >
          <DxLabel :customize-text="customizeText"/>
        </DxScale>
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxValueIndicator
          type="triangleMarker"
          color="#e0e33b"
        />
      </DxCircularGauge>
    </div>
  </div>
</template>
<script>

import { DxCircularGauge, DxScale, DxLabel, DxGeometry, DxValueIndicator } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxLabel, DxGeometry, DxValueIndicator
  },

  methods: {
    customizeText({ valueText }) {
      return `${valueText} %`;
    }
  }
};

</script>
<style scoped>
#chart-demo {
    width: 100%;
}

#rectangleNeedle, #twoColorNeedle, #triangleNeedle, #rangebar, #textCloud, #triangleMarker {
    display: inline-block;
}

#rectangleNeedle, #twoColorNeedle, #rangebar, #textCloud {
    margin-right: 4px;
}

#rectangleNeedle, #twoColorNeedle, #triangleNeedle {
    width: 33%;
}

#rangebar, #triangleMarker {
    width: 32%;
}

#textCloud {
    width: 35%;
    vertical-align: bottom;
}

.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
