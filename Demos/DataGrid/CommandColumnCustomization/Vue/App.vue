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
        :width="110"
        :buttons="editButtons"
        type="buttons"
      />
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
        :lookup="lookup"
        :width="125"
        data-field="StateID"
        caption="State"
      />
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
  DxPaging
} from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging
  },
  data() {
    return {
      employees: service.getEmployees(),
      editButtons: ['edit', 'delete', {
        hint: 'Clone',
        icon: 'repeat',
        visible: this.isCloneIconVisible,
        onClick: this.cloneIconClick
      }],
      lookup: {
        dataSource: service.getStates(),
        displayExpr: 'Name',
        valueExpr: 'ID'
      }
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
      var clonedItem = Object.assign({}, e.row.data, { ID: service.getMaxID() });

      this.employees.splice(e.row.rowIndex, 0, clonedItem);
      e.event.preventDefault();
    },
    rowValidating(e) {
      var position = e.newData.Position;

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
