import { AzureOpenAI, OpenAI } from 'openai';

export type AIMessage = (
  OpenAI.ChatCompletionUserMessageParam
  | OpenAI.ChatCompletionSystemMessageParam
  | OpenAI.ChatCompletionAssistantMessageParam) & {
    content: string;
  };

interface GetAIResponseStreamOptions {
  onAborted: () => void;
  onDelta: (delta: string) => void;
  onError?: (error: unknown) => void;
  signal: AbortSignal;
}

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const chatService = new AzureOpenAI(AzureOpenAIConfig);

export async function getAIResponseStream(
  messages: AIMessage[],
  { onAborted, onDelta, onError, signal }: GetAIResponseStreamOptions,
): Promise<void> {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
    stream: true as const,
  };

  try {
    const stream = await chatService.chat.completions.create(params, { signal });
    // eslint-disable-next-line no-restricted-syntax
    for await (const event of stream) {
      const delta = event.choices?.[0]?.delta?.content;
      if (delta) {
        onDelta(delta);
      }
    }

    if (signal.aborted) {
      onAborted();
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') {
      onAborted();
    }
    onError?.(e);
    throw e;
  }
}
