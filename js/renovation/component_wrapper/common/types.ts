import { VNode } from 'inferno';
import { TemplateModel } from './template_wrapper';

export type AbstractFunction = (...args: any) => any;

export interface Option {
  name: string;
  fullName: string;
  value: unknown;
  previousValue: unknown;
}

export type TemplateComponent = (model: TemplateModel) => VNode;
