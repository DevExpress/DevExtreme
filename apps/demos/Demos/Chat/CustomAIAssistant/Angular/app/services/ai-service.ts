import { AzureOpenAI, type OpenAI } from 'openai';
import notify from 'devextreme/ui/notify';
import { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type { RequestParams, AIResponse } from 'devextreme-angular/common/ai-integration';
import { AI_SERVICE_CONFIG } from '../data/data';
import { ChatCommandError } from '../types/types';

async function getAIResponse(
  aiService: AzureOpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  signal: AbortSignal,
): Promise<AIResponse> {
  const params = {
    messages,
    model: AI_SERVICE_CONFIG.deployment,
    max_completion_tokens: 1000,
    temperature: 0,
  };

  const response = await aiService.chat.completions.create(params, { signal });

  return response.choices[0].message?.content ?? '';
}

function getAIResponseRecursive(
  aiService: AzureOpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  signal: AbortSignal,
): Promise<AIResponse> {
  return getAIResponse(aiService, messages, signal).catch(async (error: Error) => {
    if (!error.message.includes('Connection error')) {
      throw error;
    }

    notify({
      message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
      width: 'auto',
      type: 'error',
      displayTime: 5000,
    });

    await new Promise((resolve) => { setTimeout(resolve, 30000); });

    return getAIResponseRecursive(aiService, messages, signal);
  });
}

export function createAiIntegration(): AIIntegration {
  const aiService = new AzureOpenAI({
    dangerouslyAllowBrowser: true,
    deployment: AI_SERVICE_CONFIG.deployment,
    endpoint: AI_SERVICE_CONFIG.endpoint,
    apiVersion: AI_SERVICE_CONFIG.apiVersion,
    apiKey: AI_SERVICE_CONFIG.apiKey,
  });

  return new AIIntegration({
    sendRequest(params: RequestParams) {
      const { prompt, data } = params;
      const isValidRequest = JSON.stringify(prompt.user).length < 20000;

      if (!isValidRequest) {
        return {
          promise: Promise.reject(
            new ChatCommandError('❌ This message is too long for me to process. Please shorten it and try again.'),
          ),
          abort: () => {},
        };
      }

      const controller = new AbortController();
      const { signal } = controller;

      const isSmartPasteRequest = Array.isArray((data as { fields?: unknown[] } | undefined)?.fields);
      const system = isSmartPasteRequest
        ? `${prompt.system ?? ''} IMPORTANT: reply on a SINGLE line with no line breaks of any kind - use ';;;' as the only separator between fields.`
        : prompt.system ?? '';

      const aiPrompt: OpenAI.ChatCompletionMessageParam[] = [
        { role: 'system', content: system },
        { role: 'user', content: prompt.user ?? '' },
      ];
      const promise = getAIResponseRecursive(aiService, aiPrompt, signal);

      return {
        promise,
        abort: () => {
          controller.abort();
        },
      };
    },
  });
}
