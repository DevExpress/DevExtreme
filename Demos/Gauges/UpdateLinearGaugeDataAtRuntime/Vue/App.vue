<template>
  <div>
    <div class="long-title">
      <h3>Weather Indicators</h3>
    </div>
    <div id="gauge-demo">
      <DxLinearGauge
        id="temperatureGauge"
        :value="value.data.temperature"
        class="gauge-element"
      >
        <DxTitle
          text="Temperature (°C)"
        >
          <DxFont
            :size="16"
          />
        </DxTitle>
        <DxGeometry
          orientation="vertical"
        />
        <DxScale
          :start-value="-40"
          :end-value="40"
          :tick-interval="40"
        />
        <DxRangeContainer
          background-color="none"
        >
          <DxRange
            :start-value="-40"
            :end-value="0"
            color="#679EC5"
          />
          <DxRange
            :start-value="0"
            :end-value="40"
          />
        </DxRangeContainer>
      </DxLinearGauge>
      <DxLinearGauge
        id="humidityGauge"
        :value="value.data.humidity"
        class="gauge-element"
      >
        <DxTitle
          text="Humidity (%)"
        >
          <DxFont
            :size="16"
          />
        </DxTitle>
        <DxGeometry
          orientation="vertical"
        />
        <DxScale
          :start-value="0"
          :end-value="100"
          :tick-interval="10"
        />
        <DxRangeContainer
          background-color="#CACACA"
        />
        <DxValueIndicator
          type="rhombus"
          color="#A4DDED"
        />
      </DxLinearGauge>
      <DxLinearGauge
        id="pressureGauge"
        :value="value.data.pressure"
        class="gauge-element"
      >
        <DxTitle
          text="Barometric Pressure (mb)"
        >
          <DxFont
            :size="16"
          />
        </DxTitle>
        <DxGeometry
          orientation="vertical"
        />
        <DxScale
          :start-value="900"
          :end-value="1100"
          :custom-ticks="customTicks"
        >
          <DxLabel
            :format="pressureLabelFormat"
          />
        </DxScale>
        <DxRangeContainer>
          <DxRange
            :start-value="900"
            :end-value="1000"
            color="#679EC5"
          />
          <DxRange
            :start-value="1000"
            :end-value="1020"
            color="#A6C567"
          />
          <DxRange
            :start-value="1020"
            :end-value="1100"
            color="#E18E92"
          />
        </DxRangeContainer>
        <DxValueIndicator
          type="circle"
          color="#E3A857"
        />
      </DxLinearGauge>
    </div>
    <DxSelectBox
      id="selectbox"
      :data-source="cities"
      :input-attr="{ 'aria-label': 'City' }"
      v-model:value="selected"
      display-expr="name"
      value-expr="name"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  DxLinearGauge,
  DxTitle,
  DxFont,
  DxGeometry,
  DxScale,
  DxRangeContainer,
  DxRange,
  DxValueIndicator,
  DxLabel,
} from 'devextreme-vue/linear-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { cities } from './data.ts';

const selected = ref(cities[0].name);
const customTicks = [900, 1000, 1020, 1100];
const pressureLabelFormat = { type: 'decimal' };
const value = computed(() => cities.find(({ name }) => name === selected.value));
</script>
<style scoped>
#gauge-demo {
  width: 90%;
  margin: 0 auto;
}

#gauge-demo .gauge-element {
  height: 400px;
  width: 33%;
  float: left;
}

.dx-selectbox {
  margin: 10px auto 0;
  width: 200px;
}

#gauge-demo::after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
}

.long-title h3 {
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
