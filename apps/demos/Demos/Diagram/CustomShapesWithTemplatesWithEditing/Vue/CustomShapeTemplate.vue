<template>
  <svg class="template">
    <text
      class="template-name"
      x="50%"
      y="20%"
    >
      {{ employeeName }}
    </text>
    <text
      class="template-title"
      x="50%"
      y="45%"
    >
      {{ employeeTitle }}
    </text>
    <text
      class="template-button"
      x="40%"
      y="85%"
      @click="editEmployeeFunc"
    >
      Edit
    </text>
    <text
      class="template-button"
      x="62%"
      y="85%"
      @click="deleteEmployeeFunc"
    >
      Delete
    </text>
  </svg>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  employee: Record<string, any>
  editEmployee: Function
  deleteEmployee: Function
}>(), {
  employee: () => ({}),
  editEmployee: () => ({}),
  deleteEmployee: () => ({}),
});
const employeeName = props.employee?.Full_Name || 'Employee\'s Name';
const employeeTitle = props.employee?.Title || 'Employee\'s Title';
const editEmployeeFunc = () => props.editEmployee(props.employee);
const deleteEmployeeFunc = () => props.deleteEmployee(props.employee);
</script>

<style>
    #diagram .template .template-name {
      font-weight: bold;
      text-decoration: underline;
    }

    #diagram .template .template-title {
      font-style: italic;
    }

    #diagram .template .template-button {
      cursor: pointer;
      font-size: 8pt;
      fill: navy;
    }

    #diagram .template .template-button:hover {
      text-decoration: underline;
    }
</style>
