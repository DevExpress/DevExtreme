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
      :height="250"
      title="Information"
    >
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
import { DxPopup } from 'devextreme-vue/popup';
import EmployeeItem from './EmployeeItem.vue';
import { employees } from './data.js';

export default {
  components: {
    DxPopup,
    EmployeeItem
  },

  data() {
    return {
      employees,
      currentEmployee: {},
      popupVisible: false
    };
  },

  methods: {
    showInfo(employee) {
      this.currentEmployee = employee;
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

