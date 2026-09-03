import { AzureOpenAI } from "openai";
const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: "demo-mini",
  apiVersion: "2024-02-01",
  endpoint: "https://public-api.devexpress.com/demo-openai",
  apiKey: "DEMO",
};
const aiService = new AzureOpenAI(AzureOpenAIConfig);
export const SYSTEM_PROMPT = `
You are a helpful AI assistant that generates analysis for individual rows, based on a given user instruction and current row data.
Input: A user prompt that describes what should be generated.
A dataset in the format: { column1: value1, column2: value2, ...}.
Instructions: The output must be in plain text and should not exceed 2000 characters.
`;
export async function getAIResponse(messages) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };
  const response = await aiService.chat.completions.create(params);
  const result = response.choices[0].message?.content;
  return result ?? "";
}
