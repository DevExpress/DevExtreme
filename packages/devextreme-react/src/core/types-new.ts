import { ITemplate } from './configuration/config-node';
import { DoubleKeyMap } from './helpers';

export type RenderArgs = {
  model?: any;
  container: any;
  index?: any;
  onRendered: () => void;
};

export type OnRenderedLocker = {
  lock: () => void;
  unlock: () => void;
}

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

export type TemplateManagerProps = {
  dryRun: boolean;
  templateOptions: Record<string, ITemplate>;
  init: (dxTemplates: DXTemplateCollection) => void;
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
