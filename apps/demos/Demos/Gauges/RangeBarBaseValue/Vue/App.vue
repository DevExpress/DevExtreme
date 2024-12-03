<template>
  <div>
    <div class="long-title">
      <h3>Deviation from the Target (Horizontal and Vertical)</h3>
    </div>
    <div id="gauge-demo">
      <DxCircularGauge
        id="c1"
        :value="20"
      >
        <DxGeometry
          :start-angle="135"
          :end-angle="45"
        />
        <DxScale
          :start-value="45"
          :end-value="-45"
          :tick-interval="45"
        >
          <DxLabel
            :customize-text="customizeText"
          />
        </DxScale>
        <DxValueIndicator
          :base-value="0"
          type="rangeBar"
        />
      </DxCircularGauge>
      <DxLinearGauge
        id="c2"
        :value="-10"
      >
        <dx-linear-geometry
          orientation="vertical"
        />
        <dx-linear-scale
          :start-value="-45"
          :end-value="45"
          :tick-interval="45"
        >
          <dx-linear-label
            :customize-text="customizeText"
          />
        </dx-linear-scale>
        <dx-linear-value-indicator
          :base-value="0"
        />
      </DxLinearGauge>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  DxCircularGauge, DxGeometry, DxScale, DxLabel, DxValueIndicator,
} from 'devextreme-vue/circular-gauge';
import {
  DxLinearGauge,
  DxGeometry as DxLinearGeometry,
  DxScale as DxLinearScale,
  DxLabel as DxLinearLabel,
  DxValueIndicator as DxLinearValueIndicator,
} from 'devextreme-vue/linear-gauge';

const customizeText = ({ valueText }) => `${valueText}°`;
</script>
<style scoped>
#gauge-demo {
  height: 440px;
  width: 100%;
}

#c1 {
  width: 70%;
  height: 100%;
  float: left;
}

#c2 {
  width: 30%;
  height: 100%;
  float: left;
}

.long-title h3 {
  font-family:
    'Segoe UI Light',
    'Helvetica Neue Light',
    'Segoe UI',
    'Helvetica Neue',
    'Trebuchet MS',
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
