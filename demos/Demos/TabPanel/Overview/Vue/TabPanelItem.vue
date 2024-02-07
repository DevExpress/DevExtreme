<template>
  <div class="tabpanel-item">
    <TaskItem
      v-for="(task, index) in tasks"
      :key="index"
      :task="task"
    />
  </div>
</template>

<script setup lang="ts">
import TaskItem from './TaskItem.vue';

withDefaults(defineProps<{
  tasks?: Record<string, any>[]
}>(), {
  tasks: () => [],
});
</script>

<style>
.tabpanel-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}
</style>
