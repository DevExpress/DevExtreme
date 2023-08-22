<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
      @row-validating="onRowValidating"
      @editor-preparing="onEditorPreparing"
    >

      <DxPaging :enabled="false"/>
      <DxEditing
        :allow-updating="true"
        :allow-deleting="isDeleteIconVisible"
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
          icon="copy"
          :visible="isCloneIconVisible"
          :disabled="isCloneIconDisabled"
          @click="onCloneIconClick"
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
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxButton,
  DxPaging,
  DxLookup,
} from 'devextreme-vue/data-grid';
import { employees as defaultEmployees, states, getMaxID } from './data.js';

const employees = ref(defaultEmployees);

const isChief = (position) => position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;

const isCloneIconVisible = (e) => !e.row.isEditing;

const isCloneIconDisabled = (e) => isChief(e.row.data.Position);

const isDeleteIconVisible = (e) => !isChief(e.row.data.Position);

const onCloneIconClick = (e) => {
  const updatedEmployees = [...employees.value];
  const clonedItem = { ...e.row.data, ID: getMaxID() };

  updatedEmployees.splice(e.row.rowIndex, 0, clonedItem);
  employees.value = updatedEmployees;
  e.event.preventDefault();
};

const onRowValidating = (e) => {
  const position = e.newData.Position;

  if (isChief(position)) {
    e.errorText = `The company can have only one ${position.toUpperCase()}. Please choose another position.`;
    e.isValid = false;
  }
};

const onEditorPreparing = (e) => {
  if (e.parentType === 'dataRow' && e.dataField === 'Position') {
    e.editorOptions.readOnly = isChief(e.value);
  }
};
</script>
