<template>
  <div :className="priorityClassName">
    <div className="task__indicator"/>
    <div>{{ priority?.text }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { priorities } from './data.ts';

const props = defineProps<{
  priorityID: number,
}>();

const priority = computed(() =>
  priorities.find((p) => p.id === props.priorityID),
);
const priorityClassName = computed(() =>
  `task__priority task__priority--${priority.value?.postfix || ''}`,
);
</script>

<style>
.task__priority {
  display: flex;
  align-items: center;
}

.task__priority--low {
  color: var(--dxds-color-content-utility-green-default-rest);
}

.task__priority--normal {
  color: var(--dxds-color-content-utility-blue-default-rest);
}

.task__priority--urgent {
  color: var(--dxds-color-content-utility-yellow-default-rest);
}

.task__priority--high {
  color: var(--dxds-color-content-utility-red-default-rest);
}

.task__indicator {
  background-color: currentcolor;
  margin-right: 8px;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}
</style>
