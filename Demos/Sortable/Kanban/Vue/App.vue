<template>
  <div id="kanban">
    <DxScrollView
      class="scrollable-board"
      direction="horizontal"
      show-scrollbar="always"
    >
      <DxSortable
        class="sortable-lists"
        item-orientation="horizontal"
        handle=".list-title"
        @reorder="onListReorder"
      >
        <div
          v-for="(list, listIndex) in lists"
          :key="statuses[listIndex]"
          class="list"
        >
          <div class="list-title dx-theme-text-color">{{ statuses[listIndex] }}</div>
          <DxScrollView
            class="scrollable-list"
            show-scrollbar="always"
          >
            <DxSortable
              :data="list"
              class="sortable-cards"
              group="tasksGroup"
              @drag-start="onTaskDragStart($event)"
              @reorder="onTaskDrop($event)"
              @add="onTaskDrop($event)"
            >
              <div
                v-for="task in list"
                :key="task.Task_ID"
                class="card dx-card dx-theme-text-color dx-theme-background-color"
              >
                <div :class="['card-priority', getPriorityClass(task)]"/>
                <div class="card-subject">{{ task.Task_Subject }}</div>
                <div class="card-assignee">{{ employeesMap[task.Task_Assigned_Employee_ID] }}</div>
              </div>
            </DxSortable>
          </DxScrollView>
        </div>
      </DxSortable>
    </DxScrollView>
  </div>
</template>
<script>
import { tasks, employees } from './data.js';
import { DxScrollView } from 'devextreme-vue/scroll-view';
import { DxSortable } from 'devextreme-vue/sortable';

const statuses = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];

export default {
  components: {
    DxScrollView,
    DxSortable
  },
  data() {
    const employeesMap = {};

    employees.forEach(employee => {
      employeesMap[employee.ID] = employee.Name;
    });

    const lists = [];

    statuses.forEach(status => {
      lists.push(tasks.filter(task => task.Task_Status === status));
    });

    return {
      statuses,
      lists,
      employeesMap
    };
  },
  methods: {
    onListReorder(e) {
      const list = this.lists.splice(e.fromIndex, 1)[0];
      this.lists.splice(e.toIndex, 0, list);

      const status = this.statuses.splice(e.fromIndex, 1)[0];
      this.statuses.splice(e.toIndex, 0, status);
    },
    onTaskDragStart(e) {
      e.itemData = e.fromData[e.fromIndex];
    },
    onTaskDrop(e) {
      e.fromData.splice(e.fromIndex, 1);
      e.toData.splice(e.toIndex, 0, e.itemData);
    },
    getPriorityClass(task) {
      return `priority-${task.Task_Priority}`;
    }
  }
};
</script>
<style>
#kanban {
    white-space: nowrap;
}

.list {
    border-radius: 8px;
    margin: 5px;
    background-color: rgba(192, 192, 192, 0.4);
    display: inline-block;
    vertical-align: top;
    white-space: normal;
}

.list-title {
    font-size: 16px;
    padding: 10px;
    padding-left: 30px;
    margin-bottom: -10px;
    font-weight: bold;
    cursor: pointer;
}

.scrollable-list {
    height: 400px;
    width: 260px;
}

.sortable-cards {
    min-height: 380px
}

.card {
    position: relative;
    background-color: white;
    box-sizing: border-box;
    width: 230px;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
}

.card-subject {
    padding-bottom: 10px;
}

.card-assignee {
    opacity: 0.6;
}

.card-priority {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 5px;
    width: 5px;
    border-radius: 2px;
    background: #86C285;
}

.priority-1 {
    background: #ADADAD;
}

.priority-2 {
    background: #86C285;
}

.priority-3 {
    background: #EDC578;
}

.priority-4 {
    background: #EF7D59;
}

.dx-sortable {
    display: block;
}
</style>
