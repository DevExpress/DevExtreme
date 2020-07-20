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

<script>
export default {
  props: {
    employee: {
      type: Object,
      required: true,
      default: () => ({})
    },
    editEmployee: {
      type: Function,
      required: true,
      default: () => {}
    },
    deleteEmployee: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  computed: {
    employeeName() {
      return this.employee && this.employee.Full_Name ? this.employee.Full_Name : 'Employee\'s Name';
    },
    employeeTitle() {
      return this.employee && this.employee.Title ? this.employee.Title : 'Employee\'s Title';
    }
  },
  methods: {
    editEmployeeFunc() {
      this.editEmployee(this.employee);
    },
    deleteEmployeeFunc() {
      this.deleteEmployee(this.employee);
    }
  }
};
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
