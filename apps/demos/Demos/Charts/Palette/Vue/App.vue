<template>
  <div>
    <div class="flex-container">
      <DxPieChart
        id="pie"
        :data-source="dataSource"
        :palette="palette"
        :palette-extension-mode="paletteExtensionMode"
      >
        <DxLegend :visible="false"/>
        <DxSeries/>
      </DxPieChart>

      <div class="palette-container flex-block">
        <div
          v-for="color in baseColors"
          :key="color"
          :style="{ 'background-color': color }"
          class="palette-item"
        />
      </div>
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <span>Palette</span>
          <DxSelectBox
            :items="paletteCollection"
            :input-attr="{ 'aria-label': 'Palette' }"
            v-model:value="palette"
          />
        </div>
        <div class="option">
          <span>Palette Extension Mode</span>
          <DxSelectBox
            :items="paletteExtensionModes"
            :input-attr="{ 'aria-label': 'Palette Extension Mode' }"
            v-model:value="paletteExtensionMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DxPieChart, {
  DxSeries,
  DxLegend,
} from 'devextreme-vue/pie-chart';
import DxSelectBox from 'devextreme-vue/select-box';
import { getPalette } from 'devextreme/viz/palette';
import { paletteCollection, paletteExtensionModes, dataSource } from './data.ts';

const palette = ref(paletteCollection[0]);
const paletteExtensionMode = ref(paletteExtensionModes[1]);
const baseColors = computed(() => getPalette(palette.value).simpleSet);
</script>

<style>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

#pie {
  height: 350px;
  width: 500px;
  margin: 20px;
}

.palette-container {
  float: left;
}

.palette-item {
  width: 40px;
  height: 40px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  display: inline-block;
  min-width: 320px;
  margin-top: 5px;
}

.option > span {
  margin: 0 10px 0 0;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}

.options-container {
  display: flex;
  align-items: center;
}

.options-container > .option {
  display: flex;
  align-items: baseline;
}
</style>
