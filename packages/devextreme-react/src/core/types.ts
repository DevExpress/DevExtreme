import { ReactNode } from 'react';
import { ITemplate } from './configuration/config-node';

interface DXTemplate {
  render: RenderFunc;
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

export interface UpdateLocker {
  lock: () => void;
  unlock: () => void;
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

export type UpdateTemplateFunc = (callback: () => void) => void;

export interface InitArgument {
  getDXTemplates: DXTemplateCreator,
  clearInstantiationModels: () => void,
  updateTemplates: UpdateTemplateFunc
 };

export interface TemplateManagerCallbackInfo { 
  callback: () => void
};

export type DXTemplateCreator = (templateOptions: Record<string, ITemplate>) => DXTemplateCollection;

export interface TemplateManagerProps {
  init: (args: InitArgument) => void;
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
