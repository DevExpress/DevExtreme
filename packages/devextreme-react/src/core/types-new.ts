import { ITemplate } from './configuration/config-node';
import { DoubleKeyMap } from './helpers';

export type RenderArgs = {
  model?: any;
  container: any;
  index?: any;
  onRendered?: () => void;
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
  content: any;
  container: HTMLElement;
  onRendered: () => void;
  onRemoved: () => void;
}

export type TemplateFunc = (arg: TemplateArgs) => JSX.Element;

export type DXTemplateCreator = (templateOptions: Record<string, ITemplate>) => DXTemplateCollection;

export type TemplateManagerProps = {
  init: (getDxTemplates: DXTemplateCreator) => void;
};

export type TemplateInstanceDefinition = {
  templateKey: string;
  componentKey: string;
  index: any;
  onRendered: () => void;
  onRemoved: () => void;
}

export type GetRenderFuncFn = (templateKey: string) => RenderFunc;

export type RenderedTemplateInstances = DoubleKeyMap<any, HTMLElement, TemplateInstanceDefinition>;
