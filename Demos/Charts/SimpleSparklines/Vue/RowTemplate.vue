<template>
  <tr class="rows-content">
    <th>{{ year }}</th>
    <td>
      <DxSparkline
        :data-source="oilCosts"
        :show-min-max="true"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="line"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="goldCosts"
        :line-width="3"
        :show-min-max="true"
        :show-first-last="false"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="spline"
        line-color="#9ab57e"
        min-color="#6babac"
        max-color="#ebdd8f"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="silverCosts"
        :point-size="6"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="stepline"
        line-color="#e8c267"
        first-last-color="#e55253"
        point-symbol="square"
        point-color="#ebdd8f"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
  </tr>
</template>

<script>
import DxSparkline, {
  DxTooltip
} from 'devextreme-vue/sparkline';

import {
  oilCosts,
  goldCosts,
  silverCosts } from './data.js';

export default {
  components: {
    DxSparkline,
    DxTooltip
  },
  props: {
    year:{
      type: String,
      default() {}
    }
  },
  data() {
    return {
      oilCosts,
      goldCosts,
      silverCosts
    };
  }
};
</script>

<style>
.rows-content td {
    font-weight: 400;
    width: 200px;
    padding: 25px 10px 5px 10px;
    border: 1px solid #c2c2c2;
}

.rows-content tr:nth-child(2) td {
    border-top: 1px solid #c2c2c2;
}

.rows-content td:first-of-type {
    border-left: 1px solid #c2c2c2;
}

.rows-content .sparkline {
    width: 200px;
    height: 30px;
}
</style>
