import { AzureOpenAI } from 'openai';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};
const chatService = new AzureOpenAI(AzureOpenAIConfig);
export async function getAIResponseStream(messages, {
  onAborted, onDelta, onError, signal,
}) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
    stream: true,
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
    if (e?.name === 'AbortError') {
      onAborted();
    }
    onError?.(e);
    throw e;
  }
}
