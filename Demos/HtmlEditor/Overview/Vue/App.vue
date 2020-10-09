<template>
  <div>
    <DxHtmlEditor height="725px">
      <DxMediaResizing :enabled="true"/>
      <DxToolbar :multiline="isMultiline">
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
        <DxItem format-name="orderedList"/>
        <DxItem format-name="bulletList"/>
        <DxItem format-name="separator"/>
        <DxItem
          :format-values="headerValues"
          format-name="header"
        />
        <DxItem format-name="separator"/>
        <DxItem format-name="color"/>
        <DxItem format-name="background"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="link"/>
        <DxItem format-name="image"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="clear"/>
        <DxItem format-name="codeBlock"/>
        <DxItem format-name="blockquote"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="insertTable"/>
        <DxItem format-name="insertRowAbove"/>
        <DxItem format-name="insertRowBelow"/>
        <DxItem format-name="insertColumnLeft"/>
        <DxItem format-name="insertColumnRight"/>
        <DxItem format-name="deleteRow"/>
        <DxItem format-name="deleteColumn"/>
        <DxItem format-name="deleteTable"/>
      </DxToolbar>

      <div v-html="markup"/>
    </DxHtmlEditor>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="isMultiline"
          text="Multiline toolbar"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  DxHtmlEditor,
  DxToolbar,
  DxMediaResizing,
  DxItem
} from 'devextreme-vue/html-editor';
import {
  DxCheckBox
} from 'devextreme-vue/check-box';
import { markup } from './data.js';

export default {
  components: {
    DxHtmlEditor,
    DxMediaResizing,
    DxToolbar,
    DxItem,
    DxCheckBox
  },
  data() {
    return {
      markup,
      sizeValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
      fontValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
      headerValues: [false, 1, 2, 3, 4, 5],
      isMultiline: true
    };
  }
};
</script>
<style>
.dx-htmleditor-content img {
    vertical-align: middle;
    padding-right: 10px;
}

.dx-htmleditor-content table {
    width: 50%;
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
