<template>
  <div>
    <div id="gauge-demo">
      <DxCircularGauge
        id="gauge"
        :value="value.mean"
        :subvalues="[value.min, value.max]"
      >
        <DxScale
          :start-value="10"
          :end-value="40"
          :tick-interval="5"
        >
          <DxLabel
            :customize-text="customizeText"
          />
        </DxScale>
        <DxRangeContainer>
          <DxRange
            :start-value="10"
            :end-value="20"
            color="#0077BE"
          />
          <DxRange
            :start-value="20"
            :end-value="30"
            color="#E6E200"
          />
          <DxRange
            :start-value="30"
            :end-value="40"
            color="#77DD77"
          />
        </DxRangeContainer>
        <DxTooltip
          :enabled="true"
        />
        <DxTitle
          text="Temperature in the Greenhouse"
        >
          <DxFont
            :size="28"
          />
        </DxTitle>
      </DxCircularGauge>
      <DxSelectBox
        id="seasons"
        :width="150"
        :input-attr="{ 'aria-label': 'Season' }"
        :data-source="dataSource"
        v-model:value="selected"
        display-expr="name"
        value-expr="name"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  DxCircularGauge, DxScale, DxLabel, DxRangeContainer, DxRange, DxTooltip, DxTitle, DxFont,
} from 'devextreme-vue/circular-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { dataSource } from './data.ts';

const selected = ref(dataSource[0].name);
const value = computed(() => dataSource.find((item) => item.name === selected.value));

const customizeText = ({ valueText }) => `${valueText} °C`;
</script>
<style scoped>
#gauge-demo {
  height: 440px;
  width: 100%;
}

#gauge {
  width: 80%;
  height: 100%;
  float: left;
}

#seasons {
  width: 20%;
  float: left;
  text-align: left;
  margin-top: 20px;
}

</style>
