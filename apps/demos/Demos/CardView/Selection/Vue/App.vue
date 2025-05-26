<template>
  <div className="options">
    <div className="caption">Options</div>
    <div className="options-container">
      <div className="option">
        <span>Selection Mode</span>
        <DxSelectBox
          :data-source="['single', 'multiple']"
          :value="selectionMode"
          @value-changed="onSelectionModeChange"
        ></DxSelectBox>
      </div>
      <div className="option">
        <span>Show Checkboxes Mode</span>
        <DxSelectBox
          :data-source="['always', 'none', 'onClick', 'onLongTap']"
          :value="showCheckBoxesMode"
          @value-changed="e => showCheckBoxesMode = e.value"
          :disabled="selectionMode !== 'multiple'"
        ></DxSelectBox>
      </div>
      <div className="option">
        <span>Allow Select All</span>
        <DxSelectBox
          :data-source="[true, false]"
          :value="allowSelectAll"
          @value-changed="e => allowSelectAll = e.value"
          :disabled="selectionMode !== 'multiple'"
        ></DxSelectBox>
      </div>
      <div className="option">
        <span>Select All Mode</span>
        <DxSelectBox
          :data-source="['allPages', 'page']"
          :value="selectAllMode"
          @value-changed="e =>selectAllMode = e.value "
          :disabled="selectionMode !== 'multiple' || !allowSelectAll"
        ></DxSelectBox>
      </div>
    </div>
  </div>
  <DxCardView
    id="cardView"
    :data-source="employees"
    key-expr="ID"
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
  import { DxCardView, DxColumn, DxSelection, DxCardCover } from 'devextreme-vue/card-view';
  import { DxSelectBox, DxSelectBoxTypes} from 'devextreme-vue/select-box';
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

  const onSelectionModeChange = (e: DxSelectBoxTypes.ValueChangedEvent) => {
    selectionMode.value = e.value;
    cardViewRef.value.instance.clearSelection();
  };
</script>
<style>
  .options {
    margin-top: 20px;
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
  }

  .options-container {
    display: flex;
    flex-wrap: wrap;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin: 10px;
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