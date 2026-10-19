import { ReactNode } from 'react';

export interface ITemplate {
  optionName: string;
  isAnonymous: boolean;
  type: 'component' | 'render' | 'children';
  content: any;
}

export interface IConfigNode {
  parentNode?: IConfigNode | undefined;
  index?: number | undefined;
  templates: ITemplate[];
  readonly name: string;
  readonly predefinedOptions: Record<string, any>;
  readonly initialOptions: Record<string, any>;
  readonly options: Record<string, any>;
  readonly configs: Record<string, IConfigNode>;
  readonly configCollections: Record<string, IConfigNode[]>;
}

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

export interface GuardObject {
  handler: () => void;
  latestValue: unknown;
}

export interface TemplateWrapperProps {
  templateFactory: TemplateFunc;
  data: any;
  index: number;
  container: HTMLElement;
  componentKey: string;
  onRendered: () => void;
  onRemoved: (componentKey: string) => void;
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

// eslint-disable-next-line @stylistic/max-len
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
  onRemoved: (componentKey: string) => void;
  onContainerRemoved: () => void;
}

export type GetRenderFuncFn = (templateKey: string) => RenderFunc;

export interface DXRemoveCustomArgs {
  // eslint-disable-next-line spellcheck/spell-checker
  isUnmounting: boolean;
}
