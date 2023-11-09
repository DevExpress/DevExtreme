<template>
  <div :class="markTimeCell(cellData)">
    {{ cellData.text }}
    <div
      v-if="hasCoffeeCupIcon"
      class="cafe"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Utils from './utils.ts';

const props = withDefaults(defineProps<{
  cellData?: any
}>(), {
  cellData: () => {},
});

const hasCoffeeCupIcon = computed(() => {
  const { date } = props.cellData;
  return Utils.hasCoffeeCupIcon(date);
});

function markTimeCell(cellData) {
  return { dinner: Utils.isDinner(cellData.date) };
}
</script>
