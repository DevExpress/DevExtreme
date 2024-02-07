<template>
  <tr class="rows-content">
    <th>{{ year }}</th>
    <td>
      <DxSparkline
        :data-source="source"
        :show-min-max="true"
        :value-field="getValueField('alum')"
        class="sparkline"
        argument-field="month"
        type="bar"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="source"
        :show-min-max="true"
        :show-first-last="false"
        :value-field="getValueField('nickel')"
        class="sparkline"
        argument-field="month"
        type="bar"
        bar-positive-color="#6babac"
        min-color="#9ab57e"
        max-color="#8076bb"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
    <td>
      <DxSparkline
        :data-source="source"
        :value-field="getValueField('copper')"
        class="sparkline"
        argument-field="month"
        type="bar"
        bar-positive-color="#e55253"
        first-last-color="#ebdd8f"

        point-color="#e8c267"
      >
        <DxTooltip format="currency"/>
      </DxSparkline>
    </td>
  </tr>
</template>

<script setup lang="ts">
import DxSparkline, {
  DxTooltip,
} from 'devextreme-vue/sparkline';

const props = withDefaults(defineProps<{
  year?: string
  source?: object
}>(), {
  year: '',
  source: () => ({}),
});

const getValueField = (name) => name + props.year;
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
