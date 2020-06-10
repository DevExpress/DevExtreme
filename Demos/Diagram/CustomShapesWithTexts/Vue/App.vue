<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxCustomShape
      v-for="employee in employees"
      :category="'employees'"
      :type="'employee' + employee.ID"
      :base-type="'rectangle'"
      :default-text="employee.Full_Name"
      :allow-edit-text="false"
      :key="employee.ID"
    />
    <DxToolbox :visible="true">
      <DxGroup
        :category="'employees'"
        :title="'Employees'"
        :display-mode="'texts'"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script>
import { DxDiagram, DxGroup, DxToolbox, DxCustomShape } from 'devextreme-vue/diagram';
import service from './data.js';
import 'whatwg-fetch';

export default {
  components: {
    DxDiagram, DxGroup, DxToolbox, DxCustomShape
  },
  data() {
    return {
      employees: service.getEmployees()
    };
  },
  mounted() {
    var diagram = this.$refs['diagram'].instance;
    fetch('../../../../data/diagram-employees.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        diagram.import(JSON.stringify(json));
      })
      .catch(function() {
        throw 'Data Loading Error';
      });
  }
};
</script>
<style scoped>
    #diagram {
        height: 725px;
    }
</style>
