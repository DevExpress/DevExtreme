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
<script>
import {
  DxChart,
  DxSeries,
  DxValueAxis,
  DxLegend,
} from 'devextreme-vue/chart';

import { DxButton } from 'devextreme-vue/button';

import service from './data.js';

const colors = ['#6babac', '#e55253'];

export default {
  components: {
    DxChart,
    DxSeries,
    DxValueAxis,
    DxLegend,
    DxButton
  },

  data() {
    return {
      isFirstLevel: true,
      dataSource: service.filterData(''),
    };
  },

  methods: {
    customizePoint() {
      return {
        color: colors[Number(this.isFirstLevel)],
        hoverStyle: !this.isFirstLevel ? {
          hatching: 'none'
        } : {}
      };
    },
    onPointClick({ target }) {
      if (this.isFirstLevel) {
        this.isFirstLevel = false;
        this.dataSource = service.filterData(target.originalArgument);
      }
    },
    onButtonClick() {
      if (!this.isFirstLevel) {
        this.isFirstLevel = true;
        this.dataSource = service.filterData('');
      }
    }
  }
};
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
    left: 0px;
}
</style>
