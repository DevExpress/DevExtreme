<template>
  <div className="options-panel">
    <div className="caption">Options</div>
    <div className="options-container">
      <div className="option">
        <span>Selection Mode</span>
        <DxSelectBox
          :data-source="['single', 'multiple']"
          :input-attr="{ 'aria-label': 'Selection Mode'}"
          :value="selectionMode"
          @value-changed="onSelectionModeChange"
        />
      </div>
      <div className="option">
        <span>Show Checkboxes Mode</span>
        <DxSelectBox
          :data-source="['always', 'none', 'onClick', 'onLongTap']"
          :input-attr="{ 'aria-label': 'Show Checkboxes Mode'}"
          :value="showCheckBoxesMode"
          @value-changed="({ value }) => { showCheckBoxesMode = value; }"
          :disabled="selectionMode !== 'multiple'"
        />
      </div>
      <div className="option">
        <span>Select All Mode</span>
        <DxSelectBox
          :data-source="['allPages', 'page']"
          :input-attr="{ 'aria-label': 'Select All Mode'}"
          :value="selectAllMode"
          @value-changed="e =>selectAllMode = e.value "
          :disabled="selectionMode !== 'multiple' || !allowSelectAll"
        />
      </div>
      <div className="option">
        <DxCheckBox
          text="Allow Select All"
          :value="allowSelectAll"
          @value-changed="e => allowSelectAll = e.value"
          :disabled="selectionMode !== 'multiple'"
        />
      </div>
    </div>
  </div>
  <DxCardView
    id="cardView"
    :data-source="employees"
    key-expr="ID"
    :card-min-width="100"
    :word-wrap-enabled="true"
    :selected-card-keys="[4, 6]"
    ref="cardViewRef"
  >
    <DxCardCover
      :alt-expr="altExpr"
      :image-expr="imageExpr"
    />
    <DxSelection
      :mode="selectionMode"
      :show-check-boxes-mode="showCheckBoxesMode"
      :allow-select-all="allowSelectAll"
      :select-all-mode="selectAllMode"
    />
    <DxColumn
      data-field="FullName"
    />
    <DxColumn
      data-field="Position"
    />
    <DxColumn
      data-field="Phone"
    />
    <DxColumn
      data-field="Email"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxCardView, DxColumn, DxSelection, DxCardCover,
} from 'devextreme-vue/card-view';
import { DxSelectBox, type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { employees, type Employee } from './data.ts';

function altExpr({ FullName }: Employee): string {
  return `Photo of ${FullName}`;
}

function imageExpr({ FullName }: Employee): string {
  return `../../../../images/employees/new/${FullName}.jpg`;
}

const selectionMode = ref<'single' | 'multiple'>('multiple');
const allowSelectAll = ref(true);
const showCheckBoxesMode = ref<'always' | 'none' | 'onClick' | 'onLongTap'>('always');
const selectAllMode = ref<'allPages' | 'page'>('allPages');

const cardViewRef = ref();

const onSelectionModeChange = ({ value }: DxSelectBoxTypes.ValueChangedEvent): void => {
  selectionMode.value = value;
  cardViewRef.value.instance.clearSelection();
};
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
    width: 150px;
    display: inline-block;
    vertical-align: middle;
  }

  .option > span {
    margin-right: 10px;
  }
</style>
