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
      :hide-on-outside-click="true"
      :show-close-button="false"
      :show-title="true"
      :width="300"
      :height="280"
      container=".dx-viewport"
      title="Information"
    >
      <DxPosition
        at="bottom"
        my="center"
        v-model:of="positionOf"
        collision="fit"
      />
      <DxToolbarItem
        widget="dxButton"
        toolbar="top"
        locate-in-menu="always"
        :options="moreInfoButtonOptions"
      />
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
      <p>
        Full Name:
        <span>{{ currentEmployee.FirstName }}</span>
        <span>{{ currentEmployee.LastName }}</span>
      </p>
      <p>
        Birth Date: <span>{{ currentEmployee.BirthDate }}</span>
      </p>
      <p>
        Address: <span>{{ currentEmployee.Address }}</span>
      </p>
      <p>
        Hire Date: <span>{{ currentEmployee.HireDate }}</span>
      </p>
      <p>
        Position: <span>{{ currentEmployee.Position }}</span>
      </p>
    </DxPopup>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
import notify from 'devextreme/ui/notify';
import EmployeeItem from './EmployeeItem.vue';
import { employees } from './data.js';

type Employee = typeof employees[0];

const currentEmployee = ref<Employee>({});
const popupVisible = ref(false);
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
    const message = `More info about ${currentEmployee.value.FirstName} ${currentEmployee.value.LastName}`;
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
    const message = `Email is sent to ${currentEmployee.value.FirstName} ${currentEmployee.value.LastName}`;
    notify({
      message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);
  },
};

function showInfo(employee) {
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
</style>

