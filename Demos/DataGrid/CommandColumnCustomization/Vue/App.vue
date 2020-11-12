<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
      @row-validating="rowValidating"
      @editor-preparing="editorPreparing"
    >

      <DxPaging :enabled="false"/>
      <DxEditing
        :allow-updating="true"
        :allow-deleting="allowDeleting"
        :use-icons="true"
        mode="row"
      />

      <DxColumn
        type="buttons"
        :width="110"
      >
        <DxButton name="edit"/>
        <DxButton name="delete"/>
        <DxButton
          hint="Clone"
          icon="repeat"
          :visible="isCloneIconVisible"
          @click="cloneIconClick"
        />
      </DxColumn>
      <DxColumn
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn
        :width="130"
        data-field="Position"
      />
      <DxColumn
        :width="125"
        data-field="StateID"
        caption="State"
      >
        <DxLookup
          :data-source="states"
          display-expr="Name"
          value-expr="ID"
        />
      </DxColumn>
      <DxColumn
        :width="125"
        data-field="BirthDate"
        data-type="date"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxButton,
  DxPaging,
  DxLookup
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxButton,
    DxPaging,
    DxLookup
  },
  data() {
    return {
      employees: service.getEmployees(),
      states: service.getStates()
    };
  },
  methods: {
    isChief(position) {
      return position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;
    },
    isCloneIconVisible(e) {
      return !e.row.isEditing && !this.isChief(e.row.data.Position);
    },
    cloneIconClick(e) {
      const employees = [...this.employees];
      const clonedItem = { ...e.row.data, ID: service.getMaxID() };

      employees.splice(e.row.rowIndex, 0, clonedItem);
      this.employees = employees;
      e.event.preventDefault();
    },
    rowValidating(e) {
      const position = e.newData.Position;

      if(this.isChief(position)) {
        e.errorText = `The company can have only one ${ position.toUpperCase() }. Please choose another position.`;
        e.isValid = false;
      }
    },
    editorPreparing(e) {
      if(e.parentType === 'dataRow' && e.dataField === 'Position') {
        e.editorOptions.readOnly = this.isChief(e.value);
      }
    },
    allowDeleting(e) {
      return !this.isChief(e.row.data.Position);
    }
  }
};
</script>
