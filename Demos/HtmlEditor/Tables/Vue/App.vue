<template>
  <div>
    <DxHtmlEditor
      :value="markup"
      height="750px"
    >
      <DxTableContextMenu :enabled="contextMenuEnabled"/>
      <DxTableResizing :enabled="allowResizing"/>
      <DxToolbar>
        <DxItem name="bold"/>
        <DxItem name="color"/>
        <DxItem name="separator"/>
        <DxItem name="alignLeft"/>
        <DxItem name="alignCenter"/>
        <DxItem name="alignRight"/>
        <DxItem name="separator"/>
        <DxItem name="insertTable"/>
        <DxItem name="insertHeaderRow"/>
        <DxItem name="insertRowAbove"/>
        <DxItem name="insertRowBelow"/>
        <DxItem name="separator"/>
        <DxItem name="insertColumnLeft"/>
        <DxItem name="insertColumnRight"/>
        <DxItem name="separator"/>
        <DxItem name="deleteColumn"/>
        <DxItem name="deleteRow"/>
        <DxItem name="deleteTable"/>
        <DxItem name="separator"/>
        <DxItem name="cellProperties"/>
        <DxItem name="tableProperties"/>
      </DxToolbar>
    </DxHtmlEditor>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowResizing"
          text="Allow Table Resizing"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="contextMenuEnabled"
          text="Enable Table Context Menu"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxHtmlEditor,
  DxTableContextMenu,
  DxTableResizing,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/html-editor';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { markup } from './data.js';

const allowResizing = ref(true);
const contextMenuEnabled = ref(true);
</script>
<style>
.demo-container {
  height: 950px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>
