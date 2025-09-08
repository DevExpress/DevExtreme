import { AIIntegration } from 'devextreme-react/common/ai-integration';
import { AzureOpenAI } from 'openai';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};
const aiService = new AzureOpenAI(AzureOpenAIConfig);
async function getAIResponse(messages, signal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };
  const response = await aiService.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content;
  return result;
}
export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }) {
    const controller = new AbortController();
    const signal = controller.signal;
    const aiPrompt = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ];
    const promise = getAIResponse(aiPrompt, signal);
    const result = {
      promise,
      abort: () => {
        controller.abort();
      },
    };
    return result;
  },
});
export const defaultText = `Payment: Amount - $123.00
Statement Date: 10/15/2024
Name: John Smith
Contact: (123) 456-7890
Email: john@myemail.com
Address:
- 123 Elm St Apt 4B
- New York, NY 10001
`;
