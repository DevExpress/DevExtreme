<template>
  <tr class="rows-content">
    <th>{{ year }}</th>
    <td>
      <DxSparkline
        :data-source="copperCosts"
        :show-min-max="true"
        :winloss-threshold="8000"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="winloss"
      >
        <DxTooltip :format="{ type: 'currency', precision: 2 }"/>
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
        <DxTooltip :format="{ type: 'currency', precision: 2 }"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="palladiumCosts"
        :winloss-threshold="2000"
        :value-field="year"
        class="sparkline"
        argument-field="month"
        type="winloss"
        first-last-color="#e55253"
        win-color="#7e4452"
        loss-color="#ebdd8f"
      >
        <DxTooltip :format="{ type: 'currency', precision: 2 }"/>
      </DxSparkline>
    </td>
  </tr>
</template>

<script setup lang="ts">
import DxSparkline, {
  DxTooltip,
} from 'devextreme-vue/sparkline';
import {
  copperCosts,
  nickelCosts,
  palladiumCosts,
} from './data.ts';

withDefaults(defineProps<{
  year?: string
}>(), {
  year: '',
});
</script>
<style>
.rows-content td {
  font-weight: 400;
  width: 200px;
  padding: 25px 10px 5px;
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
