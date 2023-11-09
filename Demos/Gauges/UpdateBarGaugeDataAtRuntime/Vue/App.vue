<template>
  <div>
    <div class="long-title">
      <h3>Colors Representation via Basic Colors</h3>
    </div>
    <div id="gauge-demo">
      <DxBarGauge
        id="gauge"
        :start-value="0"
        :end-value="255"
        :palette="palette"
        :values="values"
      >
        <DxLabel
          :visible="false"
        />
      </DxBarGauge>
      <div class="action-container">
        <DxSelectBox
          :width="150"
          :input-attr="{ 'aria-label': 'Color' }"
          :data-source="colors"
          v-model:value="value"
          display-expr="name"
          value-expr="code"
        />
        <div
          :style="{ 'background-color': value }"
          class="color-box"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DxBarGauge, DxLabel } from 'devextreme-vue/bar-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { colors } from './data.js';

const palette = ['#ff0000', '#00ff00', '#0000ff'];
const value = ref(colors[0].code);

const values = computed(() => getBasicColors(value.value));

function getBasicColors(selectValue) {
  const code = Number(`0x${selectValue.slice(1)}`);
  return [
    (code >> 16) & 0xff,
    (code >> 8) & 0xff,
    code & 0xff,
  ];
}
</script>
<style scoped>
#gauge-demo {
  height: 440px;
  width: 100%;
}

#gauge {
  width: 80%;
  height: 100%;
  margin-top: 20px;
  float: left;
}

.action-container {
  width: 20%;
  text-align: left;
  margin-top: 20px;
  float: left;
}

.color-box {
  width: 40px;
  height: 40px;
  margin-top: 20px;
}

.long-title h3 {
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
