<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="employees"
      :show-borders="true"
      :on-focused-cell-changing="onFocusedCellChanging"
      key-expr="ID"
    >
      <DxKeyboardNavigation
        :edit-on-key-press="editOnKeyPress"
        :enter-key-action="enterKeyAction"
        :enter-key-direction="enterKeyDirection"
      />
      <DxEditing
        :allow-updating="true"
        mode="batch"
        start-edit-action="dblClick"
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
      <div class="option-container">
        <div class="option check-box">
          <DxCheckBox
            v-model:value="editOnKeyPress"
            text="Edit On Key Press"
          />
        </div>
        <div class="option">
          <span class="option-caption">Enter Key Action</span>
          <DxSelectBox
            :items="enterKeyActions"
            :input-attr="{ 'aria-label': 'Key Action' }"
            v-model:value="enterKeyAction"
            class="select"
          />
        </div>
        <div class="option">
          <span class="option-caption">Enter Key Direction</span>
          <DxSelectBox
            :items="enterKeyDirections"
            :input-attr="{ 'aria-label': 'Key Direction' }"
            v-model:value="enterKeyDirection"
            class="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxKeyboardNavigation,
  DxColumn,
  DxPaging,
  DxEditing,
  DxLookup,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';

import { FocusedCellChangingEvent } from 'devextreme/ui/data_grid';

import { employees, states } from './data.ts';

const enterKeyActions = ['startEdit', 'moveFocus'];
const enterKeyDirections = ['none', 'column', 'row'];

const editOnKeyPress = ref(true);
const enterKeyDirection = ref('column');
const enterKeyAction = ref('moveFocus');

const onFocusedCellChanging = (e: FocusedCellChangingEvent) => {
  e.isHighlighted = true;
};
</script>
