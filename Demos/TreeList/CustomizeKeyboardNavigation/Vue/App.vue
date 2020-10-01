<template>
  <div id="tree-list-demo">
    <DxTreeList
      id="employees"
      :data-source="dataSource"
      :column-auto-width="true"
      :expanded-row-keys="expandedRowKeys"
      :on-focused-cell-changing="onFocusedCellChanging"
      key-expr="ID"
      parent-id-expr="Head_ID"
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
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
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
            v-model:value="enterKeyAction"
            class="select"
          />
        </div>
        <div class="option">
          <span class="option-caption">Enter Key Direction</span>
          <DxSelectBox
            :items="enterKeyDirections"
            v-model:value="enterKeyDirection"
            class="select"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxKeyboardNavigation
} from 'devextreme-vue/tree-list';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import { employees } from './data.js';

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxEditing,
    DxKeyboardNavigation,
    DxCheckBox,
    DxSelectBox
  },
  data() {
    return {
      dataSource: employees,
      expandedRowKeys: [1, 2, 4, 5],
      editOnKeyPress: true,
      enterKeyActions: ['startEdit', 'moveFocus'],
      enterKeyDirections: ['none', 'column', 'row'],
      enterKeyDirection: 'column',
      enterKeyAction: 'moveFocus'
    };
  },
  methods: {
    onFocusedCellChanging(e) {
      e.isHighlighted = true;
    }
  }
};
</script>
