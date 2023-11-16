<template>
  <DxPieChart
    :data-source="data"
    :animation="false"
  >
    <DxSeries
      argument-field="name"
      value-field="value"
    >
      <DxLabel
        :visible="true"
        :customize-text="customizeText"
      >
        <DxConnector
          :visible="true"
          :width="1"
        />
      </DxLabel>
    </DxSeries>
    <DxLegend :visible="false"/>
  </DxPieChart>
</template>
<script setup lang="ts">
import DxPieChart, {
  DxSeries,
  DxLabel,
  DxLegend,
  DxConnector,
} from 'devextreme-vue/pie-chart';

withDefaults(defineProps<{
  data?: {name: string, value: unknown}[]
}>(), {
  data: () => [],
});

const customizeText = (pointInfo) => `${pointInfo.argument[0].toUpperCase()}${pointInfo.argument.slice(1)}: $${pointInfo.value}M`;
</script>
