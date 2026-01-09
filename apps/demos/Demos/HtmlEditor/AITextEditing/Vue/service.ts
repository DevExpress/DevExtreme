import { AzureOpenAI, OpenAI } from 'openai';
import {
  AIIntegration,
  type RequestParams,
  type Response,
} from 'devextreme-vue/common/ai-integration';
import { AzureOpenAIConfig } from './data.ts';

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

export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams): Response {
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
