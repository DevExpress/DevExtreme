import { OpenAI } from 'openai';

export interface Vehicle {
  ID: number;
  TrademarkName: string;
  TrademarkID: number;
  Name: string;
  Modification: string;
  CategoryID: number;
  CategoryName: string;
  Price: number;
  MPGCity: number;
  MPGHighway: number;
  Doors: number;
  BodyStyleID: number;
  BodyStyleName: string;
  Cylinders: number;
  Horsepower: string;
  Torque: string;
  TransmissionSpeeds: number;
  TransmissionType: number;
  Description: string;
  DeliveryDate: boolean;
  InStock: boolean;
  Edits: string;
  LicenseName: string;
  Author: string;
  Source: string;
}

export type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};
