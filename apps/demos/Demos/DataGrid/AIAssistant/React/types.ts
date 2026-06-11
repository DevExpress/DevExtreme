import { OpenAI } from 'openai';

export type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

export interface Sale {
  Id: number;
  Product: string;
  Amount: number;
  Discount: string;
  SaleDate: string;
  Region: string;
  Sector: string;
  Channel: string;
  Customer: string;
}
