<template>
  <div>
    <div class="long-title">
      <h3>Average temperature in London</h3>
    </div>
    <div id="chart-demo">
      <DxPolarChart
        id="radarChart"
        :data-source="dataSource"
      >
        <DxCommonSeriesSettings :type="currentType"/>
        <DxSeries
          value-field="day"
          name="Day"
          color="#ba4d51"
        />
        <DxSeries
          value-field="night"
          name="Night"
          color="#5f8b95"
        />
        <DxMargin
          :top="50"
          :bottom="50"
          :left="100"
        />
      </DxPolarChart>
      <div class="center">
        <div>Series Type</div>&nbsp;
        <DxSelectBox
          :width="200"
          :data-source="types"
          v-model:value="currentType"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxPolarChart,
  DxCommonSeriesSettings,
  DxSeries,
  DxMargin
} from 'devextreme-vue/polar-chart';
import DxSelectBox from 'devextreme-vue/select-box';

import { types, dataSource } from './data.js';

export default {

  components: {
    DxSelectBox,
    DxPolarChart,
    DxCommonSeriesSettings,
    DxSeries,
    DxMargin
  },

  data() {
    return {
      types,
      dataSource,
      currentType: types[0]
    };
  }
};
</script>
<style>
#chart-demo {
	height: 600px;
}

#radarChart {
	height: 500px;
}

#chart-demo > .center {
	text-align: center;
}

#chart-demo > .center > div,
#chart-demo > .center > .dx-widget {
	display: inline-block;
	vertical-align: middle;
}

.long-title h3 {
	font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
	font-weight: 200;
	font-size: 28px;
	text-align: center;
	margin-bottom: 20px;
}
</style>
