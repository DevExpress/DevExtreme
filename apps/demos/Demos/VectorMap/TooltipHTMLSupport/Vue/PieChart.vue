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
    <DxSize
      :width="400"
      :height="200"
    />
  </DxPieChart>
</template>
<script setup lang="ts">
import DxPieChart, {
  DxSeries,
  DxLabel,
  DxLegend,
  DxConnector,
  DxSize,
} from 'devextreme-vue/pie-chart';

withDefaults(defineProps<{
  data?: unknown[]
}>(), {
  data: () => [],
});

const customizeText = ({ argument, value }) => `${argument[0].toUpperCase()}${argument.slice(1)}: $${value}M`;
</script>
