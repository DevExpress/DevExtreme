<template>
  <li>
    <img
      :alt="employee.FirstName + ' ' + employee.LastName"
      :src="employee.Picture"
      :id="'image' + employee.ID"
    ><br>
    <i>{{ employee.FirstName }} {{ employee.LastName }}</i><br>
    <DxButton
      :on-click="showEmployeeInfo"
      class="button-info"
      text="Details"
    />
  </li>
</template>
<script setup lang="ts">
import { DxButton } from 'devextreme-vue/button';
import { employees } from './data.js';

type Employee = typeof employees[0];

const props = withDefaults(defineProps<{
  employee?: Employee,
  showInfo?: Function
}>(), {
  employee: () => ({}),
  showInfo: () => {},
});

function showEmployeeInfo() {
  props.showInfo(props.employee);
}
</script>
