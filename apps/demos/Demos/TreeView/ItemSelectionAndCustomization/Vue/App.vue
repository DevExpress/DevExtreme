<template>
  <div>
    <div class="form">
      <h4>Employees</h4>
      <DxTreeView
        id="treeview"
        ref="treeViewRef"
        :width="340"
        :height="320"
        :items="employees"
        :show-check-boxes-mode="checkboxVisibility"
        :selection-mode="selectionModeValue"
        :disabled-node-selection-mode="disabledNodeSelectionModeValue"
        :select-nodes-recursive="recursiveSelection"
        :select-by-click="selectOnClick"
        @selection-changed="treeViewSelectionChanged"
        @content-ready="treeViewContentReady"
      >
        <template #item="item">
          {{ item.data.fullName + ' (' + item.data.position + ')' }}
        </template>
      </DxTreeView>
      {{ ' ' }}
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
        <div class="options-section">
          <div class="option">
            <span>Checkbox Visibility:</span>
            <div class="editor-container">
              <DxSelectBox
                :items="checkboxVisibilityOptions"
                :input-attr="{ 'aria-label': 'Checkbox Visibility' }"
                v-model:value="checkboxVisibility"
                @value-changed="checkboxVisibilityValueChanged"
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
            <span>Disabled Node Selection Mode:</span>
            <div class="editor-container">
              <DxSelectBox
                :items="disabledNodeSelectionModes"
                v-model:value="disabledNodeSelectionModeValue"
                :input-attr="{ 'aria-label': 'Disabled Node Selection Mode' }"
              />
            </div>
          </div>
        </div>
        <div class="options-section">
          <div class="option">
            <div class="caption-placeholder">&nbsp;</div>
            <div class="editor-container">
              <DxCheckBox
                text="Recursive Selection"
                :disabled="isRecursiveDisabled"
                v-model:value="recursiveSelection"
              />
            </div>
          </div>
          <div class="option">
            <div class="caption-placeholder">&nbsp;</div>
            <div class="editor-container">
              <DxCheckBox
                text="Select on Click"
                v-model:value="selectOnClick"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { type SingleOrMultiple } from 'devextreme-vue/common';
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import DxList from 'devextreme-vue/list';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees } from './data.ts';
import type { Employee } from './types';

const selectionModes: SingleOrMultiple[] = ['multiple', 'single'];
const checkboxVisibilityOptions: DxTreeViewTypes.TreeViewCheckBoxMode[] = ['normal', 'selectAll', 'none'];
const disabledNodeSelectionModes: DxTreeViewTypes.DisabledNodeSelectionMode[] = ['never', 'recursiveAndAll'];
const selectedEmployees = ref([]);
const checkboxVisibility = ref(checkboxVisibilityOptions[0]);
const selectionModeValue = ref(selectionModes[0]);
const disabledNodeSelectionModeValue = ref(disabledNodeSelectionModes[0]);
const isSelectionModeDisabled = ref(false);
const isRecursiveDisabled = ref(false);
const recursiveSelection = ref(true);
const selectOnClick = ref(false);
const treeViewRef = ref();

function treeViewSelectionChanged() {
  syncSelection();
}
function treeViewContentReady() {
  syncSelection();
}
function syncSelection() {
  selectedEmployees.value = treeViewRef.value.instance
    .getSelectedNodes()
    .map((node: DxTreeViewTypes.Node<Employee>) => node.itemData);
}
function checkboxVisibilityValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
  if (e.value === 'selectAll') {
    selectionModeValue.value = 'multiple';
    isRecursiveDisabled.value = false;
  }
  isSelectionModeDisabled.value = e.value === 'selectAll';
}
function selectionModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
  if (e.value === 'single') {
    recursiveSelection.value = false;
    treeViewRef.value.instance.unselectAll();
  }
  isRecursiveDisabled.value = e.value === 'single';
}
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
  margin-left: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  font-size: 115%;
  font-weight: bold;
}

#selected-employees {
  margin-top: 20px;
}

.selected-container .dx-list-item-content {
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
  width: 30%;
  margin-top: 10px;
  margin-right: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.options-container {
  display: flex;
  flex-direction: column;
}

.options-section {
  display: flex;
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
