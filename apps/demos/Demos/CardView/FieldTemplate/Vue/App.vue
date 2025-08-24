<template>
  <DxCardView
    :data-source="tasks"
    cards-per-row="auto"
    :card-min-width="240"
  >
    <DxCardHeader
      :visible="true"
      template="headerTemplate"
    />
    <DxPaging
      :page-size="12"
    />

    <DxColumn
      data-field="Task_Priority"
      caption="Priority"
      field-value-template="priorityTemplate"
    />
    <DxColumn
      data-field="Task_Start_Date"
      caption="Start Date"
      data-type="date"
    />
    <DxColumn
      data-field="Task_Due_Date"
      caption="End Date"
      data-type="date"
    />
    <DxColumn
      data-field="Task_Assigned_Employee_ID"
      caption="Assigned to"
      field-value-template="employeeTemplate"
    />
    <DxColumn
      data-field="Task_Status"
      caption="Status"
    />
    <DxColumn
      data-field="Task_Completion"
      caption="Completed"
      field-template="progressTemplate"
    />

    <template #headerTemplate="{
      data: {
        card: {
          data: task,
        }
      }
    }">
      <HeaderTemplate :text="task.Task_Subject"/>
    </template>
    <template #priorityTemplate="{
      data: {
        field: {
          value,
        }
      }
    }">
      <Priority :priorityID="value"/>
    </template>
    <template #employeeTemplate="{
      data: {
        field: {
          value,
        }
      }
    }">
      <Employee :employeeID="value"/>
    </template>
    <template #progressTemplate="{
      data: {
        field: {
          value,
        }
      }
    }">
      <Progress :value="value"/>
    </template>
  </DxCardView>
</template>

<script setup lang="ts">
import {
  DxCardView,
  DxColumn,
  DxCardHeader,
  DxPaging,
} from 'devextreme-vue/card-view';
import { tasks } from './data.ts';
import HeaderTemplate from './HeaderTemplate.vue';
import Priority from './Priority.vue';
import Employee from './Employee.vue';
import Progress from './Progress.vue';
</script>

<style>
.dx-cardview-card-header > div {
  width: 100%;
}
</style>
