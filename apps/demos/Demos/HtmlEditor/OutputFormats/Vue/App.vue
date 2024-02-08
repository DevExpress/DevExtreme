<template>
  <div class="widget-container">
    <DxHtmlEditor
      v-model:value="valueContent"
      :value-type="editorValueType"
      :height="300"
    >
      <DxToolbar>
        <DxItem name="undo"/>
        <DxItem name="redo"/>
        <DxItem name="separator"/>
        <DxItem
          name="size"
          :accepted-values="sizeValues"
          :options="fontSizeOptions"
        />
        <DxItem
          name="font"
          :accepted-values="fontValues"
          :options="fontFamilyOptions"
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
        <DxItem name="color"/>
        <DxItem name="background"/>
      </DxToolbar>
    </DxHtmlEditor>

    <div class="options">
      <DxButtonGroup v-model:selected-items="selectedItems">
        <DxButtonGroupItem text="Html"/>
        <DxButtonGroupItem text="Markdown"/>
      </DxButtonGroup>
      <div
        class="value-content"
        tabindex="0"
      >{{ prettierFormat(valueContent) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxHtmlEditor,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/html-editor';
import {
  DxButtonGroup,
  DxItem as DxButtonGroupItem,
} from 'devextreme-vue/button-group';
import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/parser-html';
import { markup } from './data.ts';
import 'devextreme/ui/html_editor/converters/markdown';

const valueContent = ref(markup);
const selectedItems = ref([{ text: 'Html' }]);
const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const fontSizeOptions = { inputAttr: { 'aria-label': 'Font size' } };
const fontFamilyOptions = { inputAttr: { 'aria-label': 'Font family' } };

const editorValueType = computed(() => selectedItems.value[0].text.toLowerCase());

function prettierFormat(text) {
  if (editorValueType.value === 'html') {
    return prettier.format(text, {
      parser: 'html',
      plugins: [parserHtml],
    });
  }

  return text;
}
</script>
<style>
.dx-htmleditor-content img {
  vertical-align: middle;
  padding-right: 10px;
}

.value-content {
  margin-top: 20px;
  overflow: auto;
  height: 110px;
  width: 100%;
  white-space: pre-wrap;
}

.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  box-sizing: border-box;
  width: 100%;
}
</style>
