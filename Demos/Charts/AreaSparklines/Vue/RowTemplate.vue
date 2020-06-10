<template>
  <tr class="rows-content">
    <th>{{ year }}</th>
    <td>
      <DxSparkline
        :data-source="copperCosts"
        :show-min-max="true"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="area"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="nickelCosts"
        :point-size="6"
        :show-min-max="true"
        :show-first-last="false"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="splinearea"
        line-color="#8076bb"
        min-color="#6babac"
        max-color="#8076bb"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="palladiumCosts"
        :line-width="3"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="steparea"
        line-color="#7e4452"
        first-last-color="#e55253"
        point-color="#e8c267"
        point-symbol="polygon"
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
  copperCosts,
  nickelCosts,
  palladiumCosts } from './data.js';

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
      copperCosts,
      nickelCosts,
      palladiumCosts
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
