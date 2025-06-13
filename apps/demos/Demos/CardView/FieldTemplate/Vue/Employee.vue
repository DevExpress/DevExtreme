<template>
    <a href="#">{{ employee.Name }}</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { employees } from './data.ts';

const props = defineProps<{
  employeeID: number,
}>();

const employee = computed(() =>
  employees.find(e => e.ID === props.employeeID)
);
</script>
