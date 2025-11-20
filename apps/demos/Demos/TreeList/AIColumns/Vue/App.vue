<template>
  <DxTreeList
    id="employees"
    keyExpr="ID"
    parentIdExpr="Head_ID"
    :dataSource="employees"
    :autoExpandAll="true"
    :showBorders="true"
    :aiIntegration="aiIntegration"
    :onAIColumnRequestCreating="onAIColumnRequestCreating"
  >
    <DxScrolling :mode="'standard'"/>
    <DxPaging
      :enabled="true"
      :pageSize="10"
    />

    <DxColumn
      caption="Employee"
      cssClass="employee__cell"
      :width="260"
      cellTemplate="employee-cell"
    />
    <template #employee-cell="{ data: { data: employee} }">
      <Employee
        :firstName="employee.First_Name"
        :lastName="employee.Last_Name"
      />
    </template>
    <DxColumn
      dataField="Title"
      caption="Position"
      :width="140"
    />
    <DxColumn
      dataField="Status"
      :minWidth="180"
      cellTemplate="status-cell"
    />
    <template #status-cell="{ data: { data: employee} }">
      <Status :status="employee.Status"/>
    </template>
    <DxColumn
      dataField="City"
      :width="180"
    />
    <DxColumn
      dataField="State"
      :width="140"
    />
    <DxColumn
      dataField="Email"
      :minWidth="200"
      cellTemplate="email-cell"
    />
    <template #email-cell="{ data: { data: employee} }">
      <Email :email="employee.Email"/>
    </template>
    <DxColumn
      name="AI Column"
      caption="AI Column"
      type="ai"
      cssClass="ai__cell"
      :ai="aiConfig"
      :fixed="true"
      fixedPosition="right"
      :width="180"
    />
  </DxTreeList>
</template>

<script setup lang="ts">
import { DxTreeList, DxColumn, DxColumnFixing, DxScrolling, DxPaging } from 'devextreme-vue/tree-list';
import Email from './Email.vue';
import Employee from './Employee.vue';
import Status from './Status.vue';
import { type IEmployee, employees } from './data.ts';
import { aiIntegration } from './service.ts';

const aiConfig = {
  prompt: 'Identify department for each employee. It should be one of the following department types:  "Management", "Human Resources", "IT", "Shipping", "Support", "Sales",  "Engineering". Use "Engineering" by default.',
  mode: 'auto',
  noDataText: 'No data',
};

const onAIColumnRequestCreating = (e: { data: Partial<IEmployee>[] }) => {
  e.data = e.data.map((item) => ({
    ID: item.ID,
    First_Name: item.First_Name,
    Last_Name: item.Last_Name,
    Title: item.Title,
  }));
};
</script>

<style scoped>
#app .ai__cell {
  background-color: var(--dx-datagrid-row-alternation-bg);
}

#app .employee__cell > div {
  align-items: flex-end;
}
</style>
