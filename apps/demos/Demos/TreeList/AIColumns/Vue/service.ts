import { AzureOpenAI, OpenAI } from 'openai';
import {
  AIIntegration,
  type RequestParams,
  type Response,
} from 'devextreme-vue/common/ai-integration';
import notify from 'devextreme/ui/notify';

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

const RATE_LIMIT_RETRY_DELAY_MS = 30000;
const MAX_PROMPT_SIZE = 5000;

const service = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await service.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content;

  if (!result) {
    throw new Error('AI response returned empty content');
  }

  return result;
}

function getAIResponseRecursive(messages: AIMessage[], signal: AbortSignal): Promise<string> {
  return getAIResponse(messages, signal)
    .catch(async (error) => {
      if (!error.message.includes('Connection error')) {
        return Promise.reject(error);
      }

      notify({
        message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
        width: 'auto',
        type: 'error',
        displayTime: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS));

      return getAIResponseRecursive(messages, signal);
    });
}

export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams): Response {
    const isValidRequest = JSON.stringify(prompt.user).length < MAX_PROMPT_SIZE;

    if (!isValidRequest) {
      return {
        promise: Promise.reject(new Error('Request is too long. Specify a shorter prompt.')),
        abort: () => {},
      };
    }

    const controller = new AbortController();
    const signal = controller.signal;

    if (!prompt.user || !prompt.system) {
      throw new Error('Invalid prompt data');
    }

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ];

    const promise = getAIResponseRecursive(aiPrompt, signal);

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  },
});
