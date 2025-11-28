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
    />
    <DxColumn
      name="AI Column"
      caption="AI Column"
      type="ai"
      cssClass="ai__cell"
      :fixed="true"
      fixedPosition="right"
      :width="180"
    >
      <DxAi
        mode="auto"
        noDataText="No data"
        prompt="
          Identify the department where the employee works.
          Select from the following department list: 'Management',
          'Human Resources', 'IT', 'Shipping', 'Support', 'Sales',
          'Engineering'. Use 'Engineering' if you cannot find a better match.
        "
      />
    </DxColumn>
  </DxTreeList>
</template>

<script setup lang="ts">
import { DxTreeList, DxColumn, DxScrolling, DxPaging, DxAi } from 'devextreme-vue/tree-list';
import Employee from './Employee.vue';
import Status from './Status.vue';
import { type IEmployee, employees } from './data.ts';
import { aiIntegration } from './service.ts';

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
