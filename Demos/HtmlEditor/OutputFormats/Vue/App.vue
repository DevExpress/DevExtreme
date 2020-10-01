<template>
  <div class="widget-container">
    <DxHtmlEditor
      v-model:value="valueContent"
      :value-type="editorValueType"
      :height="300"
    >
      <DxToolbar>
        <DxItem format-name="undo"/>
        <DxItem format-name="redo"/>
        <DxItem format-name="separator"/>
        <DxItem
          :format-values="sizeValues"
          format-name="size"
        />
        <DxItem
          :format-values="fontValues"
          format-name="font"
        />
        <DxItem format-name="separator"/>
        <DxItem format-name="bold"/>
        <DxItem format-name="italic"/>
        <DxItem format-name="strike"/>
        <DxItem format-name="underline"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="alignLeft"/>
        <DxItem format-name="alignCenter"/>
        <DxItem format-name="alignRight"/>
        <DxItem format-name="alignJustify"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="color"/>
        <DxItem format-name="background"/>
      </DxToolbar>
    </DxHtmlEditor>

    <div class="options">
      <DxButtonGroup v-model:selected-items="selectedItems">
        <DxButtonGroupItem text="Html"/>
        <DxButtonGroupItem text="Markdown"/>
      </DxButtonGroup>
      <div class="value-content">{{ valueContent }}</div>
    </div>
  </div>
</template>
<script>

import {
  DxHtmlEditor,
  DxToolbar,
  DxItem
} from 'devextreme-vue/html-editor';
import {
  DxButtonGroup,
  DxItem as DxButtonGroupItem
} from 'devextreme-vue/button-group';

import { markup } from './data.js';

import 'devextreme/ui/html_editor/converters/markdown';

export default {
  components: {
    DxHtmlEditor,
    DxToolbar,
    DxItem,
    DxButtonGroup,
    DxButtonGroupItem
  },
  data() {
    return {
      valueContent: markup,
      selectedItems: [{ text: 'Html' }],
      sizeValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
      fontValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana']
    };
  },
  computed: {
    editorValueType: function() {
      return this.selectedItems[0].text.toLowerCase();
    }
  }
};
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
