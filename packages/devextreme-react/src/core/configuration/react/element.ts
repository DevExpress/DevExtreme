import { ITemplateMeta, Template as TemplateComponent } from '../../template';
import { NestedComponentMeta } from '../../types';

enum ElementType {
  Option,
  Template,
  Unknown,
}

interface IExpectedChild {
  optionName: string;
  isCollectionItem: boolean;
}

interface IOptionDescriptor {
  isCollection: boolean;
  name: string;
  templates: ITemplateMeta[];
  initialValuesProps: Record<string, string>;
  predefinedValuesProps: Record<string, any>;
  expectedChildren: Record<string, IExpectedChild>;
}

interface IOptionElement {
  type: ElementType.Option;
  descriptor: IOptionDescriptor;
  props: Record<string, any>;
}

function getOptionInfo(
  elementDescriptor: IElementDescriptor,
  props: Record<string, any>,
  parentExpectedChildren?: Record<string, IExpectedChild>,
): IOptionElement {
  let name = elementDescriptor.OptionName;
  let isCollectionItem = elementDescriptor.IsCollectionItem;

  const expectation = parentExpectedChildren && parentExpectedChildren[name];
  if (expectation) {
    isCollectionItem = expectation.isCollectionItem;
    if (expectation.optionName) {
      name = expectation.optionName;
    }
  }

  return {
    type: ElementType.Option,
    descriptor: {
      name,
      isCollection: !!isCollectionItem,
      templates: elementDescriptor.TemplateProps || [],
      initialValuesProps: elementDescriptor.DefaultsProps || {},
      predefinedValuesProps: elementDescriptor.PredefinedProps || {},
      expectedChildren: elementDescriptor.ExpectedChildren || {},
    },
    props,
  };
}

function getElementType(
  element: React.ReactNode,
): ElementType {
  const reactElement = element as unknown as React.ReactElement;
  if (!reactElement || !reactElement.type) {
    return ElementType.Unknown;
  }

  if (reactElement.type === TemplateComponent) {
    return ElementType.Template;
  }

  const nestedComponentMeta = reactElement.type as any as NestedComponentMeta;

  if (nestedComponentMeta.componentType === 'option') {
    return ElementType.Option;
  }

  return ElementType.Unknown;
}

interface IElementDescriptor {
  OptionName: string;
  IsCollectionItem?: boolean;
  DefaultsProps?: Record<string, string>;
  TemplateProps?: ITemplateMeta[];
  PredefinedProps?: Record<string, any>;
  ExpectedChildren?: Record<string, IExpectedChild>;
}

export {
  getElementType,
  getOptionInfo,
  ElementType,
  IOptionElement,
  IExpectedChild,
  IElementDescriptor,
  IOptionDescriptor,
};
