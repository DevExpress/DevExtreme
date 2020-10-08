<template>
  <div>
    <DxDataGrid
      id="grid"
      :ref="gridRefName"
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
          @selection-changed="directionChanged"
        />
      </div>
    </div>
  </div>
</template>
<script>

import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';

import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxTexts
} from 'devextreme-vue/data-grid';

import DxSpeedDialAction from 'devextreme-vue/speed-dial-action';
import DxSelectBox from 'devextreme-vue/select-box';
import { employees, states, directions } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxTexts,
    DxSpeedDialAction,
    DxSelectBox
  },
  data() {
    return {
      employees: employees,
      gridRefName: 'grid',
      lookup: {
        dataSource: states,
        displayExpr: 'Name',
        valueExpr: 'ID'
      },
      selectedRowIndex: -1
    };
  },
  computed: {
    grid: function() {
      return this.$refs[this.gridRefName].instance;
    }
  },
  methods: {
    selectedChanged(e) {
      this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
    },

    directionChanged(e) {
      config({
        floatingActionButtonConfig: directions[e.selectedItem]
      });

      repaintFloatingActionButton();
    },

    addRow() {
      this.grid.addRow();
      this.grid.deselectAll();
    },

    deleteRow() {
      this.grid.deleteRow(this.selectedRowIndex);
      this.grid.deselectAll();
    },

    editRow() {
      this.grid.editRow(this.selectedRowIndex);
      this.grid.deselectAll();
    }
  }
};
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
