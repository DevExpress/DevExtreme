<template>
  <div :class="['task-item', `task-item-priority-${task.priority}`]">
    <span class="task-item-text">
      {{ task.text }}
    </span>

    <span class="task-item-info">
      {{ task.date }} by {{ task.assignedBy }}
    </span>

    <i class="task-item-pseudo-button dx-icon dx-icon-overflow"/>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  task?: Record<string, any>
}>(), {
  task: () => ({} as Record<string, any>),
});
</script>

<style>
.task-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 8px 12px 8px 8px;
  border-radius: 4px;
  box-shadow: var(--dxds-box-shadow-xs, 0 1px 4px 0 rgba(0, 0, 0, 0.15));
}

.task-item::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 6px;
  bottom: 8px;
  width: 3px;
  border-radius: 4px;
}

.task-item-priority-high::before {
  background-color: var(--dxds-color-bg-red, #e1bee7);
}

.task-item-priority-medium::before {
  background-color: var(--dxds-color-bg-yellow, #ffe0b2);
}

.task-item-priority-low::before {
  background-color: var(--dxds-color-bg-green, #c8e6c9);
}

.task-item-text,
.task-item-info {
  margin: 0;
  padding: 0 24px 0 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item-info {
  font-size: 12px;
  opacity: 0.6;
}

.task-item-pseudo-button {
  position: absolute;
  right: 8px;
  top: 50%;
  font-size: 18px;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.6;
}

.dx-color-scheme-contrast .task-item {
  border: 1px solid var(--dxds-color-border-on-color-shared, #fff);
}

.dx-theme-fluent.dx-color-scheme-blue-dark .task-item {
  background-color: var(--dxds-color-bg-red, #1f1f1f);
}
</style>
