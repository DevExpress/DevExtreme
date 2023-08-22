<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
    >
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        mode="form"
      />
      <DxPaging :enabled="false"/>
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        :width="170"
        data-field="Position"
      />
      <DxColumn
        :width="125"
        data-field="StateID"
        caption="State"
      >
        <DxLookup
          :data-source="states"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :visible="false"
        data-field="Notes"
      >
        <DxFormItem
          :col-span="2"
          :editor-options="{ height: 100 }"
          editor-type="dxTextArea"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxFormItem,
  DxPaging,
  DxEditing,
  DxLookup,
} from 'devextreme-vue/data-grid';
import 'devextreme-vue/text-area';
import { employees, states } from './data.js';

</script>
<style>
#data-grid-demo {
  min-height: 700px;
}
</style>
