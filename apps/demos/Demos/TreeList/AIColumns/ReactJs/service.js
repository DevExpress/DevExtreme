import { AzureOpenAI } from 'openai';
import { AIIntegration } from 'devextreme-react/common/ai-integration';
import notify from 'devextreme/ui/notify';

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
  const result = response.choices[0].message?.content;
  return result ?? '';
}
function getAIResponseRecursive(messages, signal) {
  return getAIResponse(messages, signal).catch(async (error) => {
    if (!error.message.includes('Connection error')) {
      return Promise.reject(error);
    }
    notify({
      message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
      width: 'auto',
      type: 'error',
      displayTime: 5000,
    });
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return getAIResponseRecursive(messages, signal);
  });
}
export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }) {
    const isValidRequest = JSON.stringify(prompt.user).length < 5000;
    if (!isValidRequest) {
      return {
        promise: Promise.reject(new Error('Request is too long. Specify a shorter prompt.')),
        abort: () => {},
      };
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const aiPrompt = [
      { role: 'system', content: prompt.system ?? '' },
      { role: 'user', content: prompt.user ?? '' },
    ];
    const promise = getAIResponseRecursive(aiPrompt, signal);
    const result = {
      promise,
      abort: () => {
        controller.abort();
      },
    };
    return result;
  },
});
