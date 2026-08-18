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
        <DxCircularGauge
          :value="speedValue"
          center-template="centerTemplate"
        >
          <DxSize :width="260"/>
          <DxValueIndicator
            :indent-from-center="55"
            :color="color"
            :spindle-size="0"
            :spindle-gap-size="0"
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
          <template #centerTemplate="data">
            <svg>
              <circle
                cx="100"
                cy="100"
                r="55"
                stroke-width="2"
                :stroke="color"
                fill="transparent"
              />
              <text
                text-anchor="middle"
                x="100"
                y="100"
                font-size="50"
                font-weight="lighter"
                alignment-baseline="middle"
                :fill="color"
              >{{ data.data.value() }}</text>
            </svg>
          </template>
        </DxCircularGauge>
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
            :color="color"
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
<script setup lang="ts">
import { ref } from 'vue';
import DxSlider from 'devextreme-vue/slider';
import DxCircularGauge, {
  DxSize,
  DxValueIndicator,
  DxGeometry,
  DxScale,
} from 'devextreme-vue/circular-gauge';
import DxLinearGauge, {
  DxSize as DxLinearSize,
  DxValueIndicator as DxLinearValueIndicator,
  DxScale as DxLinearScale,
  DxMinorTick,
  DxLabel,
} from 'devextreme-vue/linear-gauge';
import GaugeIndicator from './GaugeIndicator.vue';

const speedValue = ref(40);
const color = '#f05b41';
</script>
<style>
#gauge-demo {
  height: 500px;
}

#gauge-container {
  text-align: center;
  margin: 20px auto;
  background-image: url('../../../../images/Gauges/mask.png');
  background-repeat: no-repeat;
  width: 786px;
  height: 500px;
}

#gauge-container > div {
  display: inline-block;
  position: relative;
}

.left-section {
  top: -20px;
  left: -44px;
}

.center-section {
  top: 25px;
}

.right-section {
  top: -20px;
  right: -44px;
}

#fuel-gauge {
  position: absolute;
  left: 34%;
  bottom: 5%;
}

#slider {
  position: relative;
  top: -105px;
  margin: 0 auto;
}

#slider .dx-slider-bar {
  background-color: var(--dxds-color-surface-neutral-default-rest, #fff);
}

#slider .dx-slider-handle {
  background-color: var(--dxds-color-surface-utility-orange-default-rest, #f05b41);
  width: 16px;
  height: 16px;
  margin-top: -8px;
  margin-right: -8px;
  border-radius: 50%;
  border: none;
}

#slider .dx-slider-handle .dx-inkripple-wave {
  background: none;
}

#slider .dx-slider-handle::after {
  background-color: var(--dxds-color-surface-utility-orange-default-rest, #f05b41);
}

#slider .dx-slider-range.dx-slider-range-visible {
  border-color: var(--dxds-color-surface-utility-orange-default-rest, #f05b41);
  background-color: var(--dxds-color-surface-utility-orange-default-rest, #f05b41);
}
</style>
