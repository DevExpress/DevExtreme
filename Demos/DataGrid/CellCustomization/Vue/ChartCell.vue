<template>
  <div class="chart-cell">
    <DxSparkline
      :data-source="cellData"
      :show-min-max="true"
      :point-size="6"
      argument-field="date"
      value-field="close"
      type="line"
      min-color="#f00"
      max-color="#2ab71b"
    >
      <DxSize
        :width="290"
        :height="40"
      />
      <DxTooltip :enabled="false"/>
    </DxSparkline>
  </div>
</template>
<script>
import {
  DxSparkline,
  DxSize,
  DxTooltip
} from 'devextreme-vue/sparkline';

export default {
  components: {
    DxSparkline,
    DxSize,
    DxTooltip
  },
  props: {
    cellData: {
      type: Array,
      default: () => []
    }
  }
};
</script>
