<template>
  <div>
    <DxDataGrid
      id="grid"
      ref="gridRef"
      :data-source="employees"
      :selection="{ mode: 'single' }"
      :show-borders="true"
      key-expr="ID"
      @selection-changed="selectedChanged"
    >

      <DxPaging :enabled="false"/>
      <DxEditing mode="popup">
        <DxTexts confirm-delete-message=""/>
      </DxEditing>

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
    <DxSpeedDialAction
      :on-click="addRow"
      :index="1"
      icon="add"
      label="Add row"
    />
    <DxSpeedDialAction
      :visible="selectedRowIndex !== -1"
      :on-click="deleteRow"
      :index="2"
      icon="trash"
      label="Delete row"
    />
    <DxSpeedDialAction
      :visible="selectedRowIndex !== -1"
      :on-click="editRow"
      :index="3"
      icon="edit"
      label="Edit row"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Direction: </span>
        <DxSelectBox
          :data-source="['auto', 'up', 'down']"
          value="auto"
          :input-attr="{ 'aria-label': 'Direction' }"
          @selection-changed="directionChanged"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxTexts,
} from 'devextreme-vue/data-grid';
import DxSpeedDialAction from 'devextreme-vue/speed-dial-action';
import DxSelectBox, { DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { employees, states, directions } from './data.ts';

const gridRef = ref();
const lookup = {
  dataSource: states,
  displayExpr: 'Name',
  valueExpr: 'ID',
};
const selectedRowIndex = ref(-1);
const grid = computed(() => gridRef.value.instance);

function selectedChanged(e) {
  selectedRowIndex.value = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
}
function directionChanged(e: DxSelectBoxTypes.SelectionChangedEvent) {
  config({
    floatingActionButtonConfig: directions[e.selectedItem],
  });

  repaintFloatingActionButton();
}
function addRow() {
  grid.value.addRow();
  grid.value.deselectAll();
}
function deleteRow() {
  grid.value.deleteRow(selectedRowIndex.value);
  grid.value.deselectAll();
}
function editRow() {
  grid.value.editRow(selectedRowIndex.value);
  grid.value.deselectAll();
}
</script>

<style>
  #grid {
    height: 500px;
  }

  .options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin-top: 10px;
  }

  .option > span {
    margin-right: 10px;
  }

  .option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
  }
</style>
