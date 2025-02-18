import {
  useContext,
  useRef,
  useLayoutEffect,
  RefObject,
} from 'react';

import { IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { createConfigBuilder, IConfigNode } from './configuration/config-node';
import { NestedOptionContext, NestedOptionContextContent } from './contexts';

export function useOptionScanning(
  optionElement: IOptionElement,
  templateContainer: HTMLDivElement | RefObject<HTMLDivElement>,
  parentUpdateToken: symbol,
  parentType: 'option' | 'component',
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

  const childComponentCounter = useRef(0);

  const context: NestedOptionContextContent = {
    parentExpectedChildren: optionElement.descriptor.expectedChildren,
    parentFullName: mergeNameParts(parentFullName, optionElement.descriptor.name),
    parentType,
    treeUpdateToken: updateToken,
    getOptionComponentKey: () => {
      childComponentCounter.current += 1;
      return childComponentCounter.current;
    },
    onNamedTemplateReady: (template, childUpdateToken) => {
      if (childUpdateToken !== updateToken) {
        return;
      }

      if (template) {
        configBuilder.addTemplate(template);
      }
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
    const container = templateContainer && 'current' in templateContainer
      ? templateContainer.current
      : templateContainer;

    const hasTemplateRendered = !!container && container.childNodes.length > 0;
    configBuilder.updateAnonymousTemplates(hasTemplateRendered);
  }, [parentUpdateToken]);

  return [configBuilder.node, context];
}
