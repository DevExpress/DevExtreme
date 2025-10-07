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
import { AIIntegration, type Response } from 'devextreme-vue/common/ai-integration';
import { AzureOpenAI, OpenAI } from 'openai';
import {
  markup,
  AzureOpenAIConfig,
  extractKeywordsPrompt,
} from './data.ts';

type AIMessage = (
  OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam
) & {
  content: string;
};

const aiService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal): Promise<string> {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await aiService.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content || '';

  return result;
}

const aiIntegration = new AIIntegration({
  sendRequest({ prompt }) {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system || '' },
      { role: 'user', content: prompt.user || '' },
    ];

    const promise = getAIResponse(aiPrompt, signal);

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  },
});

</script>
<style>
.dx-htmleditor-content img {
  vertical-align: middle;
  padding-right: 10px;
}
</style>
