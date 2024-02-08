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
<script setup lang="ts">
import { watch, ref } from 'vue';
import {
  DxDiagram, DxGroup, DxToolbox, DxCustomShape,
} from 'devextreme-vue/diagram';
import service from './data.ts';
import 'whatwg-fetch';

const employees = service.getEmployees();
const diagram = ref();

watch(diagram,
  ({ instance }) => {
    fetch('../../../../data/diagram-employees.json')
      .then((response) => response.json())
      .then((json) => {
        instance.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  });
</script>
<style scoped>
    #diagram {
      height: 725px;
    }
</style>
