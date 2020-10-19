<template>
  <div>
    <DxHtmlEditor height="350px">
      <DxToolbar>
        <DxItem
          :format-values="headerValues"
          format-name="header"
        />
        <DxItem format-name="separator"/>
        <DxItem format-name="bold"/>
        <DxItem format-name="color"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="alignLeft"/>
        <DxItem format-name="alignCenter"/>
        <DxItem format-name="alignRight"/>
        <DxItem format-name="separator"/>
        <DxItem format-name="insertTable"/>
        <DxItem format-name="deleteTable"/>
        <DxItem format-name="insertRowAbove"/>
        <DxItem format-name="insertRowBelow"/>
        <DxItem format-name="deleteRow"/>
        <DxItem format-name="insertColumnLeft"/>
        <DxItem format-name="insertColumnRight"/>
        <DxItem format-name="deleteColumn"/>
      </DxToolbar>

      <div v-html="markup"/>
    </DxHtmlEditor>
  </div>
</template>
<script>

import {
  DxHtmlEditor,
  DxToolbar,
  DxItem
} from 'devextreme-vue/html-editor';
import { markup } from './data.js';

export default {
  components: {
    DxHtmlEditor,
    DxToolbar,
    DxItem
  },
  data() {
    return {
      markup,
      headerValues: [false, 1, 2, 3],
    };
  }
};
</script>
