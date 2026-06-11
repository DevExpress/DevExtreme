import { AzureOpenAI } from 'openai';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};
const chatService = new AzureOpenAI(AzureOpenAIConfig);
const wait = (delay) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
export async function getAIResponse(messages, delay) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };
  const response = await chatService.chat.completions.create(params);
  const data = { choices: response.choices };
  if (delay) {
    await wait(delay);
  }
  return data.choices[0].message?.content ?? '';
}
