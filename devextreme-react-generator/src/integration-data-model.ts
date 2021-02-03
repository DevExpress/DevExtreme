export interface IModel {
  customTypes: ICustomType[];
  widgets: IWidget[];
}

export interface IWidget {
  complexOptions: IComplexProp[];
  exportPath: string;
  hasTranscludedContent: boolean;
  isEditor: boolean;
  isExtension: boolean;
  name: string;
  nesteds: IComponentRef[];
  options: IProp[];
  templates: string[];
}

export interface IProp {
  firedEvents: string[];
  isSubscribable: boolean;
  name: string;
  props: IProp[];
  types: ITypeDescr[];
}

export interface IComplexProp {
  isCollectionItem: boolean;
  name: string;
  nesteds: IComponentRef[];
  optionName: string;
  owners: string[];
  predefinedProps: Record<string, any>;
  props: IProp[];
  templates: string[];
}

export interface IComponentRef {
  componentName: string;
  isCollectionItem: boolean;
  optionName: string;
}

export interface ICustomType {
  name: string;
  props: IProp[];
  templates: string[];
  types: ITypeDescr[];
}

export interface ITypeDescr {
  acceptableValues: string[];
  isCustomType: boolean;
  type: string;
}

export interface IArrayDescr extends ITypeDescr {
  itemTypes: ITypeDescr[];
}

export interface IFunctionDescr extends ITypeDescr {
  params: {
    name: string;
    types: ITypeDescr[];
  }[];
  returnValueType: ITypeDescr;
}

export interface IObjectDescr extends ITypeDescr {
  fields: {
    name: string;
    types: ITypeDescr[];
  }[];
}
