<template>
  <div id="container">
    <h1>Employees</h1>

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
      :close-on-outside-click="true"
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
<script>
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
import EmployeeItem from './EmployeeItem.vue';
import { employees } from './data.js';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxPopup,
    DxPosition,
    DxToolbarItem,
    EmployeeItem
  },

  data() {
    return {
      employees,
      currentEmployee: {},
      popupVisible: false,
      positionOf: '',
      emailButtonOptions: {
        icon: 'email',
        text: 'Send',
        onClick: () => {
          const message = `Email is sent to ${this.currentEmployee.FirstName} ${this.currentEmployee.LastName}`;
          notify({
            message: message,
            position: {
              my: 'center top',
              at: 'center top'
            }
          }, 'success', 3000);
        }
      },
      closeButtonOptions: {
        text: 'Close',
        onClick: () => {
          this.popupVisible = false;
        }
      },
    };
  },

  methods: {
    showInfo(employee) {
      this.currentEmployee = employee;
      this.positionOf = `#image${employee.ID}`;
      this.popupVisible = true;
    }
  }
};
</script>
<style>
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

