<template>
  <div class="widget-container">
    <DxHtmlEditor
      v-model:value="valueContent"
      :height="300"
      :converter="converter"
    >
      <DxToolbar>
        <DxItem name="undo"/>
        <DxItem name="redo"/>
        <DxItem name="separator"/>
        <DxItem name="bold"/>
        <DxItem name="italic"/>
        <DxItem name="separator"/>
        <DxItem
          name="header"
          :accepted-values="headerValues"
          :options="headerOptions"
        />
        <DxItem name="separator"/>
        <DxItem name="orderedList"/>
        <DxItem name="bulletList"/>
      </DxToolbar>
    </DxHtmlEditor>

    <div class="options">
      <div class="value-title">
        Markdown Preview
      </div>
      <div
        class="value-content"
        tabindex="0"
      >
        {{ valueContent }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import {
  DxHtmlEditor,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/html-editor';
import { markup } from './data.ts';

const valueContent = ref(markup);
const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = { inputAttr: { 'aria-label': 'Header' } };
const converter = {

  toHtml(value) {
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

    return result;
  },
  fromHtml(value) {
    const result = unified()
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkStringify)
      .processSync(value)
      .toString();

    return result;
  },
};
</script>
<style>
.dx-htmleditor-content img {
  vertical-align: middle;
  padding-right: 10px;
  margin-bottom: 22px;
}

.value-title {
  font-size: var(--dx-font-size-sm);
  font-weight: 500;
}

.value-content {
  margin-top: 20px;
  overflow: auto;
  height: 210px;
  white-space: pre-wrap;
  border: 1px solid var(--dx-color-border);
  padding: 16px;
  background-color: var(--dx-color-main-bg);
}

.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  box-sizing: border-box;
  width: 100%;
}
</style>
