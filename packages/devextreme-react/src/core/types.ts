import { ReactNode } from 'react';
import { ITemplate } from './configuration/config-node';

interface DXTemplate {
  render: RenderFunc;
}

export interface NestedComponentMeta {
  componentType: 'option' | 'extension';
}

type RenderFunc = (arg: RenderArgs) => HTMLElement;

interface TemplateArgs {
  data: any;
  index?: number;
  onRendered: () => void;
}

export interface RenderArgs {
  model?: any;
  container: any;
  index?: any;
  onRendered?: () => void;
}

export type DXTemplateCollection = Record<string, DXTemplate>;

export interface TemplateWrapperProps {
  templateFactory: TemplateFunc;
  data: any;
  index: number;
  container: HTMLElement;
  onRendered: () => void;
  onRemoved: () => void;
}

export type TemplateFunc = (arg: TemplateArgs) => JSX.Element | ReactNode;

export type UpdateTemplateFunc = (onUpdated: () => void) => void;

export interface InitArgument {
  createDXTemplates: DXTemplateCreator;
  clearInstantiationModels: () => void;
  updateTemplates: UpdateTemplateFunc;
}

export interface TemplateManagerUpdateContext {
  onUpdated: () => void;
}

export type DXTemplateCreator = (templateOptions: Record<string, ITemplate>) => DXTemplateCollection;

export interface TemplateManagerProps {
  init: (args: InitArgument) => void;
  onTemplatesRendered: () => void;
}

export interface TemplateInstantiationModel {
  templateKey: string;
  componentKey: string;
  index: any;
  onRendered: () => void;
  onRemoved: () => void;
}

export type GetRenderFuncFn = (templateKey: string) => RenderFunc;

export interface DXRemoveCustomArgs {
  isUnmounting: boolean;
}
