<template>
  <div>
    <div class="employeeInfo">
      <img
        class="employeePhoto"
        :src="picture"
      >
      <p class="employeeNotes"><b>Position: {{ position }}</b><br>{{ notes }}</p>
    </div>
    <div class="caption">{{ detailInfo }}</div>
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
<script>

import DxList from 'devextreme-vue/list';
import service from './data.js';

const tasks = service.getTasks();

export default {
  components: { DxList },
  props: {
    templateData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const {
      FirstName, LastName, Picture, Position, Notes,
    } = this.templateData;
    const employeeTasks = tasks.filter((task) => task.EmployeeID === this.templateData.ID);

    return {
      dataSource: employeeTasks,
      completedTasks: employeeTasks.filter((task) => task.Status === 'Completed'),
      detailInfo: `${FirstName} ${LastName}'s Tasks:`,
      picture: Picture,
      position: Position,
      notes: Notes,
    };
  },
};
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
