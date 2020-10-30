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
<script>

import DxPieChart, {
  DxSeries,
  DxLabel,
  DxLegend,
  DxConnector,
  DxSize
} from 'devextreme-vue/pie-chart';

export default {
  components: {
    DxPieChart,
    DxSeries,
    DxLabel,
    DxLegend,
    DxConnector,
    DxSize
  },
  props: {
    data: {
      type: Array,
      default: ()=>[]
    }
  },
  methods: {
    customizeText(pointInfo) {
      return `${pointInfo.argument[0].toUpperCase()}${
        pointInfo.argument.slice(1)
      }: $${pointInfo.value}M`;
    }
  },
};
</script>
