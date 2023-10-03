import { FunctionComponent } from 'react';
import { ITemplate } from './configuration/config-node';

export type RenderArgs = {
  model?: any;
  container: any;
  index?: any;
  onRendered: () => void;
};

export type DXTemplateCollection = Record<string, DevExtremeTemplate>;

export type DevExtremeTemplate = {
  render: RenderFunc;
};

export type RenderFunc = (arg: RenderArgs) => void;

export type TemplateArgs = {
  data: any;
  index?: number;
  onRendered: () => void;
}

export interface TemplateWrapperProps {
  templateFactory: FunctionComponent<TemplateArgs>;
  data: any;
  index: any;
  container: HTMLElement;
  onRendered: () => void;
  onRemoved: () => void;
}

export type TemplateFunc = (arg: TemplateArgs) => JSX.Element;

export type TemplateManagerProps = {
  templateOptions: Record<string, ITemplate>;
  init: (dxTemplates: DXTemplateCollection) => void;
};

export type TemplateInstanceDefinition = {
  componentKey: string;
  data: any;
  index: any;
  container: HTMLElement;
  getJSX: TemplateFunc;
  onRendered: () => void;
  onRemoved: () => void;
}

export type GetRenderFuncFn = (func: TemplateFunc) => RenderFunc;

export type RenderedTemplateInstances = {
  containers: Record<string, HTMLElement>;
  instances: Record<string, TemplateInstanceDefinition>;
};
