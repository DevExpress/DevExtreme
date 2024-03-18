import type { VNode } from 'inferno';

import type { TemplateModel } from './template_wrapper';

export interface Option {
  name: string;
  fullName: string;
  value: unknown;
  previousValue: unknown;
}

export type TemplateComponent = (model: TemplateModel) => VNode;
