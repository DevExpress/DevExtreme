import { OpenAI } from 'openai';

export type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

export type Employee = {
  ID: number;
  Head_ID: number;
  First_Name: string;
  Last_Name: string;
  Prefix: string;
  Title: string;
  City: string;
  State: string;
  Email: string;
  Skype?: string;
  Mobile_Phone: string;
  Birth_Date: string;
  Hire_Date: string;
  Status: string;
};
