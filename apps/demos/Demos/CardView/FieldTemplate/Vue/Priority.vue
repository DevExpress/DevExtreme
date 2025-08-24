<template>
  <div :className="priorityClassName">
    <div className="task__indicator"></div>
    <div>{{ priority.text }}</div>
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
const priorityClassName = `task__priority task__priority--${priority.value.postfix}`;
</script>

<style>
.task__priority {
  display: flex;
  align-items: center;
}

.task__priority--low {
  color: var(--dx-color-success);
}

.task__priority--normal {
  color: var(--dx-color-primary);
}

.task__priority--urgent {
  color: #f7630c;
}

.task__priority--high {
  color: var(--dx-color-danger);
}

.task__indicator {
  background-color: currentcolor;
  margin-right: 8px;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}
</style>
