<template>
  <div id="range-selector-demo">
    <DxRangeSelector
      id="range-selector"
      :data-source="dataSource"
      v-model:value="range"
      title="Copper Production in 2013"
    >
      <DxChart>
        <DxSeries
          argument-field="country"
          type="bar"
          value-field="copper"
        />
      </DxChart>
    </DxRangeSelector>
    <h2>Total: {{ format(totalProduction) }} tons</h2>
  </div>
</template>
<script>
import { dataSource } from './data.js';
import {
  DxRangeSelector,
  DxChart,
  DxSeries
} from 'devextreme-vue/range-selector';

export default {
  components: {
    DxRangeSelector,
    DxChart,
    DxSeries
  },
  data() {
    return {
      dataSource,
      range: []
    };
  },
  computed: {
    totalProduction() {
      let startIndex = 0;
      let endIndex = dataSource.length;

      dataSource.forEach((item, index) => {
        if (item.country == this.range[0]) {
          startIndex = index;
        }
        if (item.country == this.range[1]) {
          endIndex = index + 1;
        }
      });
      return dataSource
        .slice(startIndex, endIndex)
        .reduce((total, item) => total + item.copper, 0);
    }
  },
  methods: {
    format: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format
  }
};
</script>
<style scoped>
#range-selector-demo {
    text-align: center;
}

#range-selector {
    margin-bottom: 20px;
    height: 200px;
}
</style>
