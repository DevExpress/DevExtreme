<template>
  <div id="container">
    <DxDiagram
      id="diagram"
      custom-shape-template="CustomShapeTemplate"
      :read-only="true"
    >
      <DxCustomShape
        v-for="employee in employees"
        :type="'employee' + employee.ID"
        :base-type="'rectangle'"
        :default-width="1.5"
        :default-height="1"
        :allow-edit-text="false"
        :allow-resize="false"
        :key="employee.ID"
      />
      <template #CustomShapeTemplate="{ data }">
        <CustomShapeTemplate
          :employee="data.dataItem"
          :show-info="showInfo"
        />
      </template>
      <DxNodes
        :data-source="dataSource"
        :key-expr="'ID'"
        :type-expr="itemTypeExpr"
        :parent-key-expr="'Head_ID'"
      >
        <DxAutoLayout :type="'tree'"/>
      </DxNodes>
    </DxDiagram>

    <DxPopup
      v-model:visible="popupVisible"
      :drag-enabled="false"
      :close-on-outside-click="true"
      :show-title="true"
      :width="300"
      :height="280"
      title="Information"
    >
      <p>Full Name: <b>{{ currentEmployee.Full_Name }}</b></p>
      <p>Title: <b>{{ currentEmployee.Title }}</b></p>
      <p>City: <b>{{ currentEmployee.City }}</b></p>
      <p>State: <b>{{ currentEmployee.State }}</b></p>
      <p>Email: <b>{{ currentEmployee.Email }}</b></p>
      <p>Skype: <b>{{ currentEmployee.Skype }}</b></p>
      <p>Mobile Phone: <b>{{ currentEmployee.Mobile_Phone }}</b></p>
    </DxPopup>
  </div>
</template>
<script>

import { DxDiagram, DxNodes, DxAutoLayout, DxCustomShape } from 'devextreme-vue/diagram';
import { DxPopup } from 'devextreme-vue/popup';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.vue';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxCustomShape, CustomShapeTemplate, DxPopup
  },
  data() {
    return {
      employees: service.getEmployees(),
      dataSource: new ArrayStore({
        key: 'ID',
        data: service.getEmployees()
      }),
      currentEmployee: {},
      popupVisible: false
    };
  },
  methods: {
    itemTypeExpr(obj) {
      return `employee${obj.ID}`;
    },
    showInfo(employee) {
      this.currentEmployee = employee;
      this.popupVisible = true;
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 725px;
    }

    .dx-popup-content p {
        margin: 0 0 10px;
    }
</style>
