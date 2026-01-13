<template>
  <DxHtmlEditor
    :value="markup"
    :height="530"
    :ai-integration="aiIntegration"
  >
    <DxToolbar>
      <DxToolbarItem name="ai">
        <DxCommand name="summarize"/>
        <DxCommand name="proofread"/>
        <DxCommand name="expand"/>
        <DxCommand name="shorten"/>
        <DxCommand name="changeStyle"/>
        <DxCommand name="changeTone"/>
        <DxCommand name="translate"/>
        <DxCommand name="askAI"/>
        <DxCommand
          name="custom"
          text="Extract Keywords"
          :prompt="extractKeywordsPrompt"
        />
      </DxToolbarItem>
      <DxToolbarItem name="separator"/>
      <DxToolbarItem name="undo"/>
      <DxToolbarItem name="redo"/>
    </DxToolbar>
  </DxHtmlEditor>
</template>
<script setup lang="ts">
import {
  DxHtmlEditor,
  DxToolbar,
  DxToolbarItem,
  DxCommand,
} from 'devextreme-vue/html-editor';
import {
  markup,
  extractKeywordsPrompt,
} from './data.ts';
import { aiIntegration } from './service.ts';

</script>
<style>
.dx-htmleditor-content img {
  vertical-align: middle;
  padding-right: 10px;
}
</style>
