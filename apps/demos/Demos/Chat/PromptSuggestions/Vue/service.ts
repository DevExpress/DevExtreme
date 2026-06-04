import { AzureOpenAI, OpenAI } from 'openai';
import { type AIResponse } from 'devextreme-vue/common/ai-integration';

export type AIMessage = (
  OpenAI.ChatCompletionUserMessageParam
  | OpenAI.ChatCompletionSystemMessageParam
  | OpenAI.ChatCompletionAssistantMessageParam) & {
    content: string;
  };

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const chatService = new AzureOpenAI(AzureOpenAIConfig);

export async function getAIResponse(messages: AIMessage[]): Promise<AIResponse> {
  const params: Record<string, any> = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await chatService.chat.completions.create(params as any);
  const data = { choices: response.choices };

  return data.choices[0].message?.content || '';
}
