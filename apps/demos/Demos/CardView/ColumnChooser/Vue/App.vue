<template>
  <div className="options-panel">
    <div className="caption">Options</div>
    <div className="options-container">
      <div className="option">
        <span>Column Chooser Mode:</span>
        <DxSelectBox
          :data-source="['dragAndDrop', 'select']"
          :input-attr="{ 'aria-label': 'Column Chooser Mode' }"
          :value="columnChooserMode"
          @value-changed="({ value }) => { columnChooserMode = value; }"
        />
      </div>
      <div className="option">
        <DxCheckBox
          text="Search Enabled"
          :value="searchEnabled"
          @value-changed="({ value }) => { searchEnabled = value; }"
        />
      </div>
      <div className="option">
        <DxCheckBox
          text="Allow Select All"
          :value="allowSelectAll"
          @value-changed="({ value }) => { allowSelectAll = value; }"
          :disabled="columnChooserMode !== 'select'"
        />
      </div>
      <div className="option">
        <DxCheckBox
          text="Select By Click On Item"
          :value="selectByClick"
          @value-changed="({ value }) => { selectByClick = value; }"
          :disabled="columnChooserMode !== 'select'"
        />
      </div>
      <div className="option">
        <DxCheckBox
          text="Allow Column Reordering"
          :value="allowColumnReordering"
          @value-changed="({ value }) => { allowColumnReordering = value; }"
        />
      </div>
    </div>
  </div>
  <DxCardView
    :data-source="employees"
    key-expr="ID"
    cards-per-row="auto"
    :card-min-width="300"
    :selected-card-keys="[4, 6]"
    :allow-column-reordering="allowColumnReordering"
  >
    <DxSearchPanel
      :visible="true"
    />
    <DxColumnChooser
      :enabled="true"
      :mode="columnChooserMode"
      height="340px"
    >
      <DxColumnChooserSearch
        :enabled="searchEnabled"
      />
      <DxColumnChooserSelection
        :allow-select-all="allowSelectAll"
        :select-by-click="selectByClick"
      />
    </DxColumnChooser>
    <DxCardCover
      :alt-expr="altExpr"
      :image-expr="imageExpr"
    />
    <DxColumn
      data-field="FullName"
      :calculate-field-value="calculateFullName"
      :allow-hiding="false"
    />
    <DxColumn
      data-field="Birth_Date"
      data-type="date"
    />
    <DxColumn
      data-field="Hire_Date"
      data-type="date"
    />
    <DxColumn data-field="Position"/>
    <DxColumn data-field="Department"/>
    <DxColumn data-field="State"/>
    <DxColumn data-field="City"/>
    <DxColumn
      data-field="Phone"
      :allow-hiding="false"
    />
    <DxColumn
      data-field="Email"
      :visible="false"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxCardView, DxColumn, DxCardCover, DxSearchPanel, DxColumnChooser,
  DxColumnChooserSearch, DxColumnChooserSelection,
} from 'devextreme-vue/card-view';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { employees, type Employee } from './data.ts';

function altExpr({ First_Name, Last_Name }: Employee): string {
  return `Photo of ${First_Name} ${Last_Name}`;
}

function imageExpr({ First_Name, Last_Name }: Employee): string {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

function calculateFullName({ First_Name, Last_Name }: Employee): string {
  return `${First_Name} ${Last_Name}`;
}

const columnChooserMode = ref<'select' | 'dragAndDrop'>('select');
const searchEnabled = ref(true);
const allowSelectAll = ref(true);
const selectByClick = ref(true);
const allowColumnReordering = ref(false);

</script>
<style>
  .options-panel {
    margin-top: 20px;
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
  }

  .options-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin: 10px;
    display: flex;
    align-items: center;
    width: fit-content;
  }

  .option > .dx-selectbox {
    width: 200px;
    display: inline-block;
    vertical-align: middle;
  }

  .option > span {
    margin-right: 10px;
  }
</style>
