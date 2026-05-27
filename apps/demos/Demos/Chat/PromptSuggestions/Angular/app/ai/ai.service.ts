import { Injectable } from '@angular/core';
import { AzureOpenAI, OpenAI } from 'openai';
import { type AIResponse } from 'devextreme-angular/common/ai-integration';

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

@Injectable()
export class AiService {
  chatService: AzureOpenAI;

  constructor() {
    this.chatService = new AzureOpenAI(AzureOpenAIConfig);
  }

  async getAIResponse(messages: AIMessage[]): Promise<AIResponse> {
    const params = {
      messages,
      model: AzureOpenAIConfig.deployment,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.chatService.chat.completions.create(params);
    const data = { choices: response.choices };

    return data.choices[0].message?.content;
  }
}
