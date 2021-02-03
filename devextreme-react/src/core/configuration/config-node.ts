interface IConfigNode {
  readonly fullName: string;
  readonly predefinedOptions: Record<string, any>;
  readonly initialOptions: Record<string, any>;
  readonly options: Record<string, any>;
  readonly templates: ITemplate[];
  readonly configs: Record<string, IConfigNode>;
  readonly configCollections: Record<string, IConfigNode[]>;
}

interface ITemplate {
  optionName: string;
  isAnonymous: boolean;
  type: 'component' | 'render' | 'children';
  content: any;
  keyFn?: (data: any) => string;
}

export {
  IConfigNode,
  ITemplate,
};
