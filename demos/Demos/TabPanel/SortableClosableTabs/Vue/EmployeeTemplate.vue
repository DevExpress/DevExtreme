<template>
  <div>
    <div class="employeeInfo">
      <img
        class="employeePhoto"
        :alt="employee.FirstName + ' ' + employee.LastName"
        :src="employee.Picture"
      >
      <p class="employeeNotes"><b>Position: {{ employee.Position }}</b><br>{{ employee.Notes }}</p>
    </div>
    <div class="caption">{{ employee.FirstName }} {{ employee.LastName }}'s Tasks: </div>
    <div class="task-list">
      <DxList
        :data-source="dataSource"
        :show-selection-controls="true"
        :selected-items="completedTasks"
        :disabled="true"
        selection-mode="multiple"
      >
        <template #item="{ data: item }">
          <div>
            {{ item.Subject }}
          </div>
        </template>
      </DxList>
    </div>
  </div>
</template>
<script setup lang="ts">
import DxList from 'devextreme-vue/list';
import service from './data.ts';

const props = withDefaults(defineProps<{
  employee?: Record<string, any>
}>(), {
  employee: () => ({}),
});

const tasks = service.getTasks();
const employeeTasks = tasks.filter(({ EmployeeID }) => EmployeeID === props.employee.ID);
const dataSource = employeeTasks;
const completedTasks = employeeTasks.filter(({ Status }) => Status === 'Completed');
</script>
<style>
.caption {
  padding: 0 0 10px 30px;
  font-size: 14px;
  font-weight: bold;
}

.task-list {
  padding: 0 20px;
}

.task-list .dx-state-disabled {
  opacity: 1;
}

.task-list .dx-state-disabled .dx-list-item {
  opacity: 1;
}
</style>
