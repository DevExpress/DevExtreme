import { AzureOpenAI } from 'openai';
import { AIIntegration } from 'devextreme-react/common/ai-integration';

const deployment = 'demo-mini';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiVersion = '2024-02-01';
const apiKey = 'DEMO';
const aiService = new AzureOpenAI({
  dangerouslyAllowBrowser: true,
  deployment,
  endpoint,
  apiVersion,
  apiKey,
});
async function getAIResponse(messages, signal) {
  const response = await aiService.chat.completions.create({
    messages,
    model: deployment,
    max_completion_tokens: 1000,
    temperature: 0,
  }, { signal });
  return response.choices[0].message?.content ?? '';
}
async function getAIResponseRecursive(messages, signal) {
  try {
    return await getAIResponse(messages, signal);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('Connection error')) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return getAIResponseRecursive(messages, signal);
  }
}
export function createAiIntegration() {
  return new AIIntegration({
    sendRequest({ prompt, data }) {
      const isValidRequest = JSON.stringify(prompt.user).length < 20000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(new Error('❌ This message is too long for me to process. Please shorten it and try again.')),
          abort: () => undefined,
        };
      }
      const controller = new AbortController();
      const signal = controller.signal;
      const isSmartPasteRequest = Array.isArray(data?.fields);
      const system = isSmartPasteRequest
        ? `${prompt.system ?? ''} IMPORTANT: reply on a SINGLE line with no line breaks of any kind - use ';;;' as the only separator between fields.`
        : prompt.system ?? '';
      const messages = [
        { role: 'system', content: system },
        { role: 'user', content: prompt.user ?? '' },
      ];
      return {
        promise: getAIResponseRecursive(messages, signal),
        abort: () => {
          controller.abort();
        },
      };
    },
  });
}
