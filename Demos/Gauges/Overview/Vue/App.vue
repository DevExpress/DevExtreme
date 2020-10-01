<template>
  <div id="gauge-demo">
    <div id="gauge-container">
      <div class="left-section">
        <GaugeIndicator
          :value="speedValue / 2"
          :inverted="false"
          :start-angle="180"
          :end-angle="90"
        />
        <GaugeIndicator
          :value="speedValue / 2"
          :inverted="true"
          :start-angle="-90"
          :end-angle="-180"
        />
      </div>
      <div class="center-section">
        <DxCircularGauge :value="speedValue">
          <DxSize :width="260"/>
          <DxValueIndicator
            :second-fraction="0.24"
            type="twoColorNeedle"
            color="none"
            second-color="#f05b41"
          />
          <DxGeometry
            :start-angle="225"
            :end-angle="315"
          />
          <DxScale
            :start-value="20"
            :end-value="200"
            :tick-interval="20"
            :minor-tick-interval="10"
          />
        </DxCircularGauge>
        <div class="speed-value">
          <span>{{ speedValue }}</span>
        </div>
        <DxLinearGauge
          id="fuel-gauge"
          :value="50 - speedValue * 0.24"
        >
          <DxLinearSize
            :width="90"
            :height="20"
          />
          <DxLinearScale
            :start-value="0"
            :end-value="50"
            :tick-interval="25"
            :minor-tick-interval="12.5"
          >
            <DxMinorTick :visible="true"/>
            <DxLabel :visible="false"/>
          </DxLinearScale>
          <DxLinearValueIndicator
            :size="8"
            :offset="7"
            color="#f05b41"
          />
        </DxLinearGauge>
      </div>
      <div class="right-section">
        <GaugeIndicator
          :value="speedValue / 2"
          :inverted="true"
          :start-angle="90"
          :end-angle="0"
        />
        <GaugeIndicator
          :value="speedValue / 2"
          :inverted="false"
          :start-angle="0"
          :end-angle="-90"
        />
      </div>
    </div>
    <DxSlider
      id="slider"
      v-model:value="speedValue"
      :width="155"
      :min="0"
      :max="200"
    />
  </div>
</template>
<script>

import DxSlider from 'devextreme-vue/slider';
import DxCircularGauge, {
  DxSize,
  DxValueIndicator,
  DxGeometry,
  DxScale
} from 'devextreme-vue/circular-gauge';
import DxLinearGauge, {
  DxSize as DxLinearSize,
  DxValueIndicator as DxLinearValueIndicator,
  DxScale as DxLinearScale,
  DxMinorTick,
  DxLabel
} from 'devextreme-vue/linear-gauge';

import GaugeIndicator from './GaugeIndicator.vue';

export default {
  components: {
    DxSlider,

    DxCircularGauge,
    DxSize,
    DxValueIndicator,
    DxGeometry,
    DxScale,

    DxLinearGauge,
    DxLinearSize,
    DxLinearValueIndicator,
    DxLinearScale,
    DxMinorTick,
    DxLabel,

    GaugeIndicator
  },
  data: function() {
    return {
      speedValue: 40
    };
  }
};
</script>
<style src="./styles.css"></style>
