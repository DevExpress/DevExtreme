<template>
  <button className="task__link-button">{{ employee?.Name }}</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { employees } from './data.ts';

const props = defineProps<{
  employeeID: number,
}>();

const employee = computed(() =>
  employees.find((e) => e.ID === props.employeeID),
);
</script>

<style>
.task__link-button {
  background: none;
  border: none;
  padding: 0;
  color: var(--dx-color-link);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
}
</style>
