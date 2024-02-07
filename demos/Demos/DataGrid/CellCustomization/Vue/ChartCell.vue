<template>
  <div class="chart-cell">
    <DxSparkline
      :data-source="dayClose"
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
<script setup lang="ts">
import {
  DxSparkline,
  DxSize,
  DxTooltip,
} from 'devextreme-vue/sparkline';

import { DayClose } from './data.ts';

defineProps<{
  dayClose: DayClose[]
}>();
</script>
