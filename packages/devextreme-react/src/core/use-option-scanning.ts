import {
  Children,
  ReactNode,
  ReactElement,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';

import { ElementType, getElementType, IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { createConfigBuilder, IConfigNode } from './configuration/config-node';
import { getNamedTemplate } from './configuration/react/templates';
import { ITemplateProps } from './template';
import { NestedOptionContext, NestedOptionContextContent } from './contexts';

export function useOptionScanning(
  optionElement: IOptionElement,
  children: ReactNode,
  templateContainer: HTMLDivElement | undefined,
  parentUpdateToken: symbol,
): [
    IConfigNode,
    NestedOptionContextContent,
  ] {
  const parentContext = useContext(NestedOptionContext);

  const {
    parentFullName,
  } = parentContext;

  const updateToken = Symbol('update token');

  const configBuilder = createConfigBuilder(optionElement, parentFullName);

  Children.forEach(
    children,
    (child) => {
      const elementType = getElementType(child);
      if (elementType === ElementType.Template) {
        const templateElement = child as ReactElement<ITemplateProps>;
        const template = getNamedTemplate(templateElement.props);

        if (template) {
          configBuilder.addTemplate(template);
        }
      }
    },
  );

  const childComponentCounter = useRef(0);

  const context: NestedOptionContextContent = {
    parentExpectedChildren: optionElement.descriptor.expectedChildren,
    parentFullName: mergeNameParts(parentFullName, optionElement.descriptor.name),
    treeUpdateToken: updateToken,
    getOptionComponentKey: () => {
      childComponentCounter.current += 1;
      return childComponentCounter.current;
    },
    onChildOptionsReady: (childConfigNode, childDescriptor, childUpdateToken, childComponentKey) => {
      if (childUpdateToken !== updateToken) {
        return;
      }

      const { isCollection, name } = childDescriptor;

      if (isCollection) {
        configBuilder.addCollectionNode(name, childConfigNode, childComponentKey);
        return;
      }

      configBuilder.addChildNode(name, childConfigNode);
    },
  };

  useLayoutEffect(() => {
    if (!templateContainer) {
      return;
    }

    const hasTemplateRendered = templateContainer.childNodes.length > 0;

    configBuilder.updateAnonymousTemplates(hasTemplateRendered);
  }, [parentUpdateToken]);

  return [configBuilder.node, context];
}
