<template>
  <div>
    <div class="form">
      <h4>Employees</h4>
      <DxTreeView
        id="treeview"
        :ref="treeViewRef"
        :width="340"
        :height="320"
        :items="employees"
        :show-check-boxes-mode="showCheckBoxesModeValue"
        :selection-mode="selectionModeValue"
        :select-nodes-recursive="selectNodesRecursiveValue"
        :select-by-click="selectByClickValue"
        @selection-changed="treeViewSelectionChanged"
        @content-ready="treeViewContentReady"
      >
        <template #item="item">
          {{ item.data.fullName + ' (' + item.data.position + ')' }}
        </template>
      </DxTreeView>
      <div class="selected-container">Selected employees
        <DxList
          id="selected-employees"
          show-scrollbar="always"
          :width="400"
          :height="200"
          :items="selectedEmployees"
        >
          <template #item="item">
            {{ item.data.prefix + " " + item.data.fullName + " (" + item.data.position + ")" }}
          </template>
        </DxList>
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <span>Show Check Boxes Mode:</span>
          <div class="editor-container">
            <DxSelectBox
              :items="showCheckBoxesModes"
              :input-attr="{ 'aria-label': 'Show Checkboxes Mode' }"
              v-model:value="showCheckBoxesModeValue"
              @value-changed="showCheckBoxesModeValueChanged"
            />
          </div>
        </div>
        <div class="option">
          <span>Selection Mode:</span>
          <div class="editor-container">
            <DxSelectBox
              :items="selectionModes"
              v-model:value="selectionModeValue"
              :input-attr="{ 'aria-label': 'Selection Mode' }"
              :disabled="isSelectionModeDisabled"
              @value-changed="selectionModeValueChanged"
            />
          </div>
        </div>
        <div class="option">
          <div class="caption-placeholder">&nbsp;</div>
          <div class="editor-container">
            <DxCheckBox
              text="Select Nodes Recursive"
              :disabled="isRecursiveDisabled"
              v-model:value="selectNodesRecursiveValue"
            />
          </div>
        </div>
        <div class="option">
          <div class="caption-placeholder">&nbsp;</div>
          <div class="editor-container">
            <DxCheckBox
              text="Select By Click"
              v-model:value="selectByClickValue"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxTreeView from 'devextreme-vue/tree-view';
import DxList from 'devextreme-vue/list';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';

import { employees } from './data.js';

const treeViewRef = 'treeView';

export default {
  components: {
    DxTreeView,
    DxList,
    DxSelectBox,
    DxCheckBox,
  },
  data() {
    const selectionModes = ['multiple', 'single'];
    const showCheckBoxesModes = ['normal', 'selectAll', 'none'];
    return {
      employees,
      selectedEmployees: [],
      showCheckBoxesModes,
      selectionModes,
      showCheckBoxesModeValue: showCheckBoxesModes[0],
      selectionModeValue: selectionModes[0],
      isSelectionModeDisabled: false,
      isRecursiveDisabled: false,
      selectNodesRecursiveValue: true,
      selectByClickValue: false,
      treeViewRef,
    };
  },
  computed: {
    treeView() {
      return this.$refs[treeViewRef].instance;
    },
  },
  methods: {
    treeViewSelectionChanged(e) {
      this.syncSelection(e.component);
    },

    treeViewContentReady(e) {
      this.syncSelection(e.component);
    },

    syncSelection(treeView) {
      const selectedEmployees = treeView.getSelectedNodes()
        .map((node) => node.itemData);

      this.selectedEmployees = selectedEmployees;
    },

    showCheckBoxesModeValueChanged(e) {
      if (e.value === 'selectAll') {
        this.selectionModeValue = 'multiple';
        this.isRecursiveDisabled = false;
      }
      this.isSelectionModeDisabled = e.value === 'selectAll';
    },

    selectionModeValueChanged(e) {
      if (e.value === 'single') {
        this.selectNodesRecursiveValue = false;
        this.treeView.unselectAll();
      }
      this.isRecursiveDisabled = e.value === 'single';
    },
  },
};
</script>
<style scoped>
.form > h4 {
  margin-bottom: 20px;
}

.form > div,
#treeview {
  display: inline-block;
  vertical-align: top;
}

.selected-container {
  padding: 20px;
  margin-left: 24px;
  background-color: rgba(191, 191, 191, 0.15);
  font-size: 115%;
  font-weight: bold;
}

#selected-employees {
  margin-top: 20px;
}

.dx-list-item-content {
  padding-left: 0;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
  box-sizing: border-box;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  width: 24%;
  margin-top: 10px;
  margin-right: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.options-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.editor-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.editor-container > * {
  width: 100%;
}

.option:last-of-type {
  margin-right: 0;
}
</style>
