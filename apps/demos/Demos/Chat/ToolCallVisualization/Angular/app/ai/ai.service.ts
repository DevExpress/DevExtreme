import { Injectable } from '@angular/core';
import { AzureOpenAI, OpenAI } from 'openai';

export type AIMessage = OpenAI.ChatCompletionMessageParam;

export type AIAnswer = OpenAI.ChatCompletionMessage;

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

@Injectable()
export class AiService {
  chatService: AzureOpenAI;

  constructor() {
    this.chatService = new AzureOpenAI(AzureOpenAIConfig);
  }

  async requestModel(
    messages: AIMessage[],
    tools: OpenAI.ChatCompletionTool[],
  ): Promise<AIAnswer> {
    const params = {
      messages,
      model: AzureOpenAIConfig.deployment,
      tools,
      tool_choice: 'auto' as const,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.chatService.chat.completions.create(params, { maxRetries: 0 });

    return response.choices[0].message;
  }
}
