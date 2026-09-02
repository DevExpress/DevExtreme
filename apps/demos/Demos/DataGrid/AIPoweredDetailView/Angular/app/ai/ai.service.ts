import { AzureOpenAI, OpenAI } from 'openai';
import { Injectable } from '@angular/core';

export type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const SYSTEM_PROMPT = `
You are a helpful AI assistant that generates analysis for individual rows, based on a given user instruction and current row data.
Input: A user prompt that describes what should be generated.
A dataset in the format: { column1: value1, column2: value2, ...}.
Instructions: The output must be in plain text and should not exceed 2000 characters.
`;

@Injectable()
export class AiService {
  chatService: AzureOpenAI;

  constructor() {
    this.chatService = new AzureOpenAI(AzureOpenAIConfig);
  }

  async getAIResponse(messages: AIMessage[]) {
    const params = {
      messages,
      model: AzureOpenAIConfig.deployment,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.chatService.chat.completions.create(params);
    const result = response.choices[0].message?.content;

    return result;
  }

  getSystemPrompt() {
    return SYSTEM_PROMPT;
  }
}
