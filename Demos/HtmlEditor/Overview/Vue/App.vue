<template>
  <div>
    <DxHtmlEditor
      :value="markup"
      height="725px"
    >
      <DxMediaResizing :enabled="true"/>
      <DxImageUpload
        :tabs="currentTabs"
        file-upload-mode="base64"
      />
      <DxToolbar :multiline="isMultiline">
        <DxItem name="undo"/>
        <DxItem name="redo"/>
        <DxItem name="separator"/>
        <DxItem
          :accepted-values="sizeValues"
          name="size"
        />
        <DxItem
          :accepted-values="fontValues"
          name="font"
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
        <DxItem name="orderedList"/>
        <DxItem name="bulletList"/>
        <DxItem name="separator"/>
        <DxItem
          :accepted-values="headerValues"
          name="header"
        />
        <DxItem name="separator"/>
        <DxItem name="color"/>
        <DxItem name="background"/>
        <DxItem name="separator"/>
        <DxItem name="link"/>
        <DxItem name="image"/>
        <DxItem name="separator"/>
        <DxItem name="clear"/>
        <DxItem name="codeBlock"/>
        <DxItem name="blockquote"/>
        <DxItem name="separator"/>
        <DxItem name="insertTable"/>
        <DxItem name="deleteTable"/>
        <DxItem name="insertRowAbove"/>
        <DxItem name="insertRowBelow"/>
        <DxItem name="deleteRow"/>
        <DxItem name="insertColumnLeft"/>
        <DxItem name="insertColumnRight"/>
        <DxItem name="deleteColumn"/>
      </DxToolbar>
    </DxHtmlEditor>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="isMultiline"
          text="Multiline toolbar"
        />
      </div>
      <div class="option">
        <div class="label">Image upload tabs:</div>
        <DxSelectBox
          :items="tabs"
          :input-attr="{ 'aria-label': 'Tab' }"
          v-model:value="currentTabs"
          display-expr="name"
          value-expr="value"
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
  DxImageUpload,
  DxItem,
} from 'devextreme-vue/html-editor';
import {
  DxCheckBox,
} from 'devextreme-vue/check-box';
import {
  DxSelectBox,
} from 'devextreme-vue/select-box';
import { markup, tabs } from './data.js';

export default {
  components: {
    DxHtmlEditor,
    DxMediaResizing,
    DxToolbar,
    DxItem,
    DxImageUpload,
    DxCheckBox,
    DxSelectBox,
  },
  data() {
    return {
      markup,
      tabs,
      sizeValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
      fontValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
      headerValues: [false, 1, 2, 3, 4, 5],
      currentTabs: tabs[2].value,
      isMultiline: true,
    };
  },
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
  display: inline-block;
  margin-right: 40px;
}

.option > .dx-selectbox,
.option > .label {
  display: inline-block;
  vertical-align: middle;
}

.option > .label {
  margin-right: 10px;
}
</style>
