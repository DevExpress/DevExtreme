<template>
  <div>
    <DxHtmlEditor height="350px">
      <DxToolbar>
        <DxItem
          :accepted-values="headerValues"
          name="header"
        />
        <DxItem name="separator"/>
        <DxItem name="bold"/>
        <DxItem name="color"/>
        <DxItem name="separator"/>
        <DxItem name="alignLeft"/>
        <DxItem name="alignCenter"/>
        <DxItem name="alignRight"/>
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
