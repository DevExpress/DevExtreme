<template>
  <div>
    <DxDataGrid
      id="employees"
      :data-source="employees"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      key-expr="ID"
    >
      <DxColumn
        data-field="FirstName"
        :allow-hiding="false"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        data-field="Position"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="State"
      />

      <DxColumn caption="Contacts">
        <DxColumn
          data-field="MobilePhone"
          :allow-hiding="false"
        />
        <DxColumn
          data-field="Email"
        />
        <DxColumn
          data-field="Skype"
          :visible="false"
        />
      </DxColumn>

      <DxColumn
        data-field="HireDate"
        data-type="date"
      />

      <DxColumnChooser
        :enabled="true"
        :mode="mode"
      >
        <DxPosition
          my="right top"
          at="right bottom"
          of=".dx-datagrid-column-chooser-button"
        />

        <DxColumnChooserSearch
          :enabled="searchEnabled"
          :editor-options="editorOptions"
        />
        <DxColumnChooserSelection
          :allow-select-all="allowSelectAll"
          :select-by-click="selectByClick"
          :recursive="recursive"
        />
      </DxColumnChooser>
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>

      <div class="selectboxes-container">
        <div class="option">
          <span>Column chooser mode </span>
          <DxSelectBox
            :items="columnChooserModes"
            v-model:value="mode"
            value-expr="key"
            display-expr="name"
          />
        </div>
      </div>

      <div class="checkboxes-container">
        <div class="option">
          <DxCheckBox
            v-model:value="searchEnabled"
            text="Search enabled"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="allowSelectAll"
            text="Allow select all"
            :disabled="mode === 'dragAndDrop'"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="selectByClick"
            text="Select by click"
            :disabled="mode === 'dragAndDrop'"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="recursive"
            text="Recursive"
            :disabled="mode === 'dragAndDrop'"
          />
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import {
  DxDataGrid, DxColumn, DxColumnChooser, DxColumnChooserSearch, DxColumnChooserSelection,
  DxPosition,
} from 'devextreme-vue/data-grid';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { employees } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnChooser,
    DxColumnChooserSearch,
    DxColumnChooserSelection,
    DxSelectBox,
    DxCheckBox,
    DxPosition,
  },
  data() {
    return {
      employees,
      columnChooserModes: [{
        key: 'dragAndDrop',
        name: 'Drag and drop',
      }, {
        key: 'select',
        name: 'Select',
      }],
      mode: 'select',
      searchEnabled: true,
      allowSelectAll: true,
      selectByClick: true,
      recursive: true,
      editorOptions: { placeholder: 'Search column' },
    };
  },
};
</script>
<style scoped>
#employees {
  max-height: 440px;
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

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
}

.selectbox-container {
  display: flex;
}

.checkboxes-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 15px;
}

.checkboxes-container > .option {
  margin: 10px 30px 10px 0;
  width: 200px;
}
</style>
