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

export type TemplateInfo = { testContainer: HTMLDivElement } | { testContainerRef: RefObject<HTMLDivElement> } | { hasTemplate: boolean };

export function useOptionScanning(
  optionElement: IOptionElement,
  templateInfo: TemplateInfo,
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
    const hasTemplate =
      'testContainer' in templateInfo && !!templateInfo.testContainer.childNodes.length ||
      'testContainerRef' in templateInfo && !!templateInfo.testContainerRef.current?.childNodes.length ||
      'hasTemplate' in templateInfo && templateInfo.hasTemplate;

    configBuilder.updateAnonymousTemplates(hasTemplate);
  }, [parentUpdateToken]);

  return [configBuilder.node, context];
}
