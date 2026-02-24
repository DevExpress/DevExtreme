<template>
  <div id="container">
    <div class="header">Employees</div>

    <ul>
      <EmployeeItem
        v-for="employee in employees"
        :key="employee.ID"
        :employee="employee"
        :show-info="showInfo"
      />
    </ul>

    <DxPopup
      v-model:visible="popupVisible"
      :drag-enabled="false"
      :width="450"
      :height="600"
      container=".dx-viewport"
      titleTemplate="title"
    >
      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="before"
        :options="emailButtonOptions"
      />
      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        :options="closeButtonOptions"
      />
      <template #title>
        <p class="title">Title template</p>
      </template>
    </DxPopup>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
import notify from 'devextreme/ui/notify';
import EmployeeItem from './EmployeeItem.vue';
import { employees } from './data.ts';

type Employee = typeof employees[0];

const currentEmployee = ref<Employee>();
const popupVisible = ref(true);
const positionOf = ref('');
const closeButtonOptions = {
  text: 'Close',
  stylingMode: 'outlined',
  type: 'normal',
  onClick: () => {
    popupVisible.value = false;
  },
};
const moreInfoButtonOptions = {
  text: 'More info',
  onClick: () => {
    const message = `More info about ${currentEmployee.value?.FirstName} ${currentEmployee.value?.LastName}`;
    notify({
      message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);
  },
};
const emailButtonOptions = {
  icon: 'email',
  stylingMode: 'contained',
  text: 'Send',
  onClick: () => {
    const message = `Email is sent to ${currentEmployee.value?.FirstName} ${currentEmployee.value?.LastName}`;
    notify({
      message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);
  },
};

function showInfo(employee: Employee) {
  currentEmployee.value = employee;
  positionOf.value = `#image${employee.ID}`;
  popupVisible.value = true;
}
</script>
<style>
.header {
  font-size: 34px;
  text-align: center;
}

#container {
  padding: 10px;
}

#container ul {
  list-style-type: none;
  text-align: center;
}

#container ul li {
  display: inline-block;
  width: 160px;
  margin: 10px;
}

#container ul li img {
  width: 100px;
}

.button-info {
  margin: 10px;
}

.dx-popup-content p {
  margin-bottom: 10px;
  margin-top: 0;
}

.title {
  font-size: 30px;
}
</style>
