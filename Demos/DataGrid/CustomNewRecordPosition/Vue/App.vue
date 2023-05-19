<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
      :column-auto-width="true"
      :remote-operations="true"
      :on-row-inserted="onRowInserted"
    >
      <DxScrolling
        :mode="scrollingMode"
      />
      <DxEditing
        mode="row"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
        :confirm-delete="false"
        :use-icons="true"
        :new-row-position="newRowPosition"
        :changes="changes"
        :edit-row-key="editRowKey"
      />

      <DxColumn
        data-field="OrderID"
        :allow-editing="false"
      />
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      >
        <DxValidationRule type="required"/>
      </DxColumn>
      <DxColumn data-field="ShipName"/>
      <DxColumn data-field="ShipCity"/>
      <DxColumn data-field="ShipPostalCode"/>
      <DxColumn data-field="ShipCountry"/>
      <DxColumn type="buttons">
        <DxButton
          icon="add"
          @click="onAddButtonClick"
          :visible="isAddButtonVisible"
        />
        <DxButton name="delete"/>
        <DxButton name="save"/>
        <DxButton name="cancel"/>
      </DxColumn>

      <DxToolbar>
        <DxItem
          name="addRowButton"
          show-text="always"
        />
      </DxToolbar>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option-container">
        <div class="option">
          <span>New Row Position</span>
          <DxSelectBox
            id="newRowPositionSelectBox"
            :input-attr="{ 'aria-label': 'Position' }"
            v-model:value="newRowPosition"
            :items="newRowPositionOptions"
          />
        </div>
        <div class="option">
          <span>Scrolling Mode</span>
          <DxSelectBox
            id="scrollingModeSelectBox"
            v-model:value="scrollingMode"
            :input-attr="{ 'aria-label': 'Scrolling Mode' }"
            :items="scrollingModeOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn, DxEditing, DxValidationRule, DxButton, DxToolbar, DxItem, DxScrolling,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import Guid from 'devextreme/core/guid';
import { dataSource } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxValidationRule,
    DxButton,
    DxToolbar,
    DxItem,
    DxScrolling,
    DxSelectBox,
  },
  data() {
    return {
      dataSource,
      newRowPosition: 'viewportTop',
      scrollingMode: 'standard',
      changes: [],
      editRowKey: null,
      newRowPositionOptions: ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'],
      scrollingModeOptions: ['standard', 'virtual'],
    };
  },
  methods: {
    onAddButtonClick(e) {
      const key = new Guid().toString();
      this.changes = [{
        key,
        type: 'insert',
        insertAfterKey: e.row.key,
      }];
      this.editRowKey = key;
    },
    isAddButtonVisible({ row }) {
      return !row.isEditing;
    },
    onRowInserted(e) {
      e.component.navigateToRow(e.key);
    },
  },
};
</script>

<style>
#gridContainer {
  height: 440px;
}

.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option-container {
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.option-caption {
  white-space: nowrap;
  margin: 0 8px;
}

.option > span {
  position: relative;
  margin-right: 10px;
}

#newRowPositionSelectBox {
  width: 150px;
}

#scrollingModeSelectBox {
  width: 150px;
}
</style>
