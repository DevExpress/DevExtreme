import { ITemplateMeta, Template as TemplateComp } from '../../template';

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

interface ITemplateElement {
  type: ElementType.Template;
  props: Record<string, any>;
}

interface IUnknownElement {
  type: ElementType.Unknown;
}

type IElement = IOptionElement | ITemplateElement | IUnknownElement;

function getElementInfo(
  element: React.ReactNode,
  parentExpectedChildren?: Record<string, IExpectedChild>,
): IElement {
  const reactElement = element as unknown as React.ReactElement;
  if (!reactElement || !reactElement.type) {
    return {
      type: ElementType.Unknown,
    };
  }

  if (reactElement.type === TemplateComp) {
    return {
      type: ElementType.Template,
      props: reactElement.props,
    };
  }

  const elementDescriptor = reactElement.type as any as IElementDescriptor;

  if (elementDescriptor.OptionName) {
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
        isCollection: isCollectionItem,
        templates: elementDescriptor.TemplateProps || [],
        initialValuesProps: elementDescriptor.DefaultsProps || {},
        predefinedValuesProps: elementDescriptor.PredefinedProps || {},
        expectedChildren: elementDescriptor.ExpectedChildren || {},
      },
      props: reactElement.props,
    };
  }

  return {
    type: ElementType.Unknown,
  };
}

interface IElementDescriptor {
  OptionName: string;
  IsCollectionItem: boolean;
  DefaultsProps: Record<string, string>;
  TemplateProps: ITemplateMeta[];
  PredefinedProps: Record<string, any>;
  ExpectedChildren: Record<string, IExpectedChild>;
}

export {
  getElementInfo,
  ElementType,
  IElement,
  IOptionElement,
  IExpectedChild,
};
