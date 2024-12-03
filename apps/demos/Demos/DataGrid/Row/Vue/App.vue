<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :column-auto-width="true"
      :show-borders="true"
      :row-alternatin-enabled="true"
      :hover-state-enabled="true"
      data-row-template="dataRowTemplate"
    >
      <DxColumn
        :width="100"
        :allow-filtering="false"
        :allow-sorting="false"
        caption="Photo"
      />
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="Position"/>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <template #dataRowTemplate="{ data: rowInfo }">
        <tr class="main-row" role="row">
          <td rowspan="2" role="gridcell"><img :src="rowInfo.data.Picture" :alt="`Picture of ${rowInfo.data.FirstName} ${rowInfo.data.LastName}`" tabindex="0"></td>
          <td role="gridcell">{{ rowInfo.data.Prefix }}</td>
          <td role="gridcell">{{ rowInfo.data.FirstName }}</td>
          <td role="gridcell">{{ rowInfo.data.LastName }}</td>
          <td role="gridcell">{{ rowInfo.data.Position }}</td>
          <td role="gridcell">{{ formatDate(new Date(rowInfo.data.BirthDate)) }}</td>
          <td role="gridcell">{{ formatDate(new Date(rowInfo.data.HireDate)) }}</td>
        </tr>
        <tr class="notes-row" role="row">
          <td colspan="6" role="gridcell"><div>{{ rowInfo.data.Notes }}</div></td>
        </tr>
      </template>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
} from 'devextreme-vue/data-grid';
import { employees } from './data.ts';

const formatDate = new Intl.DateTimeFormat('en-US').format;
</script>
<style scoped>
#gridContainer {
  height: 450px;
}

.dx-row img {
  height: 100px;
}

#gridContainer tr.main-row td:not(:first-child) {
  height: 21px;
}

#gridContainer tr.notes-row {
  white-space: normal;
  vertical-align: top;
}

#gridContainer tr.notes-row td {
  height: 70px;
  color: #999;
}

.dark #gridContainer tr.notes-row td {
  color: #777;
}

#gridContainer tbody.dx-state-hover {
  background-color: #ebebeb;
}

.dark #gridContainer tbody.dx-state-hover {
  background-color: #484848;
}

#gridContainer tbody.dx-state-hover tr.main-row td {
  color: #000;
}

.dark #gridContainer tbody.dx-state-hover tr.main-row td {
  color: #ccc;
}

#gridContainer tbody.dx-state-hover tr.notes-row td {
  color: #888;
}
</style>
