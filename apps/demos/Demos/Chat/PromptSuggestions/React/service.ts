import { AzureOpenAI, OpenAI } from 'openai';
import { type AIResponse } from 'devextreme-react/common/ai-integration';

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

const wait = (delay: number): Promise<void> =>
  new Promise((resolve): void => {
    setTimeout(resolve, delay);
  });

export async function getAIResponse(messages: AIMessage[], delay?: number): Promise<AIResponse> {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await chatService.chat.completions.create(params);
  const data = { choices: response.choices };

  if (delay) {
    await wait(delay);
  }

  return data.choices[0].message?.content ?? '';
}
