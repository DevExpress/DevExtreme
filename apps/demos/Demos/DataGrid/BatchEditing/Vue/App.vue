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
        :select-text-on-edit-start="selectTextOnEditStart"
        :start-edit-action="startEditAction"
        mode="batch"
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
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="selectTextOnEditStart"
          text="Select Text on Edit Start"
        />
      </div>
      <div class="option">
        <span>Start Edit Action</span>
        <DxSelectBox
          :items="['click', 'dblClick']"
          :input-attr="{ 'aria-label': 'Action' }"
          v-model:value="startEditAction"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxLookup,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees, states } from './data.ts';

const selectTextOnEditStart = ref(true);
const startEditAction = ref('click');
</script>
<style>
#data-grid-demo {
  min-height: 700px;
}

.options {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
}

.options .caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.option > span {
  width: 120px;
  display: inline-block;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  max-width: 350px;
}
</style>
