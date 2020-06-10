<template>
  <DxDataGrid
    id="grid-container"
    :show-borders="true"
    :data-source="dataSource"
    key-expr="ID"
    @selection-changed="selectionChanged"
    @content-ready="contentReady"
  >
    <DxSelection mode="single"/>
    <DxColumn
      :width="70"
      data-field="Prefix"
      caption="Title"
    />
    <DxColumn data-field="FirstName"/>
    <DxColumn data-field="LastName"/>
    <DxColumn
      :width="170"
      data-field="Position"
    />
    <DxColumn
      :width="125"
      data-field="State"
    />
    <DxColumn
      data-field="BirthDate"
      data-type="date"
    />
    <DxMasterDetail
      :enabled="false"
      template="detailTemplate"
    />
    <template #detailTemplate="{ data: employee }">
      <div class="employee-info">
        <img
          :src="employee.data.Picture"
          class="employee-photo"
        >
        <p class="employee-notes">{{ employee.data.Notes }}</p>
      </div>
    </template>
  </DxDataGrid>
</template>
<script>

import DxDataGrid, {
  DxColumn,
  DxMasterDetail,
  DxSelection
} from 'devextreme-vue/data-grid';
import { employees } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxMasterDetail,
    DxSelection
  },
  data() {
    return {
      dataSource: employees
    };
  },
  methods: {
    contentReady(e) {
      if (!e.component.getSelectedRowKeys().length)
      { e.component.selectRowsByIndexes(0); }
    },
    selectionChanged(e) {
      e.component.collapseAll(-1);
      e.component.expandRow(e.currentSelectedRowKeys[0]);
    }
  }
};
</script>
<style>
#grid-container {
  height: 440px;
}

#grid-container .dx-datagrid-content tr.dx-data-row {
  cursor: pointer;
}

.employee-info .employee-photo {
  height: 140px;
  float: left;
  padding: 20px 20px 20px 0;
}

.employee-info .employee-notes {
  padding-top: 20px;
  text-align: justify;
  white-space: normal;
}
</style>
