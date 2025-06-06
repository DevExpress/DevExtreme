<template>
    <a href="#">{{ employee.Name }}</a>
</template>

<script setup lang="ts">
import { employees } from './data.ts';

const props = defineProps<{
  employeeID: number,
}>();

const employee = employees.find(e => e.ID === props.employeeID);
</script>
