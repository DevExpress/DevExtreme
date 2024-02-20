<template>
  <div>
    <DxChart
      id="chart"
      :customize-point="customizePoint"
      :class="isFirstLevel ? 'pointer-on-bars' : ''"
      :data-source="dataSource"
      title="The Most Populated Countries by Continents"
      @point-click="onPointClick"
    >
      <DxSeries type="bar"/>
      <DxValueAxis :show-zero="false"/>
      <DxLegend :visible="false"/>
    </DxChart>
    <DxButton
      :visible="!isFirstLevel"
      class="button-container"
      text="Back"
      icon="chevronleft"
      @click="onButtonClick"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxChart,
  DxSeries,
  DxValueAxis,
  DxLegend,
} from 'devextreme-vue/chart';
import { DxButton } from 'devextreme-vue/button';
import service from './data.ts';

const isFirstLevel = ref(true);
const dataSource = ref(service.filterData(''));
const colors = ['#6babac', '#e55253'];

function customizePoint() {
  return {
    color: colors[Number(isFirstLevel.value)],
    hoverStyle: !isFirstLevel.value ? {
      hatching: 'none',
    } : {},
  };
}
function onPointClick({ target }) {
  if (isFirstLevel.value) {
    isFirstLevel.value = false;
    dataSource.value = service.filterData(target.originalArgument);
  }
}
function onButtonClick() {
  if (!isFirstLevel.value) {
    isFirstLevel.value = true;
    dataSource.value = service.filterData('');
  }
}
</script>
<style>
#chart {
  height: 440px;
  width: 100%;
}

#chart.pointer-on-bars .dxc-series rect {
  cursor: pointer;
}

.button-container {
  text-align: center;
  height: 40px;
  position: absolute;
  top: 7px;
  left: 0;
}
</style>
