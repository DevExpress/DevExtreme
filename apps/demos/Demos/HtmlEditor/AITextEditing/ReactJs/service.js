import { AIIntegration } from 'devextreme-react/common/ai-integration';
import { AzureOpenAI } from 'openai';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};
const aiService = new AzureOpenAI(AzureOpenAIConfig);
async function getAIResponse(messages, signal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };
  const response = await aiService.chat.completions.create(params, { signal });
  return response.choices[0].message?.content;
}
export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }) {
    const controller = new AbortController();
    const signal = controller.signal;
    const aiPrompt = [
      { role: 'system', content: prompt.system ?? '' },
      { role: 'user', content: prompt.user ?? '' },
    ];
    const promise = getAIResponse(aiPrompt, signal);
    return {
      promise,
      abort: () => {
        controller.abort();
      },
    };
  },
});
