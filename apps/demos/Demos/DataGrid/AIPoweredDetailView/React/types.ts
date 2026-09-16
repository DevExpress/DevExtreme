import { OpenAI } from 'openai';
import { type DataGridTypes } from 'devextreme-react/data-grid';

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

export type DetailViewProps = DataGridTypes.MasterDetailTemplateData & {
  registerAbortRequest: (abortRequest: () => void) => void;
  unregisterAbortRequest: (abortRequest: () => void) => void;
};
