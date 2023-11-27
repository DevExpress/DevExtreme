<template>
  <div>
    <div id="gauge-demo">
      <DxLinearGauge
        id="gauge"
        :value="value.primary"
        :subvalues="value.secondary"
      >
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="2"
        >
          <DxLabel
            :customize-text="customizeText"
          />
        </DxScale>
        <DxTooltip
          :enabled="true"
          :customize-tooltip="customizeTooltip"
        />
        <DxExport
          :enabled="true"
        />
        <DxTitle
          text="Power of Air Conditioners in Store Departments (kW)"
        >
          <DxFont
            :size="28"
          />
        </DxTitle>
      </DxLinearGauge>
      <DxSelectBox
        id="selectbox"
        :data-source="dataSource"
        v-model:value="selected"
        :input-attr="{ 'aria-label': 'Department' }"
        :width="200"
        display-expr="name"
        value-expr="name"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxLinearGauge, DxScale, DxLabel, DxTooltip, DxExport, DxTitle, DxFont,
} from 'devextreme-vue/linear-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { dataSource } from './data.ts';

const selected = ref(dataSource[0].name);
const value = computed(() => dataSource.find((item) => item.name === selected.value));
const customizeText = ({ valueText }) => `${valueText} kW`;
function customizeTooltip(scaleValue) {
  let result = `${scaleValue.valueText} kW`;

  if (scaleValue.index >= 0) {
    result = `Secondary ${scaleValue.index + 1}: ${result}`;
  } else {
    result = `Primary: ${result}`;
  }
  return {
    text: result,
  };
}
</script>
<style scoped>
#gauge-demo {
  height: 440px;
  width: 100%;
}

#gauge {
  height: 400px;
}
</style>
