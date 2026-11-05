import { AzureOpenAI } from 'openai';
import type { OpenAI } from 'openai';
import { tools } from './data.ts';

export type AIMessage = OpenAI.ChatCompletionMessageParam;

export type AIAnswer = OpenAI.ChatCompletionMessage;

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const chatService = new AzureOpenAI(AzureOpenAIConfig);

export async function requestModel(messages: AIMessage[]): Promise<AIAnswer> {
  const params: Record<string, any> = {
    messages,
    model: AzureOpenAIConfig.deployment,
    tools,
    tool_choice: 'auto',
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await chatService.chat.completions.create(params as any, { maxRetries: 0 });

  return response.choices[0].message;
}
