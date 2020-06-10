<template>
  <tr class="rows-content">
    <th>{{ year }}</th>
    <td>
      <DxSparkline
        :data-source="aluminumCosts"
        :show-min-max="true"
        :winloss-threshold="2100"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="winloss"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="nickelCosts"
        :show-min-max="true"
        :show-first-last="false"
        :winloss-threshold="19000"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="winloss"
        win-color="#6babac"
        loss-color="#8076bb"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="copperCosts"
        :winloss-threshold="8000"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="winloss"
        first-last-color="#e55253"
        win-color="#7e4452"
        loss-color="#ebdd8f"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
  </tr>
</template>

<script>
import DxSparkline, {
  DxTooltip,
} from 'devextreme-vue/sparkline';

import {
  aluminumCosts,
  nickelCosts,
  copperCosts } from './data.js';

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
      aluminumCosts,
      nickelCosts,
      copperCosts
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
