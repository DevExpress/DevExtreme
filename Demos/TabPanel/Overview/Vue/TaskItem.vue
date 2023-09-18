<template>
  <div :class="className">
    <p class="task-item-text">
      {{ task.text }}
    </p>

    <p class="task-item-info">
      {{ task.date }} by {{ task.assignedBy }}
    </p>

    <i class="task-item-pseudo-button dx-icon dx-icon-overflow"/>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',

  props: {
    task: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    className() {
      const { priority } = this.task;

      return `task-item task-item-priority-${priority}`;
    },
  },
};
</script>

<style>
.task-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
}

.task-item::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 6px;
  bottom: 8px;
  width: 3px;
  border-radius: 4px;
}

.task-item-priority-high::before {
  background-color: #e1bee7;
}

.task-item-priority-medium::before {
  background-color: #ffe0b2;
}

.task-item-priority-low::before {
  background-color: #c8e6c9;
}

.task-item-text,
.task-item-info {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  margin: 0;
}

.task-item-info {
  width: 240px;
  min-width: 240px;
  font-size: 12px;
  opacity: 0.38;
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
  border: 1px solid #fff;
}
</style>
