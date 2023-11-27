<template>
  <div class="widget-container">
    <DxHtmlEditor
      v-model:value="value"
    >
      <DxToolbar>
        <DxItem name="undo"/>
        <DxItem name="redo"/>
        <DxItem name="separator"/>
        <DxItem
          name="header"
          :accepted-values="headerValues"
          :options="headerOptions"
        />
        <DxItem name="separator"/>
        <DxItem name="bold"/>
        <DxItem name="italic"/>
        <DxItem name="strike"/>
        <DxItem name="underline"/>
        <DxItem name="separator"/>
        <DxItem name="alignLeft"/>
        <DxItem name="alignCenter"/>
        <DxItem name="alignRight"/>
        <DxItem name="alignJustify"/>
        <DxItem name="separator"/>
        <DxItem
          :options="toolbarButtonOptions"
          widget="dxButton"
        />
      </DxToolbar>
    </DxHtmlEditor>
    <DxPopup
      :show-title="true"
      v-model:visible="popupVisible"
      title="Markup"
    >
      {{ value }}
    </DxPopup>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxHtmlEditor,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/html-editor';
import { DxPopup } from 'devextreme-vue/popup';
import { markup } from './data.ts';

const value = ref(markup);
const popupVisible = ref(false);
const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = { inputAttr: { 'aria-label': 'Header' } };
const toolbarButtonOptions = {
  text: 'Show markup',
  stylingMode: 'text',
  onClick: () => {
    popupVisible.value = true;
  },
};
</script>
<style>
.dx-htmleditor-content img {
  vertical-align: middle;
  padding-right: 10px;
}
</style>
