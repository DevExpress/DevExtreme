import { Injectable } from '@angular/core';
import { AzureOpenAI } from 'openai';

@Injectable()
export class AiService {
  chatService: AzureOpenAI;

  AzureOpenAIConfig = {
    dangerouslyAllowBrowser: true,
    deployment: 'gpt-4o-mini',
    apiVersion: '2024-02-01',
    endpoint: 'https://public-api.devexpress.com/demo-openai',
    apiKey: 'DEMO',
  };

  constructor() {
    this.chatService = new AzureOpenAI(this.AzureOpenAIConfig);
  }

  async getAIResponse(messages: any[]) {
    const params = {
      messages,
      model: this.AzureOpenAIConfig.deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.chatService.chat.completions.create(params);
    const data = { choices: response.choices };

    return data.choices[0].message?.content;
  }
}
