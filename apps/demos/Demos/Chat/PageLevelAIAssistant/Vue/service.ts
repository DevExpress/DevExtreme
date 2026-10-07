import { AzureOpenAI, type OpenAI } from 'openai';
import notify from 'devextreme/ui/notify';
import { AIIntegration } from 'devextreme-vue/common/ai-integration';
import type { RequestParams, AIResponse } from 'devextreme-vue/common/ai-integration';
import {
  AI_SERVICE_CONFIG, ChatCommandError, MAX_PROMPT_SIZE, RATE_LIMIT_RETRY_DELAY_MS,
} from './data.ts';

const aiService = new AzureOpenAI(AI_SERVICE_CONFIG);

async function getAIResponse(
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
  messages: OpenAI.ChatCompletionMessageParam[],
  signal: AbortSignal,
): Promise<AIResponse> {
  return getAIResponse(messages, signal).catch(async (error: Error) => {
    if (!error.message.includes('Connection error')) {
      throw error;
    }

    notify({
      message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
      width: 'auto',
      type: 'error',
      displayTime: 5000,
    });

    await new Promise((resolve) => { setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS); });

    return getAIResponseRecursive(messages, signal);
  });
}

export const aiIntegration = new AIIntegration({
  sendRequest(params: RequestParams) {
    const { prompt, data } = params;
    const isValidRequest = JSON.stringify(prompt.user).length < MAX_PROMPT_SIZE;

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
    const promise = getAIResponseRecursive(aiPrompt, signal);

    return {
      promise,
      abort: () => {
        controller.abort();
      },
    };
  },
});
