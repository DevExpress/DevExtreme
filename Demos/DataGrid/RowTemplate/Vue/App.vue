<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :column-auto-width="true"
      :show-borders="true"
      row-template="dataRowTemplate"
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
        <tbody
          :class="{'dx-row-alt': rowInfo.rowIndex % 2}"
          class="employee dx-row"
        >
          <tr class="main-row">
            <td rowspan="2"><img :src="rowInfo.data.Picture"></td>
            <td>{{ rowInfo.data.Prefix }}</td>
            <td>{{ rowInfo.data.FirstName }}</td>
            <td>{{ rowInfo.data.LastName }}</td>
            <td>{{ rowInfo.data.Position }}</td>
            <td>{{ formatDate(new Date(rowInfo.data.BirthDate)) }}</td>
            <td>{{ formatDate(new Date(rowInfo.data.HireDate)) }}</td>
          </tr>
          <tr class="notes-row">
            <td colspan="6"><div>{{ rowInfo.data.Notes }}</div></td>
          </tr>
        </tbody>
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn
  },
  data() {
    return {
      employees: service.getEmployees()
    };
  },
  methods: {
    formatDate: new Intl.DateTimeFormat('en-US').format
  }
};
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

#gridContainer tbody.employee:hover {
    background-color: #EBEBEB;
}

.dark #gridContainer tbody.employee:hover {
    background-color: #484848;
}

#gridContainer tbody.employee:hover tr.main-row td {
    color: #000;
}

.dark #gridContainer tbody.employee:hover tr.main-row td {
    color: #CCC;
}

#gridContainer tbody.employee:hover tr.notes-row td {
    color: #888;
}
</style>
