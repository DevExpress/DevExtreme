<!-- eslint-disable vue/max-len -->
<script setup>
import { reactive } from 'vue';
import {
  DxCardView,
  DxColumn,
  DxCardCover,
  DxPaging,
  DxPager,
} from 'devextreme-vue/card-view';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { employees } from './data.js';

const state = reactive({
  dataSource: employees,
  mode: 'select',
  searchEnabled: true,
  allowSelectAll: true,
  selectByClick: true,
  recursive: true,
});

const columnChooserModes = [
  { key: 'dragAndDrop', name: 'Drag and drop' },
  { key: 'select', name: 'Select' },
];

const onModeChanged = (e) => {
  state.mode = e.value;
};

const onSearchEnabledChanged = (e) => {
  state.searchEnabled = e.value;
};

const onAllowSelectAllChanged = (e) => {
  state.allowSelectAll = e.value;
};

const onSelectByClickChanged = (e) => {
  state.selectByClick = e.value;
};

const onRecursiveChanged = (e) => {
  state.recursive = e.value;
};

</script>

<template>
  <div>
    <DxCardView :data-source="state.dataSource" key-expr="ID" :cards-per-row="3" :columns="[]" :column-chooser="{
      enabled: true,
      mode: state.mode,
      position: {
        at: 'center center',
      },
      width: 300,
      height: 500,
      search: {
        enabled: state.searchEnabled,
      },
      selection: {
        allowSelectAll: state.allowSelectAll,
        recursive: state.recursive,
        selectByClick: state.selectByClick,
      },
    }">
      <DxColumn data-field="ID"/>
      <DxColumn caption="Full Name" :calculate-cell-value="(data) => `${data.FirstName} ${data.LastName}`"/>
      <DxColumn data-field="Prefix"/>
      <DxColumn data-field="Position"/>
      <DxColumn data-field="BirthDate"/>
      <DxColumn data-field="HireDate"/>
      <DxColumn data-field="Address"/>
      <DxCardCover
        :image-expr="(data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`"
        alt-expr="FirstName"
        />
      <DxPaging :page-size="6"/>
      <DxPager :visible="true" :show-page-size-selector="true" :allowed-page-sizes="'auto'" />
    </DxCardView>

    <div class="options">
      <div class="caption">Column Chooser Options</div>
      <div class="option">
        <span>Select Mode:</span>
      <DxSelectBox :items="columnChooserModes" :value="state.mode" value-expr="key" display-expr="name"
          :input-attr="{ 'aria-label': 'Column Chooser Mode' }" @value-changed="onModeChanged"
          />
      </div>
      <div class="checkboxes-container">
        <div class="option">
          <DxCheckBox text="Search Enabled" :value="state.searchEnabled" @value-changed="onSearchEnabledChanged"/>
        </div>
        <div class="option">
          <DxCheckBox text="Allow Select All" :value="state.allowSelectAll" @value-changed="onAllowSelectAllChanged"/>
        </div>
        <div class="option">
          <DxCheckBox text="Select By Click" :value="state.selectByClick" @value-changed="onSelectByClickChanged"/>
        </div>
        <div class="option">
          <DxCheckBox text="Recursive" :value="state.recursive" @value-changed="onRecursiveChanged"/>
        </div>
      </div>
    </div>
  </div>
</template>
