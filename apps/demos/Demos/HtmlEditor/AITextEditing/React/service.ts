import { AIIntegration } from 'devextreme-react/common/ai-integration';
import type { AIResponse, RequestParams, Response } from 'devextreme-react/common/ai-integration';
import { AzureOpenAI, OpenAI } from 'openai';

type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const aiService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await aiService.chat.completions.create(params, { signal });

  return response.choices[0].message?.content;
}

export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams): Response {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system ?? '' },
      { role: 'user', content: prompt.user ?? '' },
    ];

    const promise = getAIResponse(aiPrompt, signal) as Promise<AIResponse>;

    return {
      promise,
      abort: () => {
        controller.abort();
      },
    };
  },
});
